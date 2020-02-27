// constants
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// configuration
const package = require('../package.json');
const settings = require('./webpack.settings');

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

// Configure Babel loader
const configureBabelLoader = browserList => {
    return {
        test: /\.jsx?$/,
        exclude: settings.babelLoaderConfig.exclude,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            corejs: {
                                version: 3,
                                proposals: true,
                            },
                            useBuiltIns: 'usage',
                            targets: {
                                browsers: browserList,
                            },
                        },
                    ],
                ],
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-object-assign',
                    '@babel/plugin-transform-runtime',
                ],
            },
        },
    };
};

// Configure Font loader
const configureFontLoader = () => {
    return {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: ['/images/', '/svg/'],
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
        ],
    };
};

// Configure Manifest
const configureManifest = fileName => {
    return {
        fileName: fileName,
        basePath: settings.manifestConfig.basePath,
        publicPath: '',
        writeToFileEmit: true,
        seed: {},
        map: file => {
            file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
            return file;
        },
    };
};

// Base Webpack configuration
const configBase = mode => {
    return {
        name: package.name,
        context: path.resolve(settings.paths.src.base),
        entry: settings.entries,
        output: {
            path: settings.paths.dist.path,
            publicPath: settings.paths.dist.publicPath,
        },
        resolve: {
            moduleExtensions: ['-loader'],
            extensions: ['.js', '.jsx', '.json', '.css', '.less'],
            modules: [
                path.join(settings.paths.src.js),
                path.join('./node_modules'),
            ],
        },
        module: {
            rules: [configureFontLoader()],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            new CopyWebpackPlugin(settings.copyWebpackConfig),
            new webpack.DefinePlugin({
                __DEV__: mode !== 'production',
                __PROD__: mode === 'production',
                __VERSION__: JSON.stringify(package.version),
            }),
        ],
    };
};

// Legacy webpack config
const configLegacy = {
    module: {
        rules: [
            configureBabelLoader(
                Object.values(package.browserslist.legacyBrowsers)
            ),
        ],
    },
    plugins: [
        new WebpackManifestPlugin(configureManifest('manifest-legacy.json')),
    ],
};

// Modern webpack config
const configModern = {
    module: {
        rules: [
            configureBabelLoader(
                Object.values(package.browserslist.modernBrowsers)
            ),
        ],
    },
    plugins: [new WebpackManifestPlugin(configureManifest('manifest.json'))],
};

module.exports = mode => {
    return {
        configLegacy: merge.strategy({
            module: 'prepend',
            plugins: 'prepend',
        })(configBase(mode), configLegacy),
        configModern: merge.strategy({
            module: 'prepend',
            plugins: 'prepend',
        })(configBase(mode), configModern),
    };
};
