/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-28 12:07:51
 * @LastEditTime: 2021-01-03 11:38:39
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { DrawPosterUseCtxOpts, Canvas, DrawPosterCanvasCtx } from '../../utils/interface'
import { downloadImgUrl } from '../../utils/wx-utils'

/** 等待绘制图片原型方法 */
export default {
  name: 'drawImage',
  init: (canvas, ctx) => {
    ctx.oldDrawImage = ctx.drawImage
  },
  handle: async (
    canvas: Canvas,
    ctx: DrawPosterCanvasCtx,
    url: string,
    ...args
  ): Promise<boolean> => {
    const path = await downloadImgUrl(url)
    ctx.existDrawImage = true
    let result = false
    if (ctx.drawType === 'context') {
      ctx.oldDrawImage(path, ...args)
      result = true
    }
    if (ctx.drawType === 'type2d') {
      result = await new Promise(resolve => {
        const image = canvas.createImage()
        image.src = path
        image.onload = () => {
          ctx.oldDrawImage(image as any, ...args)
          resolve(true)
        }
        image.onerror = () => resolve(false)
      })
    }
    return result
  }
} as DrawPosterUseCtxOpts
