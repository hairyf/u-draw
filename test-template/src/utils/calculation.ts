/* 计算属性工具类 */

// 传入字符串和长度, 返回字符串, 超出长度以...展示
export function strEllipsis(str: '', length = 30) {
  if (str.length > length) {
    return str.slice(0, length).trim() + '...';
  }
  return str;
}
/** 格式化时间戳
 * @param {String} time 传入的时间戳
 * @param {String} format 需要转换的格式
 * @returns {String} 2019-12-26 12:06:00
 */
export function formatDate(time: number, format = 'YY-MM-DD hh:mm:ss') {
  const date = new Date(time);
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  //开个长度为10的数组 格式为 00 01 02 03
  const preArr = [...Array(10)].map((elem, index) => '0' + index);
  const newTime = format
    .replace(/YY/g, year.toString())
    .replace(/MM/g, preArr[month] || month.toString())
    .replace(/DD/g, preArr[day] || day.toString())
    .replace(/hh/g, preArr[hour] || hour.toString())
    .replace(/mm/g, preArr[min] || min.toString())
    .replace(/ss/g, preArr[sec] || sec.toString());
  return newTime;
}
// 反编译日期格式
export function formatRelieve(dateStr = '2020-06-10') {
  const date = dateStr.replace(/-/g, '/');
  const timestamp = new Date(date).getTime();
  return timestamp;
}

// 计算权限
export function calcul(status: string | number, ...args: [string]) {
  const findRes = args.find((s) => s == status);
  return typeof findRes !== 'undefined';
}
// 地址参数计算
export const paramsAnaly = (url: string, params: Record<string, any>) => {
  const queryStr = Object.keys(params).map((key) => `${key}=${params[key]}`);
  if (queryStr.length > 0) {
    url += '?' + queryStr.join('&');
  }
  return url;
};
