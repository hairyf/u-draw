export interface DrawPosterCanvasCtx extends UniApp.CanvasContext {
    createImageData: () => ImageData;
    textAlign: CanvasTextDrawingStyles["textAlign"];
    textBaseline: CanvasTextDrawingStyles["textBaseline"];
    transform: CanvasTransform["transform"];
    /** 等待绘制图片
   * @param  {string} url 网络图片地址(必须)
   * @param  {number} x 绘制x轴位置(必须)
   * @param  {number} y 绘制y轴位置(必须)
   * @param  {number} w 绘制图片宽度(必须)
   * @param  {number} h 绘制图片高度(必须)
   * @returns {Promise} 图片绘制成功时返回true, 需ctx.restore()绘制出实体
   */
    drawLoadImage(url: string, x: number, y: number, w: number, h: number): Promise<boolean>;
    /** 绘制换行字体
     * @param  {string} text 本地图片地址(必须)
     * @param  {number} x 绘制x轴位置(必须)
     * @param  {number} y 绘制y轴位置(必须)
     * @param  {number} width 绘制换行字体的最大宽度(必须)
     * @param  {number} fontHeight 字体高度(必须)
     * @param  {number} layer 绘制层数(必须)
     * @returns {void} 无返回值, 需ctx.restore()绘制出实体
     */
    fillWarpText(options: {
        text: string;
        maxWidth?: number;
        lineHeight?: number;
        layer?: number;
        x?: number;
        y?: number;
        notFillText?: boolean;
    }): Array<{}>;
    /** 绘制圆角矩形
     * @param {number} x x坐标轴(必须)
     * @param {number} y y坐标轴(必须)
     * @param {number} w 宽度(必须)
     * @param {number} h 高度(必须)
     * @param {number} r 圆角半径 默认为0
     */
    fillRoundRect(x: number, y: number, w: number, h: number, r: number): void;
}
export interface Canvas {
    width: number;
    height: number;
    getContext(contextType: "2d" | "webgl"): DrawPosterCanvasCtx | WebGLRenderingContext;
    createImage(): {
        src: string;
        width: number;
        height: number;
        onload: () => void;
        onerror: () => void;
    };
    requestAnimationFrame(callback: Function): number;
    cancelAnimationFrame(requestID: number): void;
    createImageData(): ImageData;
    createPath2D(path: Path2D): Path2D;
    toDataURL(type: string, encoderOptions: number): string;
}
export declare type Execute = Array<() => Promise<boolean>>;
export interface CreateImagePathOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    destWidth?: number;
    destHeight?: number;
}
