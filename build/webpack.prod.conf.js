'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
  return merge(baseConfig(env), {
    entry: './src/index.js',
    output: {
      filename: 'my-vue.min.js',
      library: 'my-vue',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '',
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          warnings: false,
        },
        parallel: true,
        sourceMap: false,
      }),
      new ExtractTextPlugin({
        filename: '../dist/my-vue.min.css',
        disable: false,
        allChunks: true,
      }),
    ],
  });
};