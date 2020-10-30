var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import gbl from "./utils/global";
import { getCanvas2dContext, handleBuildOpts } from "./utils";
import { drawCtxMount } from "./draw-function";
class DrawPoster {
    constructor(canvas, ctx, canvasId, loading, drawImageTime, debugging) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasId = canvasId;
        this.loading = loading;
        this.drawImageTime = drawImageTime;
        this.debugging = debugging;
        this.executeOnions = [];
        /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
        this.draw = (execute) => {
            const length = this.executeOnions.length;
            this.executeOnions.push(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.ctx.save();
                    yield execute(this.ctx);
                    this.ctx.restore();
                    return true;
                }
                catch (error) {
                    console.error(`绘画栈(${length})，绘制错误：`, error);
                    return false;
                }
            }));
        };
        /** 等待创建绘画, 成功后清空绘制器容器 */
        this.awaitCreate = () => __awaiter(this, void 0, void 0, function* () {
            this.loading && uni.showLoading({ title: '绘制海报中...' });
            const tips = [];
            for (let i = 0; i < this.executeOnions.length; i++) {
                const execute = this.executeOnions[i];
                tips.push(yield execute());
            }
            this.executeOnions = [];
            this.debugging && (console.log('当前绘制状况：', tips));
            if (!!this.ctx.draw) {
                return yield new Promise((resolve) => {
                    this.ctx.draw(true, () => {
                        resolve(tips);
                        this.loading && uni.hideLoading();
                    });
                    // #ifdef APP-PLUS
                    let time = 0;
                    if (this.ctx.existDrawImage) {
                        time = 100;
                        this.ctx.existDrawImage = false;
                    }
                    setTimeout(() => {
                        resolve(tips);
                        this.loading && uni.hideLoading();
                    }, time);
                    // #endif
                });
            }
            uni.hideLoading();
            return tips;
        });
        /** 创建canvas本地地址 @returns {string} 本地地址 */
        this.createImagePath = (baseOptions = {}) => __awaiter(this, void 0, void 0, function* () {
            const { canvas, canvasId, executeOnions, awaitCreate, debugging } = this;
            if (executeOnions.length) {
                const tips = yield awaitCreate();
                debugging && (console.log('当前绘制状况：', tips));
            }
            this.loading && uni.showLoading({ title: '生成图片中...' });
            return new Promise((resolve, reject) => {
                const options = Object.assign({ x: 0, y: 0, width: canvas.width, height: canvas.height, destWidth: canvas.width * 2, destHeight: canvas.height * 2, success: (res) => {
                        resolve(res.tempFilePath);
                        this.loading && uni.hideLoading();
                    }, fail: (err) => {
                        this.loading && uni.hideLoading();
                        reject(err);
                    } }, baseOptions);
                if (!canvas.createImage) {
                    options.canvasId = canvasId;
                }
                else {
                    options.canvas = canvas;
                }
                gbl.canvasToTempFilePath(options);
            });
        });
        if (!canvas || !ctx || !canvasId) {
            throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects");
        }
        drawCtxMount(canvas, ctx);
    }
    /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
    static build(options, tips = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector, componentThis, loading, drawImageTime, debugging } = handleBuildOpts(options);
            // 获取canvas实例
            const canvas = yield getCanvas2dContext(selector);
            const ctx = (canvas.getContext && canvas.getContext("2d") || gbl.createCanvasContext(selector, componentThis));
            tips && console.log("draw-poster 构建完成：", { canvas, ctx, selector });
            return new DrawPoster(canvas, ctx, selector, loading, drawImageTime, debugging);
        });
    }
    /** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
    static buildAll(optionsAll) {
        return __awaiter(this, void 0, void 0, function* () {
            const dpsArr = yield Promise.all(optionsAll.map((options) => __awaiter(this, void 0, void 0, function* () {
                return yield DrawPoster.build(options, false);
            })));
            const dpsObj = {};
            dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp);
            console.log("draw-posters 构建完成：", dpsObj);
            return dpsObj;
        });
    }
}
export default DrawPoster;
