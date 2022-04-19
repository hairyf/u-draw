import { getCurrentDrawPoster, onReady, setCurrentDrawPoster } from '../helpers/internal'
import { helperDrawPosterParams } from '../helpers/params'
import { builder } from './builder'
import { Plugins, DrawPosterPlugin } from './plugin'
import { DrawPosterOptions, DrawPosterResult } from './typed'

/**
 * 创建 dp 绘制（仅支持在 onReady 就绪后使用）
 * @param selector
 * @param options
 */
async function createDrawPoster(selector: string, options?: Partial<Omit<DrawPosterOptions, 'selector'>>): Promise<DrawPosterResult>
async function createDrawPoster(options: DrawPosterOptions): Promise<DrawPosterResult>
async function createDrawPoster(...args: any[]) {
  const $options = helperDrawPosterParams(...args)

  // 假如当前页面已存在实例, 则直接返回
  const currentDrawPoster = getCurrentDrawPoster($options.selector)
  if (currentDrawPoster) return currentDrawPoster

  // 创建实例并等待挂载完成
  const { ps, dp } = builder($options)

  await dp.mount()

  // 保存实例, 实现单页面同个实例
  setCurrentDrawPoster(dp, ps)

  return dp
}

/**
 * 创建 dp 绘制（仅支持 vue3 setup 中使用）
 * @param selector
 * @param options
 */
function useDrawPoster(selector: string, options?: Partial<Omit<DrawPosterOptions, 'selector'>>): DrawPosterResult
function useDrawPoster(options: DrawPosterOptions): DrawPosterResult
function useDrawPoster(...args: any[]) {
  const $options = helperDrawPosterParams(...args)

  // 假如当前页面已存在实例, 则直接返回
  const currentDrawPoster = getCurrentDrawPoster($options.selector)
  if (currentDrawPoster) return currentDrawPoster

  // 创建实例
  const { ps, dp } = builder($options, onReady)

  // 保存实例, 实现单页面同个实例
  setCurrentDrawPoster(dp, ps)

  return dp
}

export { useDrawPoster, DrawPosterPlugin, Plugins, createDrawPoster }
