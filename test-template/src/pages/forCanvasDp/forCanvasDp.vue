<template>
  <div class="for-canvas-dp">
    <div class="canvas-item" v-for="(id, index) in list" :key="index">
      <!-- #ifdef MP-WEIXIN -->
      <canvas :id="id" type="2d" style="width: 100px; height: 100px" />
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <canvas :canvas-id="id" :id="id" style="width: 100px; height: 100px" />
      <!-- #endif -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DrawPoster from 'uni-draw-poster';
export default Vue.extend({
  components: {},
  data: () => ({
    list: ['c_1', 'c_2', 'c_3'],
  }),
  methods: {},
  computed: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.$nextTick(() => {
      this.list.forEach(async (id, index) => {
        const dp = await DrawPoster.build(id);
        dp.canvas.width = 100;
        dp.canvas.height = 100;
        // 创建一个绘制任务
        dp.draw(async (ctx) => {
          const url =
            'https://qie-online-sale-qiniu.wsandos.com/uploads/20201027/FuZZKEsjnF1bTobVc4ujlKhuCUKP.png';
          await ctx.drawImage(url, 0, 0, dp.canvas.width, dp.canvas.height);
        });
        // 执行绘制任务
        console.log('绘制情况: ', await dp.awaitCreate());
      });
    });
  },
  // 页面周期函数--监听页面显示
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {},
  // 页面处理函数--监听用户上拉触底
  onReachBottom() {},
  // 页面处理函数--监听页面滚动
  /* onPageScroll(event) {}, */
  // 页面处理函数--用户点击右上角分享
  /* onShareAppMessage(options) {}, */
});
</script>

<style lang="scss"></style>
