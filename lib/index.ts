/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-10-22 22:48:35
 * @LastEditTime: 2021-01-02 13:21:09
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import DrawPoster from "./draw-poster"
import { DrawPosterBuildOpts } from "./utils/interface"
import * as dfucs from "./extends/draw-function/index"

DrawPoster.useCtx(dfucs.drawImage)
DrawPoster.useCtx(dfucs.fillWarpText)
DrawPoster.useCtx(dfucs.roundRect)
DrawPoster.useCtx(dfucs.fillRoundRect)
DrawPoster.useCtx(dfucs.strokeRoundRect)
DrawPoster.useCtx(dfucs.drawRoundImage)
DrawPoster.useCtx(dfucs.drawImageFit)

const useDrawPoster = async (options: string | DrawPosterBuildOpts) => {
  const dp = await DrawPoster.build(options)
  return dp
}

const useDrawPosters = async (optionsAll: (string | DrawPosterBuildOpts)[]) => {
  const dps = await DrawPoster.buildAll(optionsAll)
  return dps
}

export {
  DrawPoster,
  useDrawPoster,
  useDrawPosters
}

export default DrawPoster