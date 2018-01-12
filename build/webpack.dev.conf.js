'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
  return merge(baseConfig(env), {
    entry: './dev/main.js',
    output: {
      filename: '[name].js',
      chunkFilename: 'chunk-[name].js',
      path: path.resolve(__dirname, '../dev/js'),
      publicPath: '',
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
      new ExtractTextPlugin({
        filename: '../css/my-vue.css',
        disable: false,
        allChunks: true,
      }),
    ],
    //devtool: 'cheap-module-eval-source-map'
  });
};