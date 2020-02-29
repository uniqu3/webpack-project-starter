// Configuration
const common = require('./webpack.common');
const settings = require('./webpack.settings');
const package = require('../package.json');

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

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

module.exports = (env, argv) => {
    const mode = argv.mode;

    return merge(common(mode).configModern, {
        output: {
            filename: 'js/[name].js',
            hotUpdateChunkFilename: 'hot/hot-update.js',
            hotUpdateMainFilename: 'hot/hot-update.json',
        },
        devtool: 'inline-source-map',
        devServer: configureDevServer(),
        plugins: [new webpack.HotModuleReplacementPlugin()],
    });
};
