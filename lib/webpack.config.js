module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        // webassemblyModuleFilename: "[modulehash].wasm",
        filename: 'qrar.js',
        library: 'qrarjs',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js', '.css']
    },
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
            }
        ]
    },
    // devtool: 'source-map'
}
