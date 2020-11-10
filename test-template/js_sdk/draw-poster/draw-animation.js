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
import { getCanvas2dContext, } from "./utils";
import { drawCtxMount } from "./draw-function";
export default class DrawAnimation {
    constructor(canvas, ctx, canvasId) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasId = canvasId;
        this.executes = [];
        /** 创建一个动画 */
        this.anim = (opts) => {
            var _a;
            // 定义默认数据
            if (typeof opts.injectSpeed !== 'undefined') {
                opts.injectSpeed = 400 - opts.injectSpeed;
            }
            else {
                opts.injectSpeed = 60;
            }
            if (typeof opts.animSpeed !== 'undefined') {
                opts.animSpeed = 1000 / opts.injectSpeed;
            }
            else {
                opts.animSpeed = 1000 / 60;
            }
            opts.clearDarw = (_a = opts.clearDarw) !== null && _a !== void 0 ? _a : true;
            // 定义初始化数据
            const ctx = this.ctx;
            const queues = [];
            let injectTimer = 0;
            let animTimer = 0;
            // 运行函数
            function play() {
                injectTimer = setInterval(() => {
                    queues.push(opts.inject());
                }, opts.injectSpeed);
                animTimer = setInterval(() => {
                    var _a, _b, _c;
                    (_a = opts.changerInit) === null || _a === void 0 ? void 0 : _a.call(opts, queues);
                    for (let i = 0; i < queues.length; i++) {
                        const item = queues[i];
                        opts.changer(item, i, queues);
                    }
                    (_b = opts.plotterInit) === null || _b === void 0 ? void 0 : _b.call(opts, ctx, queues);
                    for (let i = 0; i < queues.length; i++) {
                        const item = queues[i];
                        ctx.save();
                        opts.plotter(ctx, item, i, queues);
                        ctx.restore();
                        (_c = ctx.draw) === null || _c === void 0 ? void 0 : _c.call(ctx, true);
                    }
                }, opts.animSpeed);
            }
            // 停止函数
            function stop() {
                clearInterval(injectTimer);
                clearInterval(animTimer);
            }
            return { play, stop };
        };
        drawCtxMount(canvas, ctx);
    }
    /** 构建绘制海报矩形方法, 传入canvas选择器字符串, 返回绘制对象 */
    static build(selector, componentThis) {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取canvas实例
            const canvas = yield getCanvas2dContext(selector, componentThis);
            const ctx = (canvas.getContext && canvas.getContext("2d") || gbl.createCanvasContext(selector));
            return new DrawAnimation(canvas, ctx, selector);
        });
    }
}
