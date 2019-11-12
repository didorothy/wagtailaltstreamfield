const path = require("path");
const webpack = require("webpack");

module.exports = [
    {
        entry: {
            altstreamfield: "./index.js",
        },
        output: {
            filename: '[name].js',
                library: '[name]',
                libraryTarget: 'umd',
                path: path.join(path.dirname(__dirname), 'altstreamfield')
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/env"
                        ]
                    }
                }
            ]
        },
        resolve: {
            extensions: [
                '*',
                '.js',
                '.jsx',
            ]
        }
    }
];