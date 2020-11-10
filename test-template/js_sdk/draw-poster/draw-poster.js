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
    constructor(canvas, ctx, canvasId, loading, drawImageTime, debugging, loadingText, createText) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasId = canvasId;
        this.loading = loading;
        this.drawImageTime = drawImageTime;
        this.debugging = debugging;
        this.loadingText = loadingText;
        this.createText = createText;
        this.executeOnions = [];
        this.stopStatus = false;
        /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
        this.draw = (execute) => {
            const length = this.executeOnions.length;
            this.executeOnions.push(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    this.ctx.save();
                    yield execute(this.ctx);
                    this.ctx.restore();
                    return true;
                }
                catch (error) {
                    const isOutError = ((_a = error.search) === null || _a === void 0 ? void 0 : _a.call(error, `'nodeId' of undefined`)) >= 0;
                    if (isOutError) {
                        return false;
                    }
                    else {
                        console.error(`${this.canvasId} -> 绘画栈(${length})，绘制错误：`, error);
                        return false;
                    }
                }
            }));
        };
        /** 等待创建绘画, 成功后清空绘制器容器 */
        this.awaitCreate = () => __awaiter(this, void 0, void 0, function* () {
            this.debuggingLog('绘制海报中...');
            this.loading && uni.showLoading({ title: this.loadingText });
            const tips = [];
            for (let i = 0; i < this.executeOnions.length; i++) {
                const execute = this.executeOnions[i];
                tips.push(yield execute());
            }
            this.executeOnions = [];
            this.debuggingLog('绘制状况', tips);
            // 当前绘制为 type2 绘制
            if (!this.ctx.draw) {
                uni.hideLoading();
                return tips;
            }
            // 当前绘制为 context 绘制
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
        });
        /** 创建canvas本地地址 @returns {string} 本地地址 */
        this.createImagePath = (baseOptions = {}) => __awaiter(this, void 0, void 0, function* () {
            const { canvas, canvasId, executeOnions, awaitCreate } = this;
            executeOnions.length && (yield awaitCreate());
            if (this.stopStatus) {
                this.stopStatus = false;
                return '';
            }
            this.loading && uni.showLoading({ title: this.createText });
            return new Promise((resolve, reject) => {
                const options = Object.assign({ x: 0, y: 0, width: canvas.width, height: canvas.height, destWidth: canvas.width * 2, destHeight: canvas.height * 2, success: (res) => {
                        resolve(res.tempFilePath);
                        this.loading && uni.hideLoading();
                        this.debuggingLog('绘制成功 🎉', res);
                    }, fail: (err) => {
                        reject(err);
                        this.loading && uni.hideLoading();
                        this.debuggingLog('绘制失败 🌟', err);
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
        /** 停止当前绘画, 调用则停止当前绘画堆栈的绘画 */
        this.stop = () => {
            this.executeOnions = [];
            this.stopStatus = true;
        };
        if (!canvas || !ctx || !canvasId) {
            throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects");
        }
        drawCtxMount(canvas, ctx);
        // 当离开页面时, 自动调用停止绘画
        const _this = this;
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        page.oldOnUnload = page.onUnload;
        page.onUnload = function () {
            _this.stop();
            page.oldOnUnload();
        };
    }
    /** 提示器, 传入消息与数据 */
    debuggingLog(message, data) {
        if (this.debugging) {
            if (data) {
                console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd", data);
            }
            else {
                console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd");
            }
        }
    }
    /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
    static build(options, tips = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { selector, componentThis, loading, drawImageTime, debugging, loadingText, createText } = handleBuildOpts(options);
            // 初始化监测当前页面绘制对象
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            if (page[selector + '__dp']) {
                return page[selector + '__dp'];
            }
            // 获取canvas实例
            const canvas = yield getCanvas2dContext(selector);
            const ctx = (((_a = canvas.getContext) === null || _a === void 0 ? void 0 : _a.call(canvas, "2d")) || gbl.createCanvasContext(selector, componentThis));
            tips && console.log("%cdraw-poster 构建完成：", "#E3712A", { canvas, ctx, selector });
            const dp = new DrawPoster(canvas, ctx, selector, loading, drawImageTime, debugging, loadingText, createText);
            // 储存当前绘制对象
            page[selector + '__dp'] = dp;
            return dp;
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
            console.log("%cdraw-poster 构建完成：", "#E3712A", dpsObj);
            return dpsObj;
        });
    }
}
export default DrawPoster;
