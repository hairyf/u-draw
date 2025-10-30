import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import ar from 'archiver'

const root = path.resolve(__dirname, '..')

export function archiver(src: string, disc: string) {
  src = path.join(root, src)
  disc = path.join(root, disc)
  // 创建文件输出流
  const output = fs.createWriteStream(disc)
  const archive = ar('zip', {
    // 设置压缩级别
    zlib: { level: 9 },
  })
  output.on('close', () => {
    consola.info(`总共 ${archive.pointer()} 字节`)
    consola.success('ARCHIVER 完成文件的归档，文件输出流描述符已关闭')
  })
  output.on('end', () => {
    consola.warn('数据源已耗尽')
  })
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT')
      consola.warn('STAT 故障和其他非阻塞错误')
    else
      throw err
  })
  archive.on('error', (err) => {
    throw err
  })
  // 从子目录追加文件并将其命名为“新子dir”在存档中
  archive.directory(src, false)
  // 通过管道方法将输出流存档到文件
  archive.pipe(output)
  // 完成归档
  archive.finalize()
}

export function copy(src: string, disc: string) {
  src = path.join(root, src)
  disc = path.join(root, disc)
  return fs.copy(src, disc, {
  })
}
