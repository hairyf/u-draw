import { DrawPosterPlugin } from '../../core/plugin'
import { enable, Image, WeexBridge } from './gcanvas'

const plugin: DrawPosterPlugin = {
  name: '__dp-gcanvas__',
  beforeMount: (dp) => {
    dp.$gcanvas = { enable, Image, WeexBridge }
    const canvas = dp.$gcanvas.enable(
      dp.$options?.componentThis?.$refs?.[dp.id!.replace('#', '')],
      { bridge: WeexBridge }
    )
    const ctx = canvas.getContext?.(dp.$options?.type)
    dp.$drawPrototype = { canvas, ctx }
  }
}

export default plugin
