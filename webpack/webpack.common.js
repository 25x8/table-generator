const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');
const webpack = require('webpack');


module.exports = {
    entry: paths.src + '/index.js',
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    noErrorOnMissing: true,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Займ под залог ПТС авто, автомобиля, машины | Кубышка',
            template: paths.src + '/template.html',
            filename: 'index.html',
            minify: {
                removeRedundantAttributes: false,
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'styles/images/[hash][ext]'
                },
            },
            {
                test: /\.(?:pdf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext]'
                },
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline'
            }
        ]
    }
}