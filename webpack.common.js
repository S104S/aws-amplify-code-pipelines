const   path = require('path'),
        webpack = require('webpack'),
        htmlWebpackPlug = require('html-webpack-plugin'),
        copyPlugin = require('copy-webpack-plugin'),
        fileManager = require('filemanager-webpack-plugin'),
        envVars = require(path.join(__dirname, `./.env.${process.env.NODE_ENV}.json` ));

module.exports = {

    entry: ['@babel/polyfill', './src/index.js'],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /favicon\.ico$/,
                loader: 'url'
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.envVars': JSON.stringify(envVars)
        }),
        new copyPlugin(
            {
                patterns: [
                    {from: 'public/index.deploy.html', to: 'index.html', force: true},
                    {from: 'public/favicon.ico', to: 'favicon.ico', force: true},
                    {from: 'src/assets/icon.png', to: 'icon.png'},
                    {from: 'src/assets/transparent-icon.png', to: 'transparent-icon.png'}
                ]
            }),
        new fileManager({
            events: {
                onEnd: {
                    copy: [
                        {source: './dist/*.jpg', destination: './dist/dist'},
                        {source: './dist/*.png', destination: './dist/dist'}
                    ]
                }
            }
        })
    ]
};