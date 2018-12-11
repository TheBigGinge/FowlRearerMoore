const path = require('path');
const getConfigModel = () => {
    return {
        babelPlugins:
            [],
        babelPresets: [['env', {
            'useBuiltIns': true,
            'modules': false,
            'targets': {
                'browsers':
                    [
                        'last 2 Chrome versions'
                    ]
            }
        }]],
        dependencyPluginFilename:
            'dependencies.json',
        ecmaVersion: 6,
        extractCssFilename: 'css/[name].bundle.css',
        htmlPluginFilename:
            'index.html',
        mainEntry:
            './main.tsx',
        indexEntry: './index.scss',
        intlEntry: './polyfills/intl.js',
        outputChunkFilename: '[name].bundle.js',
        outputFilename: 'js/[name].bundle.js',
        svgOptions:
            {},
    };
};

const sourceMapRule = {
    test: /\.(js|jsx)$/,
    use: ['source-map-loader'],
    enforce: 'pre',
    exclude: /node_modules/
};

const imagesRule = {
    // Run image files through file-loader, which will copy them
    // to output directory and give then names based on hash of content
    test: /\.(png|jpe?g|gif)/,
    use: [{
        loader: 'file-loader',
    }],
    exclude: [/node_modules/]
};

const copySVGRule = {
    // Copy referenced svg files to output folder
    test: /\.svg/,
    use: [{
        loader: 'file-loader',
        options: {
            useRelativePath: false,
            outputPath: 'images/',
            name: '[name].[ext]'
        }
    }],
    issuer: /^(?!.*index.scss$)/
};

const fontRule = {
    // Treat font files like image files -- copy to output folder
    // and re-name with hash based on contents
    test: /\.(ttf|eot|woff2?)/,
    use: [{
        loader: 'file-loader?name=[name].[ext]',
        query: {
            useRelativePath: false,
            outputPath: 'fonts/'
        }
    }],
    exclude: [/node_modules/]
};

const externals = {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
};

const resolve = {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.sass', '.css'],
    alias: {
        images: path.resolve(__dirname, 'images'),
    },
    modules: [
        'src',
        'node_modules'
    ]
};

const stats = {
    children: false,
    modules: false
};

// Some libraries import Node modules but don't use them in the browser.
// Tell Webpack to provide empty mocks for them so importing them works.
const node = {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
};

module.exports = {
    externals,
    getConfigModel,
    resolve,
    stats,
    node,
    commonRules: {
        fontRule,
        imagesRule,
        sourceMapRule,
        copySVGRule
    },
};