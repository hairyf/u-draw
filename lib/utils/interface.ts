/** 绘制换行配置 */
export interface FillWarpTextOpts {
  text: string;
  maxWidth?: number;
  lineHeight?: number;
  layer?: number;
  x?: number;
  y?: number;
  notFillText?: boolean;
}

/** 绘制换行, 单行信息 */
export interface FillWarpTextItemInfo { text: string; y: number; x: number; }

/** 绘制画笔 */
export interface DrawPosterCanvasCtx extends UniApp.CanvasContext {
  createImageData: () => ImageData
  textAlign: CanvasTextDrawingStyles["textAlign"],
  textBaseline: CanvasTextDrawingStyles["textBaseline"]
  transform: CanvasTransform["transform"]
  /** 等待绘制图片
   * 说明文档: https://github.com/TuiMao233/uni-draw-poster#绘制图片
   */
  drawLoadImage(url: string, x: number, y: number, w: number, h: number): Promise<boolean>;
  /** 绘制换行字体
   * 说明文档: https://github.com/TuiMao233/uni-draw-poster#换行字体
   */
  fillWarpText(options: FillWarpTextOpts): Array<FillWarpTextItemInfo>;
  /** 绘制圆角矩形
   * 说明文档: https://github.com/TuiMao233/uni-draw-poster#圆角矩形
   */
  fillRoundRect(x: number, y: number, w: number, h: number, r: number): void;
}

/** Canvas2d实例 */
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

/** 绘制容器 */
export type Execute = Array<() => Promise<boolean>>

/** 创建图片路径配置项 */
export interface CreateImagePathOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  destWidth?: number;
  destHeight?: number;
}