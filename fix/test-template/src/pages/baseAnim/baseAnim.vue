<template>
  <div class="index">
    <canvas
      canvas-id="canvas"
      id="canvas"
      style="width: 400px; height: 400px"
    ></canvas>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { DrawAnimation } from 'uni-draw-poster';

export default Vue.extend({
  data: () => ({}),
  // 周期函数--监听页面初次渲染完成
  async onReady() {
    const drawAnim = await DrawAnimation.build('canvas');
    drawAnim.canvas.width = 400;
    drawAnim.canvas.height = 400;
    const draw = drawAnim.anim({
      // 注入器
      inject: () => ({
        alp: 1, // 初始透明度
        r: 0, // 初始半径
        x: Math.floor(Math.random() * drawAnim.canvas.width), // x坐标轴随机
        y: Math.floor(Math.random() * drawAnim.canvas.height), // y坐标轴随机
        red: Math.round(Math.random() * 255), // 红
        green: Math.round(Math.random() * 255), // 黄
        blue: Math.round(Math.random() * 255), // 蓝
      }),
      // 变化器
      changer: (item, index, array) => {
        // 清除器：当圆透明度为负数时 清除数组的第i位
        if (item.alp <= 0) {
          array.splice(index, 1);
        }
        item.r++;
        item.alp -= 0.01;
      },
      // 绘制器循环前初始化
      plotterInit: (ctx) => {
        ctx.clearRect(0, 0, drawAnim.canvas.width, drawAnim.canvas.height);
      },
      // 绘制器
      plotter: (ctx, item) => {
        ctx.fillStyle = `rgba(${item.red},${item.green},${item.blue},${item.alp})`;
        ctx.beginPath(); // 清空路径
        ctx.arc(item.x, item.y, item.r, 0, 2 * Math.PI); // 创建圆弧路径
        ctx.fill(); // 进行绘制
      },
    });
    draw.play();
  },
  // 周期函数--监听页面显示
  onShow() {},
  // 周期函数--监听页面隐藏
  onHide() {},
  // 周期函数--监听页面卸载
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

<style lang="scss">
page,
.index {
  height: 100%;
}
.index {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
