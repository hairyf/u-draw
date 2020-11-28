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
    x: number, y: number,
    w: number, h: number,
  ): Promise<boolean> => {
    const path = await downloadImgUrl(url)
    ctx.existDrawImage = true
    let result = false
    if (ctx.drawType === 'context') {
      ctx.oldDrawImage(path, x, y, w, h)
      ctx.restore()
      result = true
    }
    if (ctx.drawType === 'type2d') {
      result = await new Promise(resolve => {
        const image = canvas.createImage()
        image.src = path
        image.onload = () => {
          ctx.oldDrawImage(image as any, x, y, w, h)
          ctx.restore()
          resolve(true)
        }
        image.onerror = () => resolve(false)
      })
    }
    return result
  }
} as DrawPosterUseCtxOpts
