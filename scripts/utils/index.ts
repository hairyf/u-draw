import fs = require('fs');
import archiver = require('archiver');
export const logger = (output: fs.WriteStream, archive: archiver.Archiver) => {
  // 文件输出流结束
  output.on('close', () => {
    console.log(`总共 ${archive.pointer()} 字节`)
    console.log('archiver完成文件的归档，文件输出流描述符已关闭')
  })

  // 数据源是否耗尽
  output.on('end', () => {
    console.log('数据源已耗尽')
  })
  // 存档警告
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('stat故障和其他非阻塞错误')
    } else {
      throw err
    }
  })

  // 存档出错
  archive.on('error', (err) => {
    throw err
  })
}