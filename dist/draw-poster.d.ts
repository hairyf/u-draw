import { Canvas, DrawPosterCanvasCtx, CreateImagePathOptions, DrawPosterBuildOpts } from "./utils";
declare class DrawPoster {
    canvas: Canvas;
    ctx: DrawPosterCanvasCtx;
    canvasId: string;
    loading: boolean;
    drawImageTime: number;
    private executeOnions;
    constructor(canvas: Canvas, ctx: DrawPosterCanvasCtx, canvasId: string, loading: boolean, drawImageTime: number);
    /** 构建绘制海报矩形方法, 传入canvas选择器或配置对象, 返回绘制对象 */
    static build(options: string | DrawPosterBuildOpts, tips?: boolean): Promise<DrawPoster>;
    /** 构建多个绘制海报矩形方法, 传入选择器或配置对象的数组, 返回多个绘制对象 */
    static buildAll(optionsAll: (string | DrawPosterBuildOpts)[]): Promise<{
        [key: string]: DrawPoster;
    }>;
    /** 绘制器, 接收执行器函数, 添加到绘制容器中 */
    draw: (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => void;
    /** 等待创建绘画, 成功后清空绘制器容器 */
    awaitCreate: () => Promise<boolean[]>;
    /** 创建canvas本地地址 @returns {string} 本地地址 */
    createImagePath: (baseOptions?: CreateImagePathOptions) => Promise<string>;
}
export default DrawPoster;
