import type { Consola } from './consola'
import type { DrawInstance } from './types'

class DrawProcess {
  /** 进程堆栈 */
  stacks: Array<() => Promise<any>> = []
  /** 是否阻止运行 */
  prevent = false

  constructor(public dp: Partial<DrawInstance>, public consola: Consola) {}

  push = (callback: Function) => {
    const length = this.stacks.length
    this.stacks.push(async () => {
      try {
        this.dp.ctx!.save()
        await callback(this.dp.ctx!, this.dp.canvas!)
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

  stop() {
    this.prevent = true
  }

  async walk() {
    await this.runs()
    this.stacks = []
  }

  async runs() {
    for (const next of this.stacks) {
      if (this.prevent)
        return
      await next()
    }
  }
}

export default DrawProcess
