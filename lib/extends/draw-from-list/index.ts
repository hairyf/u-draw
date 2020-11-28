import { DrawPosterUseOpts } from '../../utils/interface'
export interface CreateLayerOpts {
  background?: string
  y?: number
  self?: boolean
  line?: boolean
  lineHeight?: number
}
export interface DrawRowOpt {
  text?: string
  font?: string
  color?: string
  center?: boolean
  width?: number
}

/** 绘制表单扩展方法 */
export default {
  name: 'createLayer',
  init: (dp) => {
    dp.from = {
      offsetTop: 0,
      margin: 8,
      padding: 15
    }
  },
  handle: (dp, afferOpts: CreateLayerOpts, rowList: DrawRowOpt[]) => {
    // 当前配置(头部偏移量, 列内边距, 表单外边距)
    const offsetTop = dp.from.offsetTop as number
    const padding = dp.from.padding as number
    const margin = dp.from.margin as number
    // 当前层宽度
    const containerWidth = dp.canvas.width - (dp.from.padding * 2)
    // 基本层配置
    const opts = {
      background: "#fff",
      y: 0,
      self: true,
      line: true,
      lineHeight: 0,
      ...afferOpts
    }
    // 基本列配置
    const baseRowOpts = {
      text: "",
      font: "24px sans-serif",
      color: "#333",
      center: false,
      width: 0,
    }
    // 累计最高的列为标准定义为层高度
    let maxRowHeight = 0
    // 累计固定栅格列偏移量
    let columnOffsetX = padding
    // 定义配置中y的默认尺寸
    opts.y = offsetTop || padding

    // 创建行绘制任务
    const drawLayerInfos = rowList.map((afferRowOpts = {}, index) => {
      const rowOpts = {
        ...baseRowOpts,
        ...afferRowOpts
      }
      let columnX = 0 // 每列的X轴
      let columnW = 0 // 每列的宽度
      let fontOffsetX = 0 // 字体偏移X轴
      let fontMaxWidth = 100 // 字体最大宽度
      opts.lineHeight = opts.lineHeight || Number(rowOpts.font.replace(/[^0-9.]/g, ""))
      if (self) {
        // 自适应栅格格子计算
        columnX = containerWidth - (containerWidth / (index + 1)) + padding
        columnW = containerWidth / rowList.length
        if (columnX > 0 && columnX < containerWidth - columnW) {
          columnX = (columnW * index) + padding
        }
        fontMaxWidth = columnW - (margin * 3)
      }
      if (!self) {
        // 固定栅格格子计算
        columnW = rowOpts.width
        columnX = columnOffsetX
        fontMaxWidth = columnW - (margin * 3)
        fontOffsetX = rowOpts.center ? columnOffsetX + (rowOpts.width / 2) : columnOffsetX + margin
        columnOffsetX += rowOpts.width
      }
      const drawFontInfos = dp.ctx.fillWarpText({
        text: rowOpts.text,
        maxWidth: fontMaxWidth,
        lineHeight: opts.lineHeight,
        x: fontOffsetX,
        y: offsetTop,
        layer: 10,
        notFillText: true
      })

      // 当前行的高度
      const rowHeight = (opts.lineHeight * drawFontInfos.length) + (margin * 3)
      // 若该列高度大于累计高度, 将累计高度替换
      if (rowHeight > maxRowHeight) {
        maxRowHeight = rowHeight
      }

      return {
        font: rowOpts.font,
        center: rowOpts.center,
        color: rowOpts.color,
        background: opts.background,
        lineHeight: opts.lineHeight,
        line: opts.line,
        offsetTop: opts.y,
        drawFontInfos,
        columnX,
        columnW,
        padding,
        margin
      }
    })

    // 将行绘制任务添加至绘制容器中
    dp.draw((ctx) => drawLayerInfos.forEach(rowOpts => {
      ctx.font = rowOpts.font
      ctx.fillStyle = rowOpts.background
      ctx.strokeStyle = "#333"
      ctx.textBaseline = "middle"
      if (rowOpts.center) {
        ctx.textAlign = "center"
      }
      ctx.fillRect(
        rowOpts.columnX,
        rowOpts.offsetTop,
        rowOpts.columnW,
        maxRowHeight
      )
      if (rowOpts.line) {
        ctx.strokeRect(
          rowOpts.columnX,
          rowOpts.offsetTop,
          rowOpts.columnW,
          maxRowHeight
        )
      }
      ctx.fillStyle = rowOpts.color
      rowOpts.drawFontInfos.forEach(fontInfo => {
        // 计算每行字体绘制y轴长度
        // y(当前列置顶轴) + (maxRowHeight(当前列最高长度) / 2) - (((总列数-1) * 行高) / 2)
        const textTotal = rowOpts.drawFontInfos.length - 1
        const textMiddleY = (textTotal * rowOpts.lineHeight) / 2
        let fontOffsetTop = fontInfo.y + (maxRowHeight / 2)
        fontOffsetTop -= textMiddleY
        if (rowOpts.offsetTop === 0 || rowOpts.offsetTop === rowOpts.padding) {
          fontOffsetTop -= (margin / 2)
        }
        ctx.fillText(
          fontInfo.text,
          fontInfo.x,
          fontOffsetTop
        )
      })
    }))
    
    // 叠加高度
    dp.from.offsetTop += maxRowHeight
  }
} as DrawPosterUseOpts
