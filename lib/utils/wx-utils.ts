import gbl from "./global"
import { Canvas } from "./interface"
// 下载图片方法
export const downloadImgUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    gbl.downloadFile({
      url,
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    })
  })

// 获取node节点
export const getCanvas2dContext = (selector: string, componentsThis?: any): Promise<Canvas | undefined> => {
  return new Promise(resolve => {
    const query = (
      componentsThis ?
        gbl.createSelectorQuery().in(componentsThis) :
        gbl.createSelectorQuery()
    ) as WechatMiniprogram.SelectorQuery;
    query.select(selector)
      .fields({ node: true }, res => {
        const node: Canvas | undefined = res?.node
        resolve(node)
      }).exec()
  })
}