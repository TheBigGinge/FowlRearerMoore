const webpack = require('webpack');
const path = require('path');
const {
    commonRules,
    getConfigModel,
    externals,
    resolve,
    stats,
    node } = require('./webpackHelpers');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const hostname = '0.0.0.0';
const port = 9091;

// Generates an HTML file based on specified template
// which references the generated bundles, among other things
const htmlPlugin = new HtmlWebpackPlugin({
    // use a custom template to allow us to place the includes where we want
    template: path.resolve(__dirname) + '/index-dev-template.html',

    filename: getConfigModel().htmlPluginFilename,

    title: 'Fowl Fanciness',

    favicon: 'favicon.ico',

    chunks: ['index', 'main'],

    // don't inject because we have a custom template
    inject: false,

    excludeCSS: [],

    // exclude index.js from output because it should have no content
    excludeJS: ['/js/index.bundle.js'],
});

module.exports = [
    {
        context: path.resolve(__dirname, './src'),
        entry: {
            index: getConfigModel().indexEntry,
            main: getConfigModel().mainEntry,
        },
        output: {
            filename: getConfigModel().outputFilename,
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
        },
        devtool: 'source-map',
        module: {
            rules: [
                commonRules.sourceMapRule,
                {
                    test: /\.(ts|tsx)$/,
                    exclude: [/node_modules/],
                    use: [
                        { loader: 'react-hot-loader/webpack' },
                        // convert JSX, es6
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: './build/.babelCache',
                                presets: getConfigModel().babelPresets,
                                plugins: getConfigModel().babelPlugins
                            }
                        },
                        // convert typescript to js
                        { loader: 'awesome-typescript-loader' }
                    ]
                },
                {
                    // JavaScript files, which will be transpiled
                    // based on .babelrc
                    test: /\.(js|jsx)$/,
                    use: [
                        { loader: 'react-hot-loader/webpack' },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: './build/.babelCache',
                                presets: getConfigModel().babelPresets,
                                plugins: getConfigModel().babelPlugins
                            }
                        }
                    ]
                },
                {
                    // SASS files run through Sass-processor
                    // before generic CSS loader
                    test: /\.scss$/,
                    use: [
                        { loader: 'style-loader'},
                        { loader: 'css-loader' },   // translates CSS into CommonJS
                        { loader: 'sass-loader' }   // compiles Sass to CSS
                    ]
                },
                {
                    // Pure CSS runs through generic loader
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' },   // translates CSS into CommonJS
                    ],
                },
                {
                    // Run SVG files through a loader which will inline the content
                    // as a data URI
                    test: /\.svg/,
                    use: [{
                        loader: 'svg-url-loader',
                        options: getConfigModel().svgOptions,
                    }],
                    // only inline SVGs as dataURI for our index file
                    issuer: /index.scss/
                },
                commonRules.copySVGRule,
                commonRules.imagesRule,
                commonRules.fontRule
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            htmlPlugin,
            new webpack.DefinePlugin({
                debugLogging: JSON.stringify(true)
            })
        ],
        externals,
        resolve,
        stats,
        node,
        devServer: {
            contentBase: path.resolve(__dirname, './dist'),
            host: hostname,
            port: port,
            hot: true,
            quiet: false,
            disableHostCheck: true, // needed so can access via http://hostname:port/
            historyApiFallback: true,
        }
    }
];

