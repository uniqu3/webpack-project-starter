// Node modules
require('dotenv').config();
const path = require('path');

// Paths
const PATH_DIST = process.env.PATH_DIST || 'dist/';
const PATH_PUBLIC = process.env.PATH_PUBLIC || './public/';
// URLs
const URL_DEV = process.env.URL_DEV || 'http://localhost/';
const URL_LIVE = process.env.URL_LIVE || 'https://localhost/';
// DEV Server
const DEVSERVER_PUBLIC =
    process.env.DEVSERVER_PUBLIC || 'http://localhost:8080';
const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'localhost';
const DEVSERVER_POLL = process.env.DEVSERVER_POLL || false;
const DEVSERVER_PORT = process.env.DEVSERVER_PORT || 8080;
const DEVSERVER_HTTPS = process.env.DEVSERVER_HTTPS || false;

module.exports = {
    name: 'Project name',
    copyright: 'idea arts kreativagentur',
    paths: {
        src: {
            base: './src/',
            css: './src/css/',
            js: './src/js/',
        },
        dist: {
            path: path.resolve(PATH_PUBLIC + PATH_DIST),
            publicPath: PATH_DIST,
            dist: PATH_DIST,
        },
        templates: './templates/',
    },
    urls: {
        dev: URL_DEV,
        live: URL_LIVE,
    },
    entries: {
        app: ['./js/app.js', './css/app.less'],
    },
    devServerConfig: {
        public: DEVSERVER_PUBLIC,
        host: DEVSERVER_HOST,
        poll: DEVSERVER_POLL,
        port: DEVSERVER_PORT,
        https: DEVSERVER_HTTPS,
        proxy: { '*': DEVSERVER_PUBLIC },
        contentBase: path.resolve(PATH_PUBLIC + 'site/templates/'),
    },
    manifestConfig: {
        basePath: '',
    },
    babelLoaderConfig: {
        exclude: [/(node_modules|bower_components)/],
    },
    copyWebpackConfig: [
        {
            from: path.resolve('./src'),
            to: path.resolve(PATH_PUBLIC + PATH_DIST),
            ignore: ['.*', '**/js/**', '**/scss/**', '**/less/**'],
        },
    ],
};
