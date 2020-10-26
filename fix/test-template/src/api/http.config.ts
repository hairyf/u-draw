// 使用具体参考luch-request官网: https://www.quanzhan.co/luch-request/guide/3.x/#example
import Http from 'luch-request';

/** 定义默认配置 */
const http = new Http({
  baseURL: '',
  header: {},
});

/** 添加请求拦截器 */
http.interceptors.request.use((config) => {
  if (config.custom?.load) {
    uni.showLoading({ title: '加载中...' });
  }
  return config;
});
/** 添加响应拦截器 */
http.interceptors.response.use(
  (response) => {
    if (response.config.custom?.load) {
      uni.hideLoading();
    }
    return response;
  },
  (error) => {
    if (error.config.custom?.load) {
      uni.hideLoading();
    }
    return error;
  }
);

export default http;
