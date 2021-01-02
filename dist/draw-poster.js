import gbl, { PLATFORM } from "./utils/global";
import { handleBuildOpts, extendMount } from "./utils/utils";
import { getCanvas2dContext } from "./utils/wx-utils";
// 扩展挂载储存
let drawPosterExtend = {};
let drawCtxPosterExtend = {};
class DrawPoster {
    /** 构建器, 构建返回当前实例, 并挂载多个方法 */
    constructor(canvas, ctx, canvasId, loading, drawImageTime, debugging, loadingText, createText) {
        var _a;
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
        /** 提示器, 传入消息与数据 */
        this.debuggingLog = (message, data) => {
            if (this.debugging) {
                if (data) {
                    console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd", data);
                }
                else {
                    console.log(`%c${this.canvasId} -> ${message}`, "color: #3489fd");
                }
            }
        };
        /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
        this.draw = (execute) => {
            const length = this.executeOnions.length;
            this.executeOnions.push(async () => {
                var _a, _b;
                try {
                    this.ctx.save();
                    await execute(this.ctx);
                    this.ctx.restore();
                    return true;
                }
                catch (error) {
                    const isOutError = ((_b = (_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.call(_a, `'nodeId' of undefined`)) >= 0;
                    !isOutError && console.error(`${this.canvasId} -> 绘画栈(${length})，绘制错误：`, error);
                    return false;
                }
            });
        };
        /** 等待创建绘画, 成功后清空绘制器容器 */
        this.awaitCreate = async () => {
            this.debuggingLog('绘制海报中...');
            this.loading && gbl.showLoading({ title: this.loadingText });
            const tips = [];
            for (let i = 0; i < this.executeOnions.length; i++) {
                const execute = this.executeOnions[i];
                tips.push(await execute());
            }
            this.executeOnions = [];
            this.debuggingLog('绘制状况', tips);
            // 当前绘制为 type2 绘制
            if (this.drawType === 'type2d') {
                this.loading && gbl.hideLoading();
                return tips;
            }
            // 当前绘制为 context 绘制
            return await new Promise((resolve) => {
                this.ctx.draw(true, () => {
                    resolve(tips);
                    this.loading && gbl.hideLoading();
                });
                // 当环境是app时，ctx.draw 回调不触发, 手动定时器触发
                if (PLATFORM === "app-plus") {
                    const time = this.ctx.existDrawImage ? this.drawImageTime : 0;
                    this.ctx.existDrawImage = false;
                    setTimeout(() => {
                        resolve(tips);
                        this.loading && gbl.hideLoading();
                    }, time);
                }
            });
        };
        /** 创建canvas本地地址 @returns {string} 本地地址 */
        this.createImagePath = async (baseOptions = {}) => {
            const { canvas, canvasId, executeOnions, awaitCreate } = this;
            executeOnions.length && await awaitCreate();
            // 如果当前为停止状态
            if (this.stopStatus) {
                this.stopStatus = false;
                return '---stop createImagePath---';
            }
            this.loading && gbl.showLoading({ title: this.createText });
            const options = Object.assign({ x: 0, y: 0, width: canvas.width, height: canvas.height, destWidth: canvas.width * 2, destHeight: canvas.height * 2 }, baseOptions);
            if (this.drawType === 'context')
                options.canvasId = canvasId;
            if (this.drawType === 'type2d')
                options.canvas = canvas;
            return new Promise((resolve, reject) => {
                options.success = (res) => {
                    resolve(res.tempFilePath);
                    this.loading && gbl.hideLoading();
                    this.debuggingLog('绘制成功 🎉', res);
                };
                options.fail = (err) => {
                    reject(err);
                    this.loading && gbl.hideLoading();
                    this.debuggingLog('绘制失败 🌟', err);
                };
                gbl.canvasToTempFilePath(options);
            });
        };
        /** 停止当前绘画, 调用则停止当前绘画堆栈的绘画 */
        this.stop = () => {
            this.executeOnions = [];
            this.stopStatus = true;
        };
        if (!canvas || !ctx || !canvasId) {
            throw new Error("DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects");
        }
        // 判断当前绘制类型
        ctx.drawType = this.drawType = (ctx.draw) ? 'context' : 'type2d';
        // 挂载全局实例, 绘画扩展
        extendMount(this.ctx, drawCtxPosterExtend, (extend, init) => {
            init === null || init === void 0 ? void 0 : init(this.canvas, this.ctx);
            return (...args) => extend(this.canvas, this.ctx, ...args);
        });
        extendMount(this, drawPosterExtend, (extend, init) => {
            init === null || init === void 0 ? void 0 : init(this);
            return (...args) => extend(this, ...args);
        });
        // 当离开页面时, 自动调用停止绘画
        const _this = this;
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        // 查询标识, 不存在, 在替换页面卸载回调, 避免产生死循环
        if (!((_a = page === null || page === void 0 ? void 0 : page.onUnload) === null || _a === void 0 ? void 0 : _a.identification)) {
            page.oldOnUnload = page.onUnload;
            page.onUnload = function () {
                _this === null || _this === void 0 ? void 0 : _this.stop();
                page.oldOnUnload();
            };
            page.onUnload.identification = true;
        }
    }
}
/** 传入挂载配置对象, 添加扩展方法 */
DrawPoster.use = (opts) => {
    drawPosterExtend[opts.name] = opts;
};
/** 传入挂载配置对象, 添加绘画扩展方法 */
DrawPoster.useCtx = (opts) => {
    drawCtxPosterExtend[opts.name] = opts;
};
/** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
DrawPoster.build = async (options, tips = true) => {
    var _a;
    const config = handleBuildOpts(options);
    // 初始化监测当前页面绘制对象
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    if (page[config.selector + '__dp']) {
        return page[config.selector + '__dp'];
    }
    // 获取canvas实例
    const canvas = await getCanvas2dContext(config.selector, config.componentThis);
    const ctx = (((_a = canvas.getContext) === null || _a === void 0 ? void 0 : _a.call(canvas, "2d")) || gbl.createCanvasContext(config.selector, config.componentThis));
    tips && console.log("%cdraw-poster 构建完成：", "#E3712A", { canvas, ctx, selector: config.selector });
    const dp = new DrawPoster(canvas, ctx, config.selector, config.loading, config.drawImageTime, config.debugging, config.loadingText, config.createText);
    // 储存当前绘制对象
    page[config.selector + '__dp'] = dp;
    return dp;
};
/** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
DrawPoster.buildAll = async (optionsAll) => {
    const dpsArr = await Promise.all(optionsAll.map(async (options) => {
        return await DrawPoster.build(options, false);
    }));
    const dpsObj = {};
    dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp);
    console.log("%cdraw-poster 构建完成：", "#E3712A", dpsObj);
    return dpsObj;
};
export default DrawPoster;
