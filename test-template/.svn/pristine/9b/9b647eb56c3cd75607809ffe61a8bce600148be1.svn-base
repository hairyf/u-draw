import { paramsAnaly } from './calculation';

// 微信路由跳转封装
export const navigateTo = (url: string, params = {}) => {
  uni.navigateTo({ url: paramsAnaly(url, params) });
};
export const reLaunch = (url: string, params = {}) => {
  uni.reLaunch({ url: paramsAnaly(url, params) });
};
export const switchTab = (url: string, params = {}) => {
  uni.switchTab({ url: paramsAnaly(url, params) });
};
export const navigateBack = (delta = 1) => {
  uni.navigateBack({ delta });
};
