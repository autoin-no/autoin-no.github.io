const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    entry: {
        'v1/footer': './src/footer.js',
        'v1/styles': './src/theme_light.scss',
        //' Notes for next version with Boostrap v5, make it more clear it contians full boostrap in build:
        //'v5/bootstrap_ai': './src/bootstrap_ai.js',
        //'v5/bootstrap_ai': './src/bootstrap_ai.scss',// entry point handling redirect to theme based on system preferences
        //'v5/bootstrap_ai_light': './src/bootstrap_ai_light.scss'
        //'v5/bootstrap_ai_dark': './src/bootstrap_ai_dark.scss'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                  exposes: ['$', 'jQuery'],
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {hmr: process.env.NODE_ENV === 'development'},
                    },
                    //{loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'postcss-loader', // Run postcss actions
                        options: {
                          postcssOptions: {
                            plugins: [
                              [
                                'autoprefixer',
                                {
                                  // Options
                                },
                              ],
                            ],
                          },
                        },
                    },
                    {loader: 'sass-loader'},
                ]
            },
        ]
    }
};

