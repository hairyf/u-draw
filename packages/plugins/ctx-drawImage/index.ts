import { DrawPosterPlugin } from '../../core/plugin'

declare module '../../core' {
  export interface CanvasCtx {
    /** 等待绘制图片
     *
     * 说明文档: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawImage(
      url: string,
      dx?: number | undefined,
      dy?: number | undefined,
      dWidth?: number | undefined,
      dHeigt?: number | undefined,
      sx?: number | undefined,
      sy?: number | undefined,
      sWidth?: number | undefined,
      sHeight?: number | undefined
    ): Promise<boolean>
  }
}

const plugin: DrawPosterPlugin = {
  name: '__name__',
  mounted: (dp) => {
    dp.ctx.drawImage
  }
}

export default plugin
