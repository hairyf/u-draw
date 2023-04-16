import type { Canvas } from '../@types'
import { getCurrentInstance, setCurrentInstance } from '../helpers/internal'
import { createAnimationFrame, promisify, queryFields } from '../utils'
import { Consola } from './consola'
import { Plugins } from './plugin'
import DrawProcess from './process'
import type { DrawInstance, DrawOptions } from './types'

export function createContext(options: DrawOptions, wait?: () => Promise<void>) {
  const instance = getCurrentInstance(options.selector)
  if (instance)
    return instance

  const context: DrawInstance = { $options: options } as any

  const ps = new Plugins(context)
  const consola = new Consola(context)
  const pcs = new DrawProcess(context, consola)

  Object.assign(context, {
    id: options.selector,
    plugins: ps.plugins,
    renderAnimation,
    mount,
  })

  async function build() {
    const { $instance, $options } = context
    const { selector = '', componentThis } = $options || {}

    if ($instance)
      return await $instance

    const nodeInfo = await queryFields(selector, componentThis, { node: true, size: true } as any)
    const { width, height } = nodeInfo

    const canvas: Canvas = (nodeInfo as any)?.node || {}
    const ctx = canvas.getContext?.('2d') || uni.createCanvasContext(selector, componentThis)

    if (width && height) {
      canvas.width = width
      canvas.height = height
    }

    return { canvas, ctx }
  }

  let locked = false
  async function mount() {
    if (locked)
      return ready()
    locked = true

    ps.run('beforeMount')

    Object.assign(context, { render, create, ready })
    Object.assign(context, { draw: pcs.push, stop: pcs.stop, use: ps.use })

    await wait?.()

    const { canvas, ctx } = await build()

    Object.assign(context, { canvas, ctx })

    ps.run('mounted')

    resolved(context)

    return context
  }

  async function ready() {
    await promised
    return context
  }

  async function render() {
    await ready()

    await pcs.walk()

    if (options.type === 'context')
      await new Promise(resolve => context.ctx!.draw(true, resolve))
  }

  function renderAnimation(renderer: Function) {
    const {
      cancelAnimationFrame,
      requestAnimationFrame,
    } = createAnimationFrame(context.canvas)
    const timer = requestAnimationFrame(async () => {
      await ready()
      await renderer()
      await pcs.runs()
    })
    return () => cancelAnimationFrame(timer)
  }

  async function create(overrides: any = {}) {
    if (pcs.stacks.length > 0)
      await context.render!()

    const config: UniApp.CanvasToTempFilePathOptions = overrides
    if (options.type === '2d')
      config.canvas = context.canvas
    if (options.type === 'context')
      config.canvasId = context.id

    const { tempFilePath } = await promisify(uni.canvasToTempFilePath)(config)
    return tempFilePath
  }

  let resolved: Function
  let promised: Promise<void> = new Promise(resolve => resolved = resolve)

  setCurrentInstance(context, ps)

  return context
}
