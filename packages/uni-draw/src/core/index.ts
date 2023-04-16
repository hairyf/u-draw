import { onReady } from '../helpers/internal'
import { helper } from '../helpers/params'
import { createContext } from './context'
import type { Plugin } from './plugin'
import { Plugins } from './plugin'
import type { DrawInstance, DrawOptions } from './types'

/**
 * 创建 dp 绘制（仅支持 vue3 setup 中使用）
 * @param selector
 * @param options
 */
function useDraw(selector: string, options?: Partial<Omit<DrawOptions, 'selector'>>): DrawInstance
function useDraw(options: DrawOptions): DrawInstance
function useDraw(...args: any[]) {
  const dp = createContext(helper(...args), onReady)
  dp.mount()
  return dp
}

function createDraw(selector: string, options?: Partial<Omit<DrawOptions, 'selector'>>): DrawInstance
function createDraw(options: DrawOptions): DrawInstance
function createDraw(...args: any[]) {
  const options = { immediate: true, ...helper(...args) }
  const dp = createContext(options)
  if (options.immediate)
    dp.mount()
  return dp
}

export { useDraw, createDraw, Plugins }

export type { Plugin, DrawOptions, DrawInstance }
