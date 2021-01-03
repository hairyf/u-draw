import { calculateConcreteRect } from "../../utils/object-sizing";
import gbl from "../../utils/global";
export default {
    name: 'drawImageFit',
    handle: async (canvas, ctx, url, opts) => {
        var _a, _b, _c;
        const [error, imageInfo] = await gbl.getImageInfo({ src: url });
        // 配置默认值
        const style = Object.assign({ round: 0, objectFit: 'cover', intrinsicSize: { width: (_a = imageInfo === null || imageInfo === void 0 ? void 0 : imageInfo.width) !== null && _a !== void 0 ? _a : 100, height: (_b = imageInfo === null || imageInfo === void 0 ? void 0 : imageInfo.height) !== null && _b !== void 0 ? _b : 100 }, specifiedSize: { width: 100, height: 100 }, intrinsicPosition: ['left', 'top'], specifiedPosition: [0, 0] }, opts);
        // 计算图片尺寸
        const drawImageInfo = calculateConcreteRect(style, style.intrinsicSize, style.specifiedSize);
        // 如有圆角, 则进行裁剪
        if (style.round > 0) {
            ctx.save();
            (_c = ctx.setFillStyle) === null || _c === void 0 ? void 0 : _c.call(ctx, 'transparent');
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
