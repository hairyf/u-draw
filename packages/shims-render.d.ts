type Executes = Array<() => Promise<boolean>>

type CreateImagePathOptions<> = NonPick<
  WechatMiniprogram.CanvasToTempFilePathOption,
  'canvas' | 'canvasId' | 'complete' | 'success' | 'fail'
>