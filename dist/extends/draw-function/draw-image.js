import { downloadImgUrl } from '../../utils/wx-utils';
/** 等待绘制图片原型方法 */
export default {
    name: 'drawImage',
    init: (canvas, ctx) => {
        ctx.oldDrawImage = ctx.drawImage;
    },
    handle: async (canvas, ctx, url, ...args) => {
        const path = await downloadImgUrl(url);
        ctx.existDrawImage = true;
        let result = false;
        if (ctx.drawType === 'context') {
            ctx.oldDrawImage(path, ...args);
            result = true;
        }
        if (ctx.drawType === 'type2d') {
            result = await new Promise(resolve => {
                const image = canvas.createImage();
                image.src = path;
                image.onload = () => {
                    ctx.oldDrawImage(image, ...args);
                    resolve(true);
                };
                image.onerror = () => resolve(false);
            });
        }
        return result;
    }
};
// ctx.drawImageFit(url, {
//   round: 15,
//   objectFit: 'cover',
//   intrinsicSize: {width: 100, height: 100}, 
//   specifiedSize: {width: 100, height: 100},
//   position: ['left', 'center']
// })
