import { getCurrentDrawPoster, setCurrentDrawPoster } from '../helpers/internal'
import { helperDrawPosterParams } from '../helpers/params'
import { queryFields } from '../utils'
import { Consola } from './consola'
import { Plugins, DrawPosterPlugin } from './plugin'
import DrawProcess from './process'
import { Canvas, DrawPosterOptions, DrawPosterResult } from './typed'

function useDrawPoster(
  selector: string,
  options?: Partial<Omit<DrawPosterOptions, 'selector'>>
): Promise<DrawPosterResult>
function useDrawPoster(options: DrawPosterOptions): Promise<DrawPosterResult>

async function useDrawPoster(...args: any[]) {
  const $options = helperDrawPosterParams(...args)

  // 假如当前页面已存在实例, 则直接返回
  const currentDrawPoster = getCurrentDrawPoster($options.selector)
  if (currentDrawPoster) return currentDrawPoster

  // #region 初始化参数定义, 初始化插件系统 / debug 系统 / 进程系统
  const dp: Partial<DrawPosterResult> = { $options }

  const ps = new Plugins(dp)
  const consola = new Consola(dp)
  const pcs = new DrawProcess(dp, consola)

  Object.defineProperty(dp, 'id', { get: () => $options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })

  // #endregion

  // #region 基础方法定义
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
  const render = async () => {
    const hideLoading = consola.loading('create')

    consola.log('绘制海报中...')

    const tips: boolean[] = await pcs.walk()

    consola.log('绘制状况: ', undefined, tips)

    if ($options.type === 'context') {
      await new Promise((resolve) => dp.ctx!.draw(true, resolve))
    }

    hideLoading()

    return tips
  }
  const create = async (_options_ = {}) => {
    ps.run('beforeCreate')

    if (pcs.stacks.length > 0) await dp.render!()
    if (pcs.prevent) return Promise.reject()

    const hideLoading = consola.loading('create')

    const options: UniApp.CanvasToTempFilePathOptions = <any>_options_

    if ($options.type === '2d') (<any>options).canvas = dp.canvas
    if ($options.type === 'context') (<any>options).canvasId = dp.id

    const promised = new Promise<string>((resolve, reject) => {
      options.success = (res) => {
        resolve(res.tempFilePath)
        hideLoading()
        consola.success('绘制成功', res)
        ps.run('created')
      }
      options.fail = (err) => {
        reject(err)
        hideLoading()
        consola.error('绘制失败', err)
      }
      uni.canvasToTempFilePath(<any>options)
    })

    return promised
  }
  // #endregion

  // #region 挂载数据与方法
  ps.run('beforeMount')

  const { canvas, ctx } = await build()

  Object.defineProperty(dp, 'canvas', { get: () => canvas })
  Object.defineProperty(dp, 'ctx', { get: () => ctx })
  Object.defineProperty(dp, 'render', { get: () => render })
  Object.defineProperty(dp, 'create', { get: () => create })
  Object.defineProperty(dp, 'draw', { get: () => pcs.push })
  Object.defineProperty(dp, 'stop', { get: () => pcs.stop })
  Object.defineProperty(dp, 'use', { get: () => ps.use })

  ps.run('mounted')

  consola.success('构建成功!', dp)
  // #endregion

  // 保存实例, 实现单页面同个实例
  setCurrentDrawPoster(dp, ps)

  return dp
}

export { useDrawPoster, DrawPosterPlugin, Plugins }
