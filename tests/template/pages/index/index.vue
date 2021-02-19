<!--
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-11-28 12:04:04
 * @LastEditTime: 2021-02-19 10:30:47
 * @Description: 测试案例入口文件
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <div class="index">
    <div
      v-for="(item, index) in naviList"
      :key="index"
      @click="onHandlePathJump(item.path)"
    >{{ item.text }}</div>
  </div>
</template>
<script>
export default {
  data: () => ({
    naviList: [
      { text: '基本绘制', path: 'base' },
      { text: '换行字体绘制', path: 'warpText' },
      { text: '图片绘制', path: 'image' },
      { text: '图片Fit绘制', path: 'imageFit' },
      { text: '完整海报绘制', path: 'complete' },
      { text: '重复绘制', path: 'repeat' },
      { text: '扩展程序', path: 'extend' },
      { text: '二维码生成', path: 'qrcode' },
      { text: 'use|component方式引入', path: 'useComponent' },
      { text: '表单绘制插件', path: 'fromList' },
    ],
  }),
  methods: {
    // 处理页面跳转
    onHandlePathJump(path) {
      uni.navigateTo({ url: `/pages/${path}/${path}` })
    },
  }
};
</script>

<style lang="scss">
page,
.index {
  height: 100%;
}
.index {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  div {
    font-size: 50rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
}
</style>
