module.exports = {
  transpileDependencies: ['luch-request'],
  // 资源基本路径
  publicPath: './',
  // 配置 webpack-dev-server 行为。
  devServer: {
    open: true,
    proxy: null,
  },
};
