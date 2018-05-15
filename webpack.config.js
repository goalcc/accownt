const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const config = require('./config');
const path = require('path');

const plugins = [];
const isProd = config.environment.type == 'production';

if (isProd) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz'
    })
  );
}

module.exports = {
  mode: config.environment.type,

  entry: {
    Admin: './client/components/Admin.jsx',
    App: './client/components/App.jsx'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'static/js')
  },

  resolve: {
    modules: [path.resolve(__dirname, 'client'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
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
      }
    ]
  },

  plugins
};
