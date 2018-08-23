const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill", './src/index.ts'],
    output: {
        webassemblyModuleFilename: "[modulehash].wasm",
        filename: './bundle.[hash].js',
        library: 'qrar'
    },
    resolve: {
        extensions: ['.ts', '.js', '.css']
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: {
                    loader: 'tslint-loader'
                }
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                test: /worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        name: 'js/worker.[hash].js'
                    }
                }
            },
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'wasm/[name].[hash].[ext]',
                            publicPath: '../'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/public/index.html",
            inject: 'body'
        }),
        new ExtractTextPlugin("./styles.[hash].css"),
        new CopyWebpackPlugin([
            { from: __dirname + "/src/public/", to: "./" },
            { from: "../wasm/build/", to: "./wasm/" },
        ])
    ],
    devServer: {
        contentBase: './src/public',
        port: 8080
    },
    // devtool: 'source-map'
    optimization: {
        minimize: false
    }
}
