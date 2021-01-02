/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-01-02 13:40:18
 * @LastEditTime: 2021-01-02 13:40:46
 * @Description: 
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import fs = require('fs');
import path = require('path');
const readmePath = path.resolve(__dirname, "../../README.md")
const outReadmePath = path.resolve(__dirname, "../../dcloud/README.md")
const readmeFile = fs.readFileSync(readmePath)
fs.writeFileSync(outReadmePath, readmeFile.toString())
console.log("说明文档写入成功")