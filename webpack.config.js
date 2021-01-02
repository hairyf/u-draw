/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-11 22:51:01
 * @LastEditTime: 2021-01-02 13:25:23
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const path = require('path');
module.exports = {
  mode: 'production',
  // entry: './lib/index.ts',
  entry: './lib/extends/draw-qr-code/index.ts',
  output: {
    filename: 'index.js',
    // 打包扩展
    // path: path.resolve(__dirname, 'dist'),
    // path: path.resolve(__dirname, 'dist/extends/draw-qr-code'),
    path: path.resolve(__dirname, 'dist/extends/create-from-list'),
    libraryTarget: "commonjs", // 采用通用模块定义
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [ '.tsx', '.ts',  '.js' ]    
  }
}