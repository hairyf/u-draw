export default {
    name: 'painter',
    handle: (dp, option) => {
        dp.canvas.width = option.width;
        dp.canvas.height = option.height;
        dp.draw(async (ctx) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            for (let i = 0; i < option.contents.length; i++) {
                ctx.save();
                const drawInfo = option.contents[i];
                if (drawInfo.type === 'rect') {
                    ctx.fillStyle = (_a = drawInfo.background) !== null && _a !== void 0 ? _a : '#000000';
                    ctx.fillRoundRect((_b = drawInfo.left) !== null && _b !== void 0 ? _b : 0, (_c = drawInfo.top) !== null && _c !== void 0 ? _c : 0, drawInfo.width, drawInfo.height, (_d = drawInfo.radius) !== null && _d !== void 0 ? _d : 0);
                }
                if (drawInfo.type === 'image') {
                    await ctx.drawImageFit(drawInfo.src, {
                        objectFit: (_e = drawInfo.objectFit) !== null && _e !== void 0 ? _e : 'cover',
                        intrinsicPosition: (_f = drawInfo.position) !== null && _f !== void 0 ? _f : ['center', 'center'],
                        specifiedSize: {
                            width: drawInfo.width,
                            height: drawInfo.height
                        },
                        radius: drawInfo.radius,
                    });
                }
                if (drawInfo.type === 'text') {
                    ctx.fillStyle = (_g = drawInfo.color) !== null && _g !== void 0 ? _g : '#000000';
                    ctx.font = `\
          ${(_h = drawInfo.fontStyle) !== null && _h !== void 0 ? _h : 'normal'} \
          ${(_j = drawInfo.fontWeight) !== null && _j !== void 0 ? _j : 'normal'} \
          ${uni.upx2px((_k = drawInfo.fontSize) !== null && _k !== void 0 ? _k : 30)} \
          ${(_l = drawInfo.fontFamily) !== null && _l !== void 0 ? _l : 'serial'}\
          `;
                    ctx.fillText(drawInfo.content, (_m = drawInfo.left) !== null && _m !== void 0 ? _m : 0, (_o = drawInfo.top) !== null && _o !== void 0 ? _o : 0, drawInfo.width);
                }
                if (drawInfo.type === 'line-feed-text') {
                    ctx.fillStyle = (_p = drawInfo.color) !== null && _p !== void 0 ? _p : '#000000';
                    ctx.font = `\
          ${(_q = drawInfo.fontStyle) !== null && _q !== void 0 ? _q : 'normal'} \
          ${(_r = drawInfo.fontWeight) !== null && _r !== void 0 ? _r : 'normal'} \
          ${uni.upx2px((_s = drawInfo.fontSize) !== null && _s !== void 0 ? _s : 30)} \
          ${(_t = drawInfo.fontFamily) !== null && _t !== void 0 ? _t : 'serial'}\
          `;
                    ctx.fillWarpText({
                        x: drawInfo.left,
                        y: drawInfo.top,
                        layer: drawInfo.lineClamp,
                        maxWidth: drawInfo.width,
                        text: drawInfo.content
                    });
                }
                ctx.restore();
            }
        });
    }
};
