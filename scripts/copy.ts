import fs from 'fs-extra'

const FILES_COPY_ALL = [
  // COPY_README
  ['README.md', 'dcloud/README.md'],
  // COPY_DIST
  ['dist', '.test/vue3-vite-ts/node_modules/u-draw-poster'],
  ['dist', '.test/vue2-cli-js/js_sdk/u-draw-poster']
]

async function cli() {
  for (const [source, target] of FILES_COPY_ALL) {
    await fs.copy(source, target)
  }
}

cli()
