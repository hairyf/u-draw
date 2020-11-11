import DrawPoster from "./draw-poster"
import DrawAnimation from "./draw-animation"
import { DrawPosterBuildOpts } from "./utils/interface"
import * as dfucs from "./extends/draw-function"

DrawPoster.useCtx(dfucs.drawImage)
DrawPoster.useCtx(dfucs.fillWarpText)
DrawPoster.useCtx(dfucs.roundRect)
DrawPoster.useCtx(dfucs.fillRoundRect)
DrawPoster.useCtx(dfucs.strokeRoundRect)
DrawPoster.useCtx(dfucs.drawRoundImage)

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
  DrawAnimation,
  useDrawPoster,
  useDrawPosters
}

export default DrawPoster