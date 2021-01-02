import { calculateConcreteRect } from "../../utils/object-sizing";
export default {
    name: 'drawImageFit',
    handle: async (canvas, ctx, url, opts) => {
        var _a;
        // 配置默认值
        const style = Object.assign({ round: 0, objectFit: 'cover', intrinsicSize: { width: 100, height: 100 }, specifiedSize: { width: 100, height: 100 }, intrinsicPosition: ['left', 'top'], specifiedPosition: [0, 0] }, opts);
        // 计算图片尺寸
        const drawImageInfo = calculateConcreteRect(style, style.intrinsicSize, style.specifiedSize);
        // 如有圆角, 则进行裁剪
        if (style.round > 0) {
            ctx.save();
            (_a = ctx.setFillStyle) === null || _a === void 0 ? void 0 : _a.call(ctx, 'transparent');
            ctx.fillStyle = 'transparent';
            ctx.fillRoundRect(style.specifiedPosition[0], style.specifiedPosition[1], style.specifiedSize.width, style.specifiedSize.height, style.round);
            ctx.clip();
        }
        const result = await ctx.drawImage(url, ...Object.values(drawImageInfo));
        if (style.round > 0)
            ctx.restore();
        return result;
    }
};
