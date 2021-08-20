interface LifeCycle {
  (instance: UseDrawPosterResult, options?: Record<string, any>): void
}

/** 绘制画笔实例扩展配置 */
interface DrawPosterPlugin {
  /** 扩展名称 */
  name: string
  /** 创建实例前 */
  beforeMount: LifeCycle
  /** 创建实例后 */
  mounted: LifeCycle
  /** 卸载实例前 */
  beforeUnmount: LifeCycle
  /** 卸载实例后 */
  unmounted: LifeCycle
  /** 创建绘图前 */
  beforeCreate: LifeCycle
  /** 创建绘图后 */
  created: LifeCycle
}
