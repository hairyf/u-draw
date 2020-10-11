import http from './http.config';
/* api->index.ts 统一命名规范
 * 1. 接口暴露前缀统一为req -> request(请求)
 * 2. 需详细描述数据时, 在src/types/response.d.ts中声明
 * Template: export const req[name] = () => http.get("/api/list")
 */

// 暴露请求配置
export const httpConfig = http.config;
// 模拟用户请求
export const getUserInfo = () => {
  return http.get<UserInfo>('/login');
};

// 模拟请求列表
export const getList = (params: ListOpts) => {
  return http.get('/list', { params });
};
