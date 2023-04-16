export interface CanvasContext extends UniApp.CanvasContext {
  [key: string]: any
  createImageData: () => ImageData
  textAlign: CanvasTextDrawingStyles['textAlign']
  textBaseline: CanvasTextDrawingStyles['textBaseline']
  transform: CanvasTransform['transform']
}

export interface Canvas {
  width: number
  height: number
  getContext<K extends '2d' | 'webgl'>(contextType: K): K extends '2d' ? CanvasContext : WebGLRenderingContext
  createImage(): {
    src: string
    width: number
    height: number
    onload: () => void
    onerror: () => void
  }
  requestAnimationFrame(callback: Function): number
  cancelAnimationFrame(requestID: number): void
  createImageData(): ImageData
  createPath2D(path: Path2D): Path2D
  toDataURL(type: string, encoderOptions: number): string
}
