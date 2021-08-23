import { DrawPosterPlugin } from '../../core/plugin'
declare module '../../core' {
  interface DrawPosterResult {
    createLayer: (afferOpts: CreateLayerOpts, rowList: DrawRowOpt[]) => number
  }
}
export interface CreateLayerOpts {
  background?: string
  self?: boolean
  line?: boolean
  lineHeight?: number
}
export interface DrawRowOpt {
  text?: string
  font?: string
  color?: string
  center?: boolean
  width?: number
}

const plugin: DrawPosterPlugin = {
  name: '__name__',
  mounted: () => {}
}

export default plugin
