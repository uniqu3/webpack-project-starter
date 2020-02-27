// Configuration
const common = require('./webpack.common');
const settings = require('./webpack.settings');
const package = require('../package.json');

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Configure the webpack-dev-server
const configureDevServer = () => {
    return {
        public: settings.devServerConfig.public,
        host: settings.devServerConfig.host,
        port: settings.devServerConfig.port,
        https: !!parseInt(settings.devServerConfig.https),
        proxy: settings.devServerConfig.proxy,
        contentBase: settings.devServerConfig.contentBase,
        disableHostCheck: true,
        hot: false,
        overlay: true,
        watchContentBase: true,
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll),
            ignored: /node_modules/,
        },
        stats: {
            colors: true,
            chunks: false,
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
    };
};

// Configure Image loader
const configureImageLoader = () => {
    return {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        exclude: ['/fonts/', '/svg/'],
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash].[ext]',
                },
            },
        ],
    };
};

// Configure the Postcss loader
const configurePostcssLoader = () => {
    return {
        test: /\.(css|less)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    importLoaders: 1,
                    sourceMap: true,
                },
            },
            {
                loader: 'resolve-url-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                },
            },
            'less-loader',
        ],
    };
};

module.exports = (env, argv) => {
    const mode = argv.mode;

    return merge([
        common(mode).configModern,
        {
            output: {
                filename: 'js/[name].js',
                hotUpdateChunkFilename: 'hot/hot-update.js',
                hotUpdateMainFilename: 'hot/hot-update.json',
            },
            devtool: 'inline-source-map',
            devServer: configureDevServer(),
            module: {
                rules: [configurePostcssLoader(), configureImageLoader()],
            },
            plugins: [new webpack.HotModuleReplacementPlugin()],
        },
    ]);
};
