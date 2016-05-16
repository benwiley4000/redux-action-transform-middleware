var webpack = require('webpack');

var webpackConfig = {
  entry: './src/index.js',
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'reduxActionTransformMiddleware',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};

module.exports = webpackConfig;
