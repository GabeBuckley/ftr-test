const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = config => config.set({

    frameworks: ['jasmine'],

    files: [
        { pattern: "src/**/*.ts" },
        { pattern: "spec/**/*.ts" }
    ],

    mime: {
        'text/x-typescript': ['ts']
    },
    preprocessors: {
        '**/*.ts': ['webpack', 'sourcemap']
    },
    plugins: [
        'karma-jasmine-html-reporter',
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-sourcemap-loader',
        'karma-webpack'
    ],
    webpack: {
        entry: './src/app/main.ts',
        devtool: 'sourcemap',
        mode: 'development',
        module: {
            rules: [{
                    test: /\.ts?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(s*)css$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                bypassOnDebug: true,
                                disable: true
                            },
                        },
                    ],
                }

            ]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: './src/app/index.html' }),
            new webpack.SourceMapDevToolPlugin({
                test: /\.(ts|js|css)($|\?)/i
            })
        ],
        resolve: {
            extensions: [".ts", ".js", ".scss", ".jpg"]
        }
    },

    webpackMiddleware: {
        quiet: false,
        stats: {
            colors: true
        }
    },

    // customContextFile: "./spec/specRunner.html",

    reporters: ["progress", "kjhtml"],
    colors: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

});