// constants
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// configuration
const common = require('./webpack.common');
const package = require('../package.json');
const settings = require('./webpack.settings');
const utils = require('./webpack.utils');

// node modules
const glob = require('glob-all');
const merge = require('webpack-merge');
const moment = require('moment');
const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Configure file banner
const configureBanner = () => {
    return {
        banner: [
            `/*!`,
            ` * @project        ${settings.name}`,
            ` * @author         ${package.author.name}`,
            ` * @build          ${moment().format('llll')} ET`,
            // prettier-ignore
            ` * @copyright      Copyright (c) ${moment().format('YYYY')} ${settings.copyright}`,
            ` */`,
        ].join('\n'),
        raw: true,
    };
};

// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        cleanOnceBeforeBuildPatterns: settings.paths.dist.clean,
        verbose: true,
        dry: false,
    };
};

// Configure optimization
const configureOptimization = buildType => {
    if (buildType === LEGACY_CONFIG) {
        return {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        name: 'vendor',
                        filename: 'js/[name]-legacy.js',
                        test: /[\\/]node_modules[\\/]|vendor[\\/]/,
                        enforce: true,
                    },
                },
            },
            minimizer: [
                new TerserPlugin(configureTerser()),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false,
                            annotation: true,
                        },
                        safe: true,
                        discardComments: true,
                    },
                }),
            ],
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        name: 'vendor',
                        filename: 'js/[name]-modern.js',
                        test: /[\\/]node_modules[\\/]|vendor[\\/]/,
                        enforce: true,
                    },
                },
            },
            minimizer: [new TerserPlugin(configureTerser())],
        };
    }
};

// Configure PurgeCSS
const configurePurgeCss = () => {
    let paths = [];
    for (const [key, value] of Object.entries(settings.purgeCssConfig.paths)) {
        paths.push(value);
    }

    console.log('files ' + glob.sync(paths));

    return {
        paths: glob.sync(paths),
        //whitelist: WhitelisterPlugin(settings.purgeCssConfig.whitelist),
        whitelistPatterns: settings.purgeCssConfig.whitelistPatterns,
        extractors: [
            {
                extractor: utils.TailwindExtractor,
                extensions: settings.purgeCssConfig.extensions,
            },
        ],
    };
};

// Configure terser
const configureTerser = () => {
    return {
        cache: true,
        parallel: true,
        sourceMap: true,
    };
};

module.exports = (env, argv) => {
    const mode = argv.mode;

    return [
        merge(common(mode).configLegacy, {
            output: {
                filename: 'js/[name]-legacy.js',
            },
            devtool: 'source-map',
            plugins: [
                new ImageminPlugin(),
                new PurgecssPlugin(configurePurgeCss()),
                new webpack.BannerPlugin(configureBanner()),
            ],
            optimization: configureOptimization(LEGACY_CONFIG),
        }),
        merge(common(mode).configModern, {
            output: {
                filename: 'js/[name].js',
            },
            devtool: 'source-map',
            plugins: [new CleanWebpackPlugin(configureCleanWebpack())],
            optimization: configureOptimization(MODERN_CONFIG),
        }),
    ];
};
