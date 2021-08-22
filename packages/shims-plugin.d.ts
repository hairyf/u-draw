interface DrawPosterLifeCycle<I = import('core').UseDrawPosterResult, O = Record<string, any>> {
  (instance: I, options?: O): void
}

interface DrawPosterLifeCycles {
  /** 创建实例前 */
  beforeMount?: DrawPosterLifeCycle<Partial<import('core').UseDrawPosterResult>>
  /** 创建实例后 */
  mounted?: DrawPosterLifeCycle
  /** 卸载实例前 */
  beforeUnmount?: DrawPosterLifeCycle
  /** 卸载实例后 */
  unmounted?: DrawPosterLifeCycle
  /** 创建绘图前 */
  beforeCreate?: DrawPosterLifeCycle
  /** 创建绘图后 */
  created?: DrawPosterLifeCycle
}

/** 绘制画笔实例扩展配置 */
interface DrawPosterPlugin extends DrawPosterLifeCycles {
  /** 扩展名称 */
  name: string
}

interface DrawPosterUse {
  (name: string, lifeCycle: DrawPosterLifeCycle): void
  (name: string, options: NonPick<DrawPosterPlugin, 'name'>): void
  (options: DrawPosterPlugin): void
}
