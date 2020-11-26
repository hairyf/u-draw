const path = require('path');
module.exports = {
  mode: 'production',
  entry: './lib/index.ts',
  // entry: './lib/extends/draw-qr-code/index.ts',
  output: {
    filename: 'index.js',
    // 打包扩展
    path: path.resolve(__dirname, 'dist'),
    // path: path.resolve(__dirname, 'dist/extends/draw-qr-code'),
    // 打包测试
    // path: path.resolve(__dirname, 'test/template/js_sdk/u-draw-poster'),
    // path: path.resolve(__dirname, 'test/template/js_sdk/u-draw-poster/extends/draw-qr-code'),
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