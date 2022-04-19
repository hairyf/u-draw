import { queryFields } from '../utils'
import { Consola } from './consola'
import { Plugins } from './plugin'
import DrawProcess from './process'
import { Canvas, DrawPosterOptions, DrawPosterResult } from './typed'

export const builder = (options: DrawPosterOptions, wait?: () => Promise<void>) => {
  // #region 初始化参数定义, 初始化插件系统 / debug 系统 / 进程系统
  const dp: DrawPosterResult = { $options: options } as any

  const ps = new Plugins(dp)
  const consola = new Consola(dp)
  const pcs = new DrawProcess(dp, consola)

  Object.defineProperty(dp, 'id', { get: () => options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })
  // #endregion

  // #region private
  const build = async () => {
    const { $drawPrototype, $options } = dp
    const { selector = '', componentThis } = $options || {}

    if ($drawPrototype) return $drawPrototype

    const nodeInfo = await queryFields(selector, componentThis, <any>{ node: true })
    const canvas: Canvas = (<any>nodeInfo)?.node || {}
    const ctx = canvas.getContext?.('2d') || uni.createCanvasContext(selector, componentThis)
    if (!canvas || !ctx || !selector) {
      throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')
    }
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

    await wait?.()

    const { canvas, ctx } = await build()

    Object.defineProperty(dp, 'canvas', { get: () => canvas })
    Object.defineProperty(dp, 'ctx', { get: () => ctx })

    ps.run('mounted')

    consola.success('挂载成功!', dp)
  }
  const ready = async () => promised
  // #endregion

  // #region public
  const render = async () => {
    await ready()

    const hideLoading = consola.loading('create')

    consola.log('绘制海报中...')

    const tips: boolean[] = await pcs.walk()

    consola.log('绘制状况: ', undefined, tips)

    if (options.type === 'context') {
      await new Promise((resolve) => dp.ctx!.draw(true, resolve))
    }

    hideLoading()

    return tips
  }
  const create = async (_options_ = {}) => {
    await ready()

    ps.run('beforeCreate')

    if (pcs.stacks.length > 0) await dp.render!()
    if (pcs.prevent) return Promise.reject()

    const hideLoading = consola.loading('create')

    const toPathOptions: UniApp.CanvasToTempFilePathOptions = <any>_options_

    if (options.type === '2d') (<any>toPathOptions).canvas = dp.canvas
    if (options.type === 'context') (<any>toPathOptions).canvasId = dp.id

    return new Promise<string>((resolve, reject) => {
      toPathOptions.success = (res) => {
        resolve(res.tempFilePath)
        hideLoading()
        consola.success('绘制成功', res)
        ps.run('created')
      }
      toPathOptions.fail = (err) => {
        reject(err)
        hideLoading()
        consola.error('绘制失败', err)
      }
      uni.canvasToTempFilePath(<any>options)
    })
  }
  // #endregion

  const promised = mount()

  return { dp, ps, consola, pcs, mount }
}
