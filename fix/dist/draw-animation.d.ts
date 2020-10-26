import { Canvas, DrawPosterCanvasCtx } from "./utils";
interface DarwOptions<T> {
    /** 变换器速率 */
    animSpeed?: number;
    /** 注入器速率 */
    injectSpeed?: number;
    /** 是否在每次绘制时清除画布 */
    clearDarw?: boolean;
    /** 注入内容 */
    inject: () => T;
    /** 变化器循环前 */
    changerInit?: (queues: T[]) => void;
    /** 变化器 */
    changer: (item: T, index: number, queues: T[]) => void;
    /** 绘制器循环前 */
    plotterInit?: (ctx: DrawPosterCanvasCtx, queues: T[]) => void;
    /** 绘制器 */
    plotter: (ctx: DrawPosterCanvasCtx, item: T, index: number, queues: T[]) => void;
}
export default class DrawAnimation {
    canvas: Canvas;
    ctx: DrawPosterCanvasCtx;
    canvasId: string;
    private executes;
    constructor(canvas: Canvas, ctx: DrawPosterCanvasCtx, canvasId: string);
    /** 构建绘制海报矩形方法, 传入canvas选择器字符串, 返回绘制对象 */
    static build(selector: string, componentThis?: any): Promise<DrawAnimation>;
    /** 创建一个动画 */
    anim: <T>(opts: DarwOptions<T>) => {
        play: () => void;
        stop: () => void;
    };
}
export {};
