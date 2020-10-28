import gbl from "./global"
import { Canvas } from "./interface"
import { isBaseUrl, isNetworkUrl, isTmpUrl } from './utils'
// 下载图片方法
export const downloadImgUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (isBaseUrl(url) || isTmpUrl(url) || !isNetworkUrl(url)) {
      resolve(url);
      return;
    }
    gbl.downloadFile({
      url,
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    })
  })

// 获取node节点
export const getCanvas2dContext = (selector: string, componentThis?: any): Promise<Canvas | {}> => {
  return new Promise(resolve => {
    const query = (
      componentThis ?
        gbl.createSelectorQuery().in(componentThis) :
        gbl.createSelectorQuery()
    ) as WechatMiniprogram.SelectorQuery;
    query.select(selector)
      .fields({ node: true }, res => {
        const node = res?.node as Canvas | undefined
        resolve(node || {})
      }).exec()
  })
}