const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = function (args) {
  return path.join.apply(path, [__dirname].concat(...arguments));
};

module.exports = {
  entry: [
    root('src/polyfills.ts'),
    root('src/bootstrap.ts')
  ],

  output: {
    path: root('dist'),
    filename: 'js/[name].js'
  },

  resolve: {
    extensions: ['.js', '.ts', '.scss', '.html']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules\//],
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                'sourceMap': true,
                'importLoaders': 1
              }
            },
            'sass-loader'
          ]
        })
      }
    ]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: root('public/index.html'),
      inject: true
    }),

    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),

    new CopyWebpackPlugin([{
      from: root('public')
    }]),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root('src')
    )
  ],

  devServer: {
    contentBase: root('public'),
    stats: { chunkModules: false },
  }
};
