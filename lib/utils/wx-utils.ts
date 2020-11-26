import gbl from "./global"
import { Canvas } from "./interface"
import { isBaseUrl, isNetworkUrl, isTmpUrl } from './utils'
// 下载指定地址图片, 如果不符合下载图片, 则直接返回
export const downloadImgUrl = (url: string): Promise<string> => {
  const isLocalFile = isBaseUrl(url) || isTmpUrl(url) || !isNetworkUrl(url)
  return new Promise((resolve, reject) => {
    if (isLocalFile) {
      return resolve(url);
    }
    gbl.downloadFile({
      url,
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    })
  })
}

// 获取当前指定 node 节点
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