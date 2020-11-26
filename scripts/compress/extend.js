const fs = require('fs');
const path = require("path");
const archiver = require('archiver');
const { logger } = require('../utils')
const uDrawPosterPath = path.resolve(__dirname, "../../dist/u-draw-poster")
const dcloudExtendPath = path.resolve(__dirname, "../../dcloud/u-draw-poster.zip")
// 创建文件输出流
const output = fs.createWriteStream(dcloudExtendPath)
const archive = archiver("zip", {
  // 设置压缩级别
  zlib: { level: 9 }
})
// 绑定事件设置打印报告
logger(output, archive)
// 从子目录追加文件并将其命名为“新子dir”在存档中
archive.directory(uDrawPosterPath, false)
// 通过管道方法将输出流存档到文件
archive.pipe(output)
// 完成归档
archive.finalize()