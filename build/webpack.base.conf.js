'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function () {
  return {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'classes': path.resolve(__dirname, '../src/classes'),
        'components': path.resolve(__dirname, '../src/components'),
        'directives': path.resolve(__dirname, '../src/directives'),
        'icons': path.resolve(__dirname, '../src/icons'),
        'mixins': path.resolve(__dirname, '../src/mixins'),
        'plugins': path.resolve(__dirname, '../src/plugins'),
        'utils': path.resolve(__dirname, '../src/utils'),
        'vue$': 'vue/dist/vue.common.js',
      },
      modules: [
        'node_modules',
      ],
    },
    module: {
      rules: [
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          loaders: 'babel-loader!eslint-loader',
        },
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
          options: {
            loaders: {
              js: 'babel-loader!eslint-loader',
              i18n: '@kazupon/vue-i18n-loader',
              /*less: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!less-loader',
              }),*/
            },
          },
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader!less-loader',
          }),
        },
        {
          test: /\.(svg|gif)$/,
          loader: 'url-loader',
        },
      ],
    },
    performance: {
      hints: 'warning',
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    stats: {
      children: false,
    },
  };
};