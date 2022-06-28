import { Plugins } from './core'
import * as plugins from './plugins/preset'

Plugins.use(plugins.drawImage())
Plugins.use(plugins.drawImageFit())
Plugins.use(plugins.drawRoundImage())
Plugins.use(plugins.fillRoundRect())
Plugins.use(plugins.roundRect())
Plugins.use(plugins.strokeRoundRect())
Plugins.use(plugins.fillWarpText())

export * from './core'
