import { DrawPosterUseOpts } from '../../utils/interface'
import { WeexBridge, enable, Image } from './gcanvas'
export * from './gcanvas'
import DrawPoster from "../../draw-poster"

DrawPoster.prototype['gcanvas'] = {
  WeexBridge,
  enable,
  Image
}

export default {
} as DrawPosterUseOpts
