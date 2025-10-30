import assert from 'assert'
import execa from 'execa'
import consola from 'consola'
import fs from 'fs-extra'
import { archiver, copy } from './utils'

assert(process.cwd() !== __dirname)

async function cli() {
  consola.info('build:clean')
  execa.sync('rimraf', ['dist-uniapp', 'dist-core'])
  execa.sync('rimraf packages/**/dist', { stdio: 'inherit' })
  execa.sync('rimraf packages/**/js_sdk', { stdio: 'inherit' })
  execa.sync('rimraf packages/**/js_sdk', { stdio: 'inherit' })

  fs.mkdirpSync('dist-uniapp')
  fs.mkdirpSync('dist-core')

  consola.info('build:core')
  execa.sync('pnpm -r --filter u-draw build', { stdio: 'inherit' })
  consola.info('build:copy')

  await copy('packages/uni-draw/dist', 'dist-core')
  await copy('packages/uni-draw/dist', 'packages/uni-vue2-cli/js_sdk')
  await copy('README.md', 'dist-uniapp/readme.md')

  consola.info('build:zip')
  archiver('packages/uni-vue3-vite', 'dist-uniapp/example.zip')
  archiver('packages/uni-draw/dist', 'dist-uniapp/plugin.zip')
}

if (import.meta.url === new URL(import.meta.url).href)
  cli()
