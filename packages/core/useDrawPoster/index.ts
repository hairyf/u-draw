import { createDrawOptions, queryFields } from '../utils'

export const useDrawPoster: UseDrawPoster = async (...args) => {
  const options = createDrawOptions(<any>args[0], <any>args[1])

  // #region TODO: 初始化查询页面绘制实例, 实现单例模式
  // #endregion

  const _nodeInfo = await queryFields(options.selector, options.componentThis, <any>{ node: true })
  const canvas: Canvas = (<any>_nodeInfo)?.node || {}
  const ctx =
    canvas.getContext?.('2d') || uni.createCanvasContext(options.selector, options.componentThis)

  function create() {}
  function createImagePath() {}

  return {
    ctx,
    canvas,
    create,
    createImagePath
  }
}
