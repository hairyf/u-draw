import {} from './plugins/dp-table'
import { useDrawPoster } from './core'
useDrawPoster({
  selector: ''
}).then((v) => v.createLayer)
