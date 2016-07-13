const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './src/polyfills.ts',
    './src/bootstrap.ts'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    cache: true,
    root: __dirname,
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules\//],
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    stats: { chunkModules: false },
  }
};
