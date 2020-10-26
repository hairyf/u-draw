import { paramsAnaly } from './calculation';

// 微信路由跳转封装
export const navigateTo = (url: string, params?: Record<string, any>) => {
  uni.navigateTo({ url: paramsAnaly(url, params) });
};
export const reLaunch = (url: string, params?: Record<string, any>) => {
  uni.reLaunch({ url: paramsAnaly(url, params) });
};
export const switchTab = (url: string, params?: Record<string, any>) => {
  uni.switchTab({ url: paramsAnaly(url, params) });
};
export const navigateBack = (delta = 1) => {
  uni.navigateBack({ delta });
};
