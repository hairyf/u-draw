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
<script lang="ts">
import Vue from 'vue';
import { navigateTo } from '../../utils';
export default Vue.extend({
  data: () => ({
    naviList: [
      { text: '基本绘制测试', path: 'baseDp' },
      { text: '换行字体绘制测试', path: 'warpTextDp' },
      { text: '图片绘制测试', path: 'imageDp' },
      { text: '基本动画测试', path: 'baseAnim' },
    ],
  }),
  methods: {
    // 处理页面跳转
    onHandlePathJump(path: string) {
      navigateTo(`/pages/${path}/${path}`);
    },
  },
});
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
