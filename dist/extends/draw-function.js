var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { downloadImgUrl } from '../utils/wx-utils';
/** 等待绘制图片原型方法 */
export const drawImage = {
    name: 'drawImage',
    init: (canvas, ctx) => {
        ctx.oldDrawImage = ctx.drawImage;
    },
    handle: (canvas, ctx, url, x, y, w, h) => __awaiter(void 0, void 0, void 0, function* () {
        const path = yield downloadImgUrl(url);
        ctx.existDrawImage = true;
        let result = false;
        if (!(canvas === null || canvas === void 0 ? void 0 : canvas.createImage)) {
            ctx.oldDrawImage(path, x, y, w, h);
            result = true;
        }
        else {
            // canvas2d 绘制图片
            result = yield new Promise(resolve => {
                const image = canvas.createImage();
                image.src = path;
                image.onload = () => {
                    ctx.oldDrawImage(image, x, y, w, h);
                    ctx.restore();
                    resolve(true);
                };
                image.onerror = () => resolve(false);
            });
        }
        return result;
    })
};
/** 绘制换行字体原型方法 */
export const fillWarpText = {
    name: 'fillWarpText',
    handle: (canvas, ctx, config) => {
        const newConfig = config = Object.assign({ maxWidth: 100, layer: 2, lineHeight: Number(ctx.font.replace(/[^0-9.]/g, '')), x: 0, y: Number(ctx.font.replace(/[^0-9.]/g, '')) / 1.2, splitText: '', notFillText: false }, config);
        const { text, splitText, maxWidth, layer, lineHeight, notFillText, x, y } = newConfig;
        // 当字符串为空时, 抛出错误
        if (!text) {
            throw Error('warpFillText Error: text is empty string');
        }
        // 分割所有单个字符串
        const chr = text.split(splitText);
        // 存入的每行字体的容器
        let row = [];
        // 判断字符串
        let timp = '';
        if (splitText) {
            row = chr;
        }
        else {
            // 遍历所有字符串, 填充行容器
            for (let i = 0; i < chr.length; i++) {
                // 当超出行列时, 停止执行遍历, 节省计算时间
                if (row.length > layer) {
                    break;
                }
                if (ctx.measureText(timp).width < maxWidth) {
                    // 如果超出长度, 添加进row数组
                    timp += chr[i];
                }
                else {
                    // 如超出一行长度, 则换行, 并清除容器
                    i--;
                    row.push(timp);
                    timp = '';
                }
            }
            // 如有剩下字体, 则在最后时添加一行
            if (timp) {
                row.push(timp);
            }
            // 如果数组长度大于指定行数
            if (row.length > layer) {
                row = row.slice(0, layer);
                // 结束的索引
                const end = layer - 1;
                for (let i = 0; i < row[end].length; i++) {
                    const currentWidth = ctx.measureText(`${row[end]}...`).width;
                    if (currentWidth > maxWidth) {
                        // 加上... 当前宽度大于最大宽度时, 去除一位字符串
                        const strEnd = row[end].length - 1;
                        row[end] = row[end].slice(0, strEnd);
                    }
                    else {
                        row[end] += '...';
                        break;
                    }
                }
            }
        }
        // 储存并返回绘制信息
        const drawInfos = row.map((item, index) => {
            const info = {
                text: item,
                y: y + index * lineHeight,
                x: x,
            };
            // 默认执行绘制信息
            if (!notFillText) {
                ctx.fillText(info.text, info.x, info.y);
            }
            return info;
        });
        return drawInfos;
    }
};
/** 绘制圆角矩形原型方法 */
export const roundRect = {
    name: 'roundRect',
    handle: (canvas, ctx, x, y, w, h, r = 15, fill = false, stroke = false) => {
        if (w < 2 * r) {
            r = w / 2;
        }
        if (h < 2 * r) {
            r = h / 2;
        }
        // 开始绘制
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
        // 移动复制
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.lineTo(x + w, y + r);
        // (x,y,z,j,f) x,y圆心z半径,j起始弧度f，终止弧度
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
        ctx.lineTo(x + w, y + h - r);
        ctx.lineTo(x + w - r, y + h);
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
        ctx.lineTo(x + r, y + h);
        ctx.lineTo(x, y + h - r);
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x + r, y);
        if (stroke)
            ctx.stroke();
        if (fill)
            ctx.fill();
        ctx.closePath();
    }
};
/** 绘制填充圆角矩形方法 */
export const fillRoundRect = {
    name: 'fillRoundRect',
    handle: (canvas, ctx, x, y, w, h, r) => {
        ctx.roundRect(x, y, w, h, r, true);
    }
};
/** 绘制填充圆角矩形方法 */
export const strokeRoundRect = {
    name: 'strokeRoundRect',
    handle: (canvas, ctx, x, y, w, h, r) => {
        ctx.roundRect(x, y, w, h, r, false, true);
    }
};
/** 绘制圆角图片原型方法 */
export const drawRoundImage = {
    name: 'drawRoundImage',
    handle: (canvas, ctx, url, x, y, w, h, r = 15) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        ctx.save();
        (_a = ctx.setFillStyle) === null || _a === void 0 ? void 0 : _a.call(ctx, 'transparent');
        ctx.fillStyle = 'transparent';
        ctx.fillRoundRect(x, y, w, h, r);
        ctx.clip();
        const result = yield ctx.drawImage(url, x, y, w, h);
        return result;
    })
};
