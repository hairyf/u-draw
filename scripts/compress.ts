import fs from 'fs-extra'
import consola from 'consola'
import archiver from 'archiver'

const FILES_ARCHIVE_ALL = [
  // ARCHIVE_TEMPLATE
  ['.test/vue2-cli-js', 'dcloud/Example.zip'],
  // ARCHIVE_DIST
  ['dist', 'dcloud/Plugin.zip']
]


async function cli() {
  for (const [source, target] of FILES_ARCHIVE_ALL) {
    // 创建文件输出流
    const output = fs.createWriteStream(target)
    const archive = archiver('zip', {
      // 设置压缩级别
      zlib: { level: 9 }
    })
    output.on('close', () => {
      consola.info(`总共 ${archive.pointer()} 字节`)
      consola.success('archiver完成文件的归档，文件输出流描述符已关闭')
    })
    output.on('end', () => {
      consola.warn('数据源已耗尽')
    })
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        consola.warn('stat故障和其他非阻塞错误')
      } else {
        throw err
      }
    })
    archive.on('error', (err) => {
      throw err
    })
    // 从子目录追加文件并将其命名为“新子dir”在存档中
    archive.directory(source, false)
    // 通过管道方法将输出流存档到文件
    archive.pipe(output)
    // 完成归档
    archive.finalize()
  }
}

cli()
