import { helper } from '../helpers/params'
import { builder } from './builder'
import { DrawPosterPlugin, Plugins } from './plugin'
import type { DrawPosterOptions, DrawPosterResult } from './typed'

/**
 * 创建 dp 绘制（仅支持 vue3 setup 中使用）
 * @param selector
 * @param options
 */
function useDrawPoster(selector: string, options?: Partial<Omit<DrawPosterOptions, 'selector'>>): Promise<DrawPosterResult>
function useDrawPoster(options: DrawPosterOptions): Promise<DrawPosterResult>
function useDrawPoster(...args: any[]) {
  return builder(helper(...args)).ready()
}

export { useDrawPoster, DrawPosterPlugin, Plugins }
