import { defineConfig } from 'tsdown'
import { dependencies } from './package.json'

export default defineConfig({
  entry: ['src/**/*.ts'],
  noExternal: Object.keys(dependencies || {}),
  minify: true,
  clean: true,
  dts: true,
})
