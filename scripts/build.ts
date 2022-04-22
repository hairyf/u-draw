import assert from 'assert'
import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import execa from 'execa'

const rootDir = path.resolve(__dirname, '..')

const FILES_COPY_ROOT = ['LICENSE']
const FILES_COPY_LOCAL = ['package.json', 'README.md']

assert(process.cwd() !== __dirname)

export const buildMetaFiles = async () => {
  const packageDist = path.resolve(rootDir, 'dist')
  // 向打包后的 dist 添加包的源信息
  for (const file of FILES_COPY_ROOT)
    await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))
  for (const file of FILES_COPY_LOCAL)
    await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))
}

export const build = async () => {
  consola.info('Clean up')
  execa.sync('yarn', ['clean'], { stdio: 'inherit', cwd: rootDir })

  fs.mkdirpSync('dist')
  fs.mkdirpSync('dcloud')

  consola.info('Tsc build')
  execa.sync('tsc', { stdio: 'inherit', cwd: rootDir })

  consola.info('Generate Metas')
  await buildMetaFiles()

  consola.info('Copy build')
  execa.sync('yarn', ['copy'], { stdio: 'inherit' })

  consola.info('Compress package')
  execa.sync('yarn', ['compress'], { stdio: 'inherit' })
}

async function cli() {
  try {
    await build()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// 这里用了个小技巧，判断当前执行环境是否是直接执行
if (require.main === module) cli()
