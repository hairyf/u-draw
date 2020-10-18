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
import { getCanvas2dContext } from "./utils";
import { drawCtxMount } from "./draw-function";
class UniDrawPoster {
    constructor(canvas, ctx, canvasId) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasId = canvasId;
        this.executeOnions = [];
        /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
        this.draw = (execute) => {
            this.executeOnions.push(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.ctx.save();
                    yield execute(this.ctx);
                    this.ctx.restore();
                    return true;
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }));
        };
        /** 等待创建绘画, 成功后清空绘制器容器 */
        this.awaitCreate = () => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (let i = 0; i < this.executeOnions.length; i++) {
                const execute = this.executeOnions[i];
                result.push(yield execute());
            }
            this.executeOnions = [];
            return result;
        });
        /** 创建canvas本地地址 @returns {string} 本地地址 */
        this.createImagePath = (baseOptions = {}) => __awaiter(this, void 0, void 0, function* () {
            const { canvas, canvasId, executeOnions, awaitCreate } = this;
            executeOnions.length && (yield awaitCreate());
            return new Promise((resolve, reject) => {
                const options = Object.assign({ x: 0, y: 0, width: canvas && canvas.width, height: canvas && canvas.height, destWidth: canvas && canvas.width, destHeight: canvas && canvas.height, success: (res) => resolve(res.tempFilePath), fail: (err) => reject(err) }, baseOptions);
                if (canvas) {
                    options.canvas = canvas;
                }
                else {
                    options.canvasId = canvasId;
                }
                gbl.canvasToTempFilePath(options);
            });
        });
        drawCtxMount(canvas, ctx);
    }
    /** 构建绘制海报矩形方法, 传入canvas选择器字符串, 返回绘制对象 */
    static build(selector, componentThis) {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取canvas实例
            const canvas = yield getCanvas2dContext(selector, componentThis);
            const ctx = ((canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d")) || gbl.createCanvasContext(selector));
            return new UniDrawPoster(canvas, ctx, selector);
        });
    }
}
export default UniDrawPoster;
