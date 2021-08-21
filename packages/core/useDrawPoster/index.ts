import {
  createDrawOptions,
  runExecutes,
  createDebuggingLog,
  queryFields,
  usePluginOptions
} from '../utils'

const globalPlugins: DrawPosterPlugin[] = []

/**
 * 全局插件引入
 * @param args
 */
export const use: DrawPosterUse = (...args: any[]) => usePluginOptions(globalPlugins, ...args)

export const useDrawPoster: UseDrawPoster<Promise<UseDrawPosterResult>> = async (
  ...args: any[]
) => {
  // #region 参数处理
  const _options = createDrawOptions(<any>args[0], <any>args[1])
  const { selector, componentThis, tips, debugging, loadingText, createText, type } = _options
  const $plugins: DrawPosterPlugin[] = []
  const result: Partial<UseDrawPosterResult> = {
    _id: selector,
    get plugins() {
      return [...globalPlugins, ...$plugins]
    }
  }
  // #endregion

  runPlugin('beforeMount')

  // #region 内部使用
  const _nodeInfo = await queryFields(selector, componentThis, <any>{ node: true })
  const _executes: Executes = []
  const debuggingLog = createDebuggingLog(selector, debugging)
  function runPlugin(lifeCycleName: keyof DrawPosterLifeCycles) {
    const plugins = <DrawPosterLifeCycles[]>result.plugins
    plugins.forEach((lifeCycle) => {
      lifeCycle[lifeCycleName]?.(<any>result)
    })
  }
  //#endregion

  // #region 初始化查询页面绘制实例, 实现单例模式
  // #endregion

  // #region 初始化执行
  const canvas: Canvas = (<any>_nodeInfo)?.node || {}
  const ctx = canvas.getContext?.('2d') || uni.createCanvasContext(selector, componentThis)
  if (!canvas || !ctx || !selector) {
    throw new Error('DrawPoster Error: useDrawPoster to build drawPoster instance')
  }
  result['createImage'] = createImage
  result['use'] = use
  result['canvas'] = canvas
  // #endregion

  runPlugin('mounted')

  // #region 实例方法
  async function render() {
    debuggingLog('绘制海报中...')
    if (tips) uni.showLoading({ title: loadingText })
    const messages = await runExecutes(_executes)
    debuggingLog('绘制状况: ', messages)

    /** is type: 2d */
    if (tips && type === '2d') {
      uni.hideLoading()
      return messages
    }

    /** is type: context */
    if (tips && type === 'context') {
      await new Promise((resolve) => ctx.draw(true, resolve))
      uni.hideLoading()
      return messages
    }
  }
  async function createImage(options: CreateImagePathOptions) {
    if (_executes.length > 0) await render()
    if (tips) uni.showLoading({ title: createText })
    const mergeOptions: WechatMiniprogram.CanvasToTempFilePathOption = options
    if (type === '2d') {
      mergeOptions.canvas = canvas
    }
    if (type === 'context') {
      mergeOptions.canvasId = selector
    }
    return new Promise<string>((resolve, reject) => {
      mergeOptions.success = (res) => {
        resolve(res.tempFilePath)
        tips && uni.hideLoading()
        debuggingLog('绘制成功 🎉', res, '#19be6b')
      }
      mergeOptions.fail = (err) => {
        reject(err)
        tips && uni.hideLoading()
        debuggingLog('绘制失败 🌟', err, '#fa3534')
      }
      uni.canvasToTempFilePath(<any>mergeOptions)
    })
  }
  function use(...args: any[]) {
    usePluginOptions($plugins, ...args)
    if (result['canvas']) runPlugin('mounted')
  }
  // #endregion

  return result as UseDrawPosterResult
}

useDrawPoster('xxx', {})
