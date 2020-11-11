<template>
  <div class="index">
    <div
      v-for="(item, index) in naviList"
      :key="index"
      @click="onHandlePathJump(item.path)"
    >
      {{ item.text }}
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    naviList: [
      { text: '基本绘制', path: 'base' },
      { text: '换行字体绘制', path: 'warpText' },
      { text: '图片绘制', path: 'image' },
			{ text: '完整海报绘制', path: 'complete' },
			{ text: '重复绘制', path: 'repeat' },
			{ text: '扩展程序', path: 'extend' },
			{ text: 'use方式引入', path: 'use' },
    ],
  }),
  methods: {
    // 处理页面跳转
    onHandlePathJump(path) {
			uni.navigateTo({
				url:`/pages/${path}/${path}`
			})
    },
  },
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
