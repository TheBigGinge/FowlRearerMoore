const webpack = require('webpack');
const path = require('path');
const {
    commonRules,
    getConfigModel,
    externals,
    resolve,
    stats,
    node } = require('./webpackHelpers');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const ExternalDependenciesPlugin = require('@payscale/external-dependencies-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

// plugin to extract CSS out of JS into own file
const extractCss = new ExtractTextPlugin({
    filename: getConfigModel().extractCssFilename
});

// Will inline specific CSS files in the HTML output by plugin above instead
// of referencing them as a link to an external file
const inlineStylePlugin = new StyleExtHtmlWebpackPlugin({
    position: 'head-bottom',
    minify: true,
    chunks: ['index']
});

const uglifyPlugin = new Uglify({
    sourceMap: true,
    uglifyOptions: {
        ecma: getConfigModel().ecmaVersion,
        compress: true
    }
});

// Generates an HTML file based on specified template
// which references the generated bundles, among other things
const htmlPlugin = new HtmlWebpackPlugin({
    hash: true,

    // use a custom template to allow us to place the includes where we want
    template: 'index-template.html',

    filename: getConfigModel().htmlPluginFilename,

    title: 'Fowl Fanciness',

    favicon: 'favicon.ico',

    chunks: ['index', 'main' ],

    // don't inject because we have a custom template
    inject: false,

    // minify HTML output with these options
    minify: {
        collapseWhitespace: true,
        minifyJS: true
    },
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
            chunkFilename: getConfigModel().outputChunkFilename,
            publicPath: '/'
        },
        devtool: 'hidden-source-map',
        module: {
            rules: [
                commonRules.sourceMapRule,
                {
                    // Typescript files, which will get converted
                    // to JavaScript files based on tsconfig.json,
                    // then converted by babel like regular JS
                    test: /\.(ts|tsx)$/,
                    exclude: [/node_modules/],
                    use: [
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
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: './build/.babelCache',
                            presets: getConfigModel().babelPresets,
                            plugins: getConfigModel().babelPlugins
                        }
                    }] // convert JSX, es6
                },
                {
                    // SASS files run through Sass-processor
                    // before generic CSS loader
                    test: /\.scss$/,
                    use: extractCss.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                }
                            },   // translates CSS into CommonJS
                            { loader: 'sass-loader' }   // compiles Sass to CSS
                        ],
                    })
                },
                {
                    // Pure CSS runs through generic loader
                    test: /\.css$/,
                    use: extractCss.extract({
                        use: [{ // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                minimize: true,
                            }
                        }],
                    })
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
            extractCss,
            htmlPlugin,
            inlineStylePlugin,
            uglifyPlugin,
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new ExternalDependenciesPlugin({
                chunks: ['main'],
                outputFilename: getConfigModel().dependencyPluginFilename,
                outputPath: path.resolve(__dirname)
            })
        ],
        stats,
        externals,
        resolve,
        node
    }
];