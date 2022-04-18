import { DrawPosterPlugin } from '../../core/plugin'
declare module '../../core/typed' {
  interface CanvasCtx {
    /** 绘制圆角图片
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawRoundImage(
      url: string,
      x: number,
      y: number,
      w: number,
      h: number,
      r?: number
    ): Promise<boolean>
  }
}
const plugin: DrawPosterPlugin = {
  name: '__ctx-drawRoundImage__',
  mounted: ({ ctx }) => {
    ctx.drawRoundImage = async (url, x, y, w, h, r = 15) => {
      ctx.save()
      ctx.setFillStyle?.('transparent')
      ctx.fillStyle = 'transparent'
      ctx.fillRoundRect(x, y, w, h, r)
      ctx.clip()
      const result = await ctx.drawImage(url, x, y, w, h)
      ctx.restore()
      return result
    }
  }
}

export default () => plugin
