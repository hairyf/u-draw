interface DrawPosterOptions {
  /** 查询字符串(必须), 注意不要写错对应canvas id */
  selector: string
  /** 选取组件范围 */
  componentThis?: string
  /** 绘制类型, 微信小程序自动切换为 '2d' */
  type?: '2d' | 'context' | 'webgl'
  /** 是否在绘制与创建时提示文字信息 */
  tips?: boolean
  /** 是否开启调试模式 */
  debugging?: boolean
  /** 加载提示文字 */
  loadingText?: string
  /** 创建图片提示文字 */
  createText?: string
  /** 是否启动gcanvas(nvue) */
  gcanvas?: boolean
}

interface UseDrawPoster<R = void> {
  (selector: string, options?: Pick<DrawPosterOptions, 'selector'>): R
  (options: DrawPosterOptions): R
}

interface UseDrawPosterResult {
  canvas: Canvas
  ctx: CanvasCtx
  _id: string
}
