import { onReady } from '../helpers/internal'
import { helper } from '../helpers/params'
import { builder } from './builder'
import { Plugin, Plugins } from './plugin'
import type { DrawPosterOptions, DrawPosterInstance } from './typed'

/**
 * 创建 dp 绘制（仅支持 vue3 setup 中使用）
 * @param selector
 * @param options
 */
function useDrawPoster(selector: string, options?: Partial<Omit<DrawPosterOptions, 'selector'>>): DrawPosterInstance
function useDrawPoster(options: DrawPosterOptions): DrawPosterInstance
function useDrawPoster(...args: any[]) {
  const dp = builder(helper(...args), onReady)
  dp.mount()
  return dp
}

function createDrawPoster(selector: string, options?: Partial<Omit<DrawPosterOptions, 'selector'>>): DrawPosterInstance
function createDrawPoster(options: DrawPosterOptions): DrawPosterInstance
function createDrawPoster(...args: any[]) {
  return builder(helper(...args))
}

export { useDrawPoster, createDrawPoster, Plugin, Plugins }
