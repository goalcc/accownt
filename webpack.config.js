const webpack = require('webpack');
const config = require('./config');
const path = require('path');

const plugins = [];
const isProd = config.environment.type == 'prod';

if (isProd) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: { unused: false }
    })
  );
}

module.exports = {
  
  entry: './client/components/App.jsx',
  
  output: {
    filename: 'App.js',
    path: path.resolve(__dirname, 'static/js')
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'client'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'client/components'),
        path.resolve(__dirname, 'client/constants'),
        path.resolve(__dirname, 'client/lib')
      ],
      exclude: /node_modules/,
      options: {
        presets: ['env', 'react']
      }
    }]
  },

  plugins

};