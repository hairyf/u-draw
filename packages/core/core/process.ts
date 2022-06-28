import type { Consola } from './consola'
import type { DrawPosterResult } from './typed'

class DrawProcess {
  /** 进程堆栈 */
  stacks: Array<() => Promise<any>> = []
  /** 是否阻止运行 */
  prevent = false

  constructor(public dp: Partial<DrawPosterResult>, public consola: Consola) {}

  push = (callback: Function) => {
    const length = this.stacks.length
    this.stacks.push(async () => {
      try {
        this.dp.ctx!.save()
        await callback(this.dp.ctx!)
        this.dp.ctx!.restore()
        return true
      }
      catch (error: any) {
        if (!error?.message?.includes?.('\'nodeId\' of undefined'))
          this.consola.error(`绘画栈(${length})，绘制错误：`, error)
        return false
      }
    })
  }

  stop = () => {
    this.prevent = true
  }

  walk = async () => {
    const results: any[] = []
    for (const next of this.stacks) {
      if (this.prevent)
        return results
      results.push(await next())
    }
    this.stacks = []
    return results
  }
}

export default DrawProcess
