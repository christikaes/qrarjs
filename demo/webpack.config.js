const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill", './src/index.js'],
    output: {
        filename: './bundle.[hash].js'
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' }
                    ],
                })
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
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
            { from: __dirname + "/src/public/", to: "./" }
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
