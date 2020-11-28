/** 绘制表单扩展方法 */
export default {
    name: 'createLayer',
    init: (dp) => {
        dp.from = {
            height: 0,
            margin: 8,
            padding: 15
        };
    },
    handle: (dp, afferOpts, rowList) => {
        // 当前配置(头部偏移量, 列内边距, 表单外边距)
        const height = dp.from.height;
        const padding = dp.from.padding;
        const margin = dp.from.margin;
        // 当前层宽度
        const containerWidth = dp.canvas.width - (padding * 2);
        // 基本层配置
        const opts = Object.assign({ background: "#fff", height: height || padding, self: true, line: true, lineHeight: 0 }, afferOpts);
        // 基本列配置
        const baseRowOpts = {
            text: "",
            font: "24px sans-serif",
            color: "#333",
            center: false,
            width: 0,
        };
        // 累计最高的列为标准定义为层高度
        let maxRowHeight = 0;
        // 累计固定栅格列偏移量
        let columnOffsetX = padding;
        // 创建行绘制任务
        const drawLayerInfos = rowList.map((afferRowOpts = {}, index) => {
            const rowOpts = Object.assign(Object.assign({}, baseRowOpts), afferRowOpts);
            let columnX = 0; // 每列的X轴
            let columnW = 0; // 每列的宽度
            let fontOffsetX = 0; // 字体偏移X轴
            let fontMaxWidth = 100; // 字体最大宽度
            opts.lineHeight = opts.lineHeight || Number(rowOpts.font.replace(/[^0-9.]/g, ""));
            if (self) {
                // 自适应栅格格子计算
                columnX = containerWidth - (containerWidth / (index + 1)) + padding;
                columnW = containerWidth / rowList.length;
                if (columnX > 0 && columnX < containerWidth - columnW) {
                    columnX = (columnW * index) + padding;
                }
                fontMaxWidth = columnW - (margin * 3);
            }
            if (!self) {
                // 固定栅格格子计算
                columnW = rowOpts.width;
                columnX = columnOffsetX;
                fontMaxWidth = columnW - (margin * 3);
                fontOffsetX = rowOpts.center ? columnOffsetX + (rowOpts.width / 2) : columnOffsetX + margin;
                columnOffsetX += rowOpts.width;
            }
            const drawFontInfos = dp.ctx.fillWarpText({
                text: rowOpts.text,
                maxWidth: fontMaxWidth,
                lineHeight: opts.lineHeight,
                x: fontOffsetX,
                y: height,
                layer: 10,
                notFillText: true
            });
            // 当前行的高度
            const rowHeight = (opts.lineHeight * drawFontInfos.length) + (margin * 3);
            // 若该列高度大于累计高度, 将累计高度替换
            if (rowHeight > maxRowHeight) {
                maxRowHeight = rowHeight;
            }
            return {
                font: rowOpts.font,
                center: rowOpts.center,
                color: rowOpts.color,
                background: opts.background,
                lineHeight: opts.lineHeight,
                line: opts.line,
                height: opts.height,
                drawFontInfos,
                columnX,
                columnW,
                padding,
                margin
            };
        });
        // 将行绘制任务添加至绘制容器中
        dp.draw((ctx) => drawLayerInfos.forEach(rowOpts => {
            ctx.font = rowOpts.font;
            ctx.fillStyle = rowOpts.background;
            ctx.strokeStyle = "#333";
            ctx.textBaseline = "middle";
            if (rowOpts.center) {
                ctx.textAlign = "center";
            }
            ctx.fillRect(rowOpts.columnX, rowOpts.height, rowOpts.columnW, maxRowHeight);
            if (rowOpts.line) {
                ctx.strokeRect(rowOpts.columnX, rowOpts.height, rowOpts.columnW, maxRowHeight);
            }
            ctx.fillStyle = rowOpts.color;
            rowOpts.drawFontInfos.forEach(fontInfo => {
                // 计算每行字体绘制y轴长度
                // y(当前列置顶轴) + (maxRowHeight(当前列最高长度) / 2) - (((总列数-1) * 行高) / 2)
                const textTotal = rowOpts.drawFontInfos.length - 1;
                const textMiddleY = (textTotal * rowOpts.lineHeight) / 2;
                let fontHeight = fontInfo.y + (maxRowHeight / 2);
                fontHeight -= textMiddleY;
                if (rowOpts.height === 0 || rowOpts.height === rowOpts.padding) {
                    fontHeight -= (margin / 2);
                }
                ctx.fillText(fontInfo.text, fontInfo.x, fontHeight);
            });
        }));
        // 叠加高度
        dp.from.height += maxRowHeight;
        return maxRowHeight;
    }
};
