/* 语法糖工具类 */

// for in封装
export function forIn<T>(
  object: T,
  callback: (key: keyof T, val: T[Extract<keyof T, string>]) => void
) {
  for (const key in object) {
    callback(key, object[key]);
  }
  return object;
}
