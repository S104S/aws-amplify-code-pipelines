const { merge } = require('webpack-merge'),
        common = require('./webpack.common'),
        path = require('path');

module.exports = merge(common, {
    mode: 'development',
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },
    devServer: {
        static: path.join(__dirname, 'public'),
        historyApiFallback: true,
        compress: true,
        port: 3333,
        hot: true,
        https: true
    }
});