'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env) {
  return merge(baseConfig(env), {
    entry: {
      'my-vue': './src/index.js',
    },
    output: {
      filename: '[name].min.js',
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
        allChunks: true,
        disable: false,
        filename: '../dist/my-vue.min.css',
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          zindex: false,
        },
      }),
    ],
  });
};