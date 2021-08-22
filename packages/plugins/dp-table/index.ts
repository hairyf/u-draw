declare module '@/core' {
  interface DrawPosterOptions {
    tableOptions?: {
      height?: number
      padding?: number
      margin?: number
    }
  }
  interface UseDrawPosterResult {
    createLayer(afferOptions: CreateLayerOptions, rows: DrawRowOptions[]): void
    tableOptions: DrawPosterOptions['tableOptions']
  }
}
export interface CreateLayerOptions {
  background?: string
  self?: boolean
  line?: boolean
  lineHeight?: number
}
export interface DrawRowOptions {
  text?: string
  font?: string
  color?: string
  center?: boolean
  width?: number
}
const plugin: DrawPosterPlugin = {
  name: 'createLayer',
  beforeMount: (dp) => {
    if (!dp.tableOptions) dp.tableOptions = {}
    dp.tableOptions.height = dp.$options!.tableOptions!.height ?? 0
    dp.tableOptions.padding = dp.$options!.tableOptions!.padding ?? 8
    dp.tableOptions.margin = dp.$options!.tableOptions!.margin ?? 0
  },
  mounted: (dp) => {
    dp['createLayer'] = (afferOptions: CreateLayerOptions, rows: DrawRowOptions[]) => {
      // 当前配置(头部偏移量, 列内边距, 表单外边距)
      const height = dp.tableOptions!.height!
      const margin = dp.tableOptions!.margin!
      const padding = dp.tableOptions!.padding!
      // 当前层宽度
      const containerWidth = dp.canvas.width - margin * 2
      // 基本层配置
      const opts = {
        background: '#fff',
        columnY: height || margin,
        self: true,
        line: true,
        lineHeight: 0,
        border: true,
        ...afferOptions
      }
      // 基本列配置
      const baseRowOpts = {
        text: '',
        font: '24px sans-serif',
        color: '#333',
        center: false,
        width: 0
      }
      // 累计最高的列为标准定义为层高度
      let maxRowHeight = 0
      // 累计固定栅格列偏移量
      let columnOffsetX = margin
      // 创建行绘制任务
      const drawLayerInfos = rows.map((afferRowOpts = {}, index) => {
        const rowOpts = {
          ...baseRowOpts,
          ...afferRowOpts
        }
        let columnX = 0 // 每列的X轴
        let columnW = 0 // 每列的宽度
        let fontOffsetX = 0 // 字体偏移X轴
        let fontMaxWidth = 100 // 字体最大宽度
        opts.lineHeight = opts.lineHeight || Number(rowOpts.font.replace(/[^\d.]/g, ''))
        if (opts.self) {
          // 自适应栅格格子计算
          columnX = containerWidth - containerWidth / (index + 1) + margin
          columnW = containerWidth / rows.length
          if (columnX > 0 && columnX < containerWidth - columnW) {
            columnX = columnW * index + margin
          }
          fontOffsetX = rowOpts.center ? columnX + columnW / 2 : columnX + padding
          fontMaxWidth = columnW - padding * 3
        }
        if (!opts.self) {
          // 固定栅格格子计算
          columnW = rowOpts.width
          columnX = columnOffsetX
          fontMaxWidth = columnW - padding * 3
          fontOffsetX = rowOpts.center ? columnOffsetX + rowOpts.width / 2 : columnOffsetX + padding
          columnOffsetX += rowOpts.width
        }
        dp.ctx.font = rowOpts.font
        const drawFontInfos = dp.ctx.fillWarpText({
          text: rowOpts.text,
          maxWidth: fontMaxWidth,
          lineHeight: opts.lineHeight,
          x: fontOffsetX,
          y: opts.columnY,
          layer: 10,
          notFillText: true
        }) as any[]
        // 当前行的高度
        const rowHeight = opts.lineHeight * drawFontInfos.length + padding * 3
        // 若该列高度大于累计高度, 将累计高度替换
        if (rowHeight > maxRowHeight) {
          maxRowHeight = rowHeight
        }
        return {
          font: rowOpts.font,
          center: rowOpts.center,
          color: rowOpts.color,
          border: opts.border,
          background: opts.background,
          lineHeight: opts.lineHeight,
          line: opts.line,
          drawFontInfos,
          columnY: opts.columnY,
          columnX,
          columnW,
          columnH: maxRowHeight,
          margin,
          padding
        }
      })

      // 将行绘制任务添加至绘制容器中
      dp.draw((ctx) =>
        drawLayerInfos.forEach((rowOpts) => {
          ctx.font = rowOpts.font
          ctx.fillStyle = rowOpts.background
          ctx.strokeStyle = '#333'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'left'
          if (rowOpts.center) {
            ctx.textAlign = 'center'
          }
          ctx.fillRect(rowOpts.columnX, rowOpts.columnY, rowOpts.columnW, rowOpts.columnH)
          if (rowOpts.border) {
            dp.ctx.strokeRect(margin, rowOpts.columnY, dp.canvas.width - margin, maxRowHeight)
          }
          if (rowOpts.line && rowOpts.columnX !== margin) {
            ctx.moveTo(rowOpts.columnX, rowOpts.columnY)
            ctx.lineTo(rowOpts.columnX, rowOpts.columnY + rowOpts.columnH)
            ctx.stroke()
            ctx.beginPath()
          }
          ctx.fillStyle = rowOpts.color
          rowOpts.drawFontInfos.forEach((fontInfo) => {
            // 计算每行字体绘制y轴长度
            // y(当前列置顶轴) + (rowOpts.columnH(当前列最高长度) / 2) - (((总列数-1) * 行高) / 2)
            const textTotal = rowOpts.drawFontInfos.length - 1
            const textMiddleY = (textTotal * rowOpts.lineHeight) / 2
            let fontOffsetY = fontInfo.y + rowOpts.columnH / 2
            fontOffsetY -= textMiddleY
            ctx.fillText(fontInfo.text, fontInfo.x, fontOffsetY)
          })
        })
      )
      if (opts.columnY === 0 || opts.columnY === margin) {
        maxRowHeight += margin
      }

      // 叠加高度
      dp.from.height += maxRowHeight
      return maxRowHeight
    }
  },
  created: (dp) => {
    dp.tableOptions!.height = 0
  }
}

export default plugin
