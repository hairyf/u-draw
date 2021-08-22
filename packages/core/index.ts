import { UNI_PLATFORM } from '@tuimao/uni-utils'
import { isObject } from 'lodash'
import { queryFields } from '../utils'
import { DebuggingLog } from './debugginglog'
import { Plugins, use } from './plugin'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UseDrawPosterResult extends DPResult {
  $options: DrawPosterOptions
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DrawPosterOptions extends DPOptions {}

function useDrawPoster(
  selector: string,
  options?: Partial<NonPick<DrawPosterOptions, 'selector'>>
): Promise<UseDrawPosterResult>
function useDrawPoster(options: DrawPosterOptions): Promise<UseDrawPosterResult>

async function useDrawPoster(...args: any[]) {
  const $options = (() => {
    const _default: DrawPosterOptions = {
      selector: '',
      componentThis: undefined,
      type: UNI_PLATFORM === 'mp-weixin' ? '2d' : 'context',
      tips: false,
      debugging: false,
      loadingText: '绘制海报中...',
      createText: '生成图片中...',
      gcanvas: false
    }
    let _overrides: DrawPosterOptions
    if (isObject(args[0])) {
      _overrides = args[0] as any
    } else if (isObject(args[1])) {
      _overrides = <any>args[0]
    } else {
      _overrides = { selector: '' }
    }
    const options = { ..._default, ..._overrides }
    options.selector = options.selector.replace('#', '')
    if (options.type === '2d') {
      options.selector = `#${options.selector}`
    }
    if (!UNI_PLATFORM) {
      console.warn(
        '注意! draw-poster未开启uni条件编译! 当环境是微信小程序将不会动态切换为type=2d模式'
      )
      console.warn(`请在vue.config.js中的'transpileDependencies'中添加 'u-draw-poster' `)
    }
    return options
  })()

  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as Record<any, any>
  const dp: Partial<UseDrawPosterResult> = { $options }
  const ps = new Plugins(dp)
  const consola = new DebuggingLog(dp, $options)
  let stacks: Stacks = []
  let isStop = false

  const build = async () => {
    ps.run('beforeMount')
    const _nodeInfo = await queryFields($options.selector, $options.componentThis, <any>{
      node: true
    })
    const canvas: Canvas = (<any>_nodeInfo)?.node || {}
    const ctx =
      canvas.getContext?.('2d') ||
      uni.createCanvasContext($options.selector, $options.componentThis)
    if (!canvas || !ctx || !$options.selector) {
      throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')
    }
    dp.canvas = canvas
    dp.ctx = ctx
    ps.run('mounted')
  }

  dp.render = async () => {
    if ($options.tips) uni.showLoading({ title: $options.loadingText })

    consola.log('绘制海报中...')
    const tips: boolean[] = []
    for (const next of stacks) {
      tips.push(await next())
    }
    stacks = []
    consola.log('绘制状况: ', undefined, tips)

    if ($options.type === 'context') {
      await new Promise((resolve) => {
        dp.ctx!.draw(true, resolve)
      })
    }

    if ($options.tips) uni.hideLoading()

    return tips
  }

  dp.create = async (_options_: CreateImagePathOptions) => {
    if (stacks.length > 0) await dp.render!()
    if (isStop) {
      isStop = false
      return Promise.reject()
    }
    if ($options.tips) uni.showLoading({ title: $options.createText })

    const options: WechatMiniprogram.CanvasToTempFilePathOption = _options_

    if ($options.type === '2d') {
      options.canvas = dp.canvas
    }
    if ($options.type === 'context') {
      options.canvasId = dp._id
    }
    return new Promise<string>((resolve, reject) => {
      options.success = (res) => {
        resolve(res.tempFilePath)
        $options.tips && uni.hideLoading()
        consola.success('绘制成功', res)
      }
      options.fail = (err) => {
        reject(err)
        $options.tips && uni.hideLoading()
        consola.success('绘制失败', err)
      }
      uni.canvasToTempFilePath(<any>options)
    })
  }

  dp.draw = async (func: Function) => {
    const length = stacks.length
    stacks.push(async () => {
      try {
        dp.ctx!.save()
        await func(dp.ctx!)
        dp.ctx!.restore()
        return true
      } catch (error) {
        if (error?.message.includes?.(`'nodeId' of undefined`))
          consola.error(`绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  dp.stop = () => {
    stacks = []
    isStop = true
  }

  Object.defineProperty(dp, '_id', { get: () => $options.selector })
  Object.defineProperty(dp, 'plugins', { get: () => ps.plugins })
  Object.defineProperty(dp, 'use', { get: () => ps.use })

  if (page[`__dp_${dp._id}`]) return page[`__dp_${dp._id}`]

  await build()

  page[`__dp_${dp._id}`] = dp

  if (!page?.onUnload?.__dp_unmount) {
    const _onUnload = page.onUnload
    page.onUnload = function () {
      ps.run('beforeUnmount')
      dp.stop!()
      _onUnload()
      ps.run('unmounted')
    }
    page.onUnload.__dp_unmount = true
  }

  return dp
}

export { useDrawPoster, use, UseDrawPosterResult, DrawPosterOptions }
