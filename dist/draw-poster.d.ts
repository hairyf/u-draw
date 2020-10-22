import { Canvas, DrawPosterCanvasCtx, CreateImagePathOptions } from "./utils";
declare class DrawPoster {
    canvas: Canvas;
    ctx: DrawPosterCanvasCtx;
    canvasId: string;
    private executeOnions;
    constructor(canvas: Canvas, ctx: DrawPosterCanvasCtx, canvasId: string);
    /** 构建绘制海报矩形方法, 传入canvas选择器字符串, 返回绘制对象 */
    static build(selector: string, componentThis?: any): Promise<DrawPoster>;
    /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
    draw: (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => void;
    /** 等待创建绘画, 成功后清空绘制器容器 */
    awaitCreate: () => Promise<unknown>;
    /** 创建canvas本地地址 @returns {string} 本地地址 */
    createImagePath: (baseOptions?: CreateImagePathOptions) => Promise<unknown>;
}
export default DrawPoster;
