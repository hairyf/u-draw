import { getCurrentDrawPoster, setCurrentDrawPoster } from '../helpers/internal'
import { promisify, queryFields } from '../utils'
import { Consola } from './consola'
import { Plugins } from './plugin'
import DrawProcess from './process'
import type { Canvas, DrawPosterOptions, DrawPosterInstance } from './typed'

export const builder = (options: DrawPosterOptions) => {
  // 假如当前页面已存在实例, 则直接返回
  const currentDrawPoster = getCurrentDrawPoster(options.selector)
  if (currentDrawPoster)
    return currentDrawPoster

  // #region 初始化参数定义, 初始化插件系统 / debug 系统 / 进程系统
  const dp: DrawPosterInstance = { $options: options } as any

  const ps = new Plugins(dp)
  const consola = new Consola(dp)
  const pcs = new DrawProcess(dp, consola)

  Object.defineProperty(dp, 'id', { get: () => options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })
  Object.defineProperty(dp, 'mount', { get: () => mount })
  // #endregion

  // #region private
  const build = async () => {
    const { $drawPrototype, $options } = dp
    const { selector = '', componentThis } = $options || {}

    if ($drawPrototype)
      return await $drawPrototype

    const nodeInfo = await queryFields(selector, componentThis, { node: true } as any)
    const canvas: Canvas = (nodeInfo as any)?.node || {}
    const ctx = canvas.getContext?.('2d') || uni.createCanvasContext(selector, componentThis)
    if (!canvas || !ctx || !selector)
      throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')

    canvas!.width = $options?.width ?? 0
    canvas!.height = $options?.height ?? 0
    return { canvas, ctx }
  }
  const mount = async () => {
    ps.run('beforeMount')

    Object.defineProperty(dp, 'render', { get: () => render })
    Object.defineProperty(dp, 'create', { get: () => create })
    Object.defineProperty(dp, 'ready', { get: () => ready })

    Object.defineProperty(dp, 'draw', { get: () => pcs.push })
    Object.defineProperty(dp, 'stop', { get: () => pcs.stop })
    Object.defineProperty(dp, 'use', { get: () => ps.use })

    const { canvas, ctx } = await build()

    Object.defineProperty(dp, 'canvas', { get: () => canvas })
    Object.defineProperty(dp, 'ctx', { get: () => ctx })

    ps.run('mounted')

    resolved()

    consola.success('挂载成功!', dp)
    return dp
  }
  const ready = async () => promised.then(() => dp)
  // #endregion

  // #region public
  const render = async () => {
    await ready()

    const hideLoading = consola.loading('create')

    const tips: boolean[] = await pcs.walk()
    consola.log('绘制状况: ', undefined, tips)

    if (options.type === 'context')
      await new Promise(resolve => dp.ctx!.draw(true, resolve))

    hideLoading()

    return tips
  }
  const create = async (_options_ = {}) => {
    await ready()
    ps.run('beforeCreate')

    consola.log('beforeCreate')

    if (pcs.stacks.length > 0)
      await dp.render!()
    if (pcs.prevent)
      return Promise.reject()

    const hideLoading = consola.loading('create')

    const toPathOptions: UniApp.CanvasToTempFilePathOptions = _options_ as any

    if (options.type === '2d')
      (toPathOptions as any).canvas = dp.canvas
    if (options.type === 'context')
      (toPathOptions as any).canvasId = dp.id

    try {
      const { tempFilePath } = await promisify(uni.canvasToTempFilePath)(toPathOptions)
      consola.success('绘制成功', { tempFilePath })
      return tempFilePath
    }
    catch (error) {
      consola.error('绘制失败', error)
    }
    finally { hideLoading() }
  }
  // #endregion

  let resolved: Function
  let promised: Promise<void> = new Promise(resolve => resolved = resolve)

  // 保存实例, 实现单页面同个实例
  setCurrentDrawPoster(dp, ps)

  return dp
}
