import { Canvas, DrawPosterCanvasCtx } from './utils';
export declare const drawLoadImage: (canvas: Canvas | undefined, ctx: DrawPosterCanvasCtx, url: string, x: number, y: number, w: number, h: number) => Promise<boolean>;
export declare const fillWarpText: (ctx: DrawPosterCanvasCtx, text: string, maxWidth?: number, layer?: number, lineHeight?: number, x?: number, y?: number, notFillText?: boolean | undefined) => {
    text: string;
    y: number;
    x: number;
}[];
export declare const fillRoundRect: (ctx: DrawPosterCanvasCtx, x: number, y: number, w: number, h: number, r?: number) => void;
export declare const drawCtxInit: (canvas: Canvas, ctx: DrawPosterCanvasCtx) => void;
