<template>
  <div class="index">
    <div>canvas2d:</div>
    <canvas
      canvas-id="canvas"
      id="canvas"
      style="width: 200px; height: 200px"
    ></canvas>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import DrawPoster from 'uni-draw-poster';

export default Vue.extend({
  // 周期函数--监听页面初次渲染完成
  async onReady() {
    const drawPoster = await DrawPoster.build('canvas');
    drawPoster.canvas.width = 200;
    drawPoster.canvas.height = 200;
    drawPoster.draw((ctx) => {
      ctx.setStrokeStyle('#00ff00');
      ctx.setLineWidth(5);
      ctx.rect(0, 0, 200, 200);
      ctx.stroke();
      ctx.setStrokeStyle('#ff0000');
      ctx.setLineWidth(2);
      ctx.moveTo(160, 100);
      ctx.arc(100, 100, 60, 0, 2 * Math.PI, true);
      ctx.moveTo(140, 100);
      ctx.arc(100, 100, 40, 0, Math.PI, false);
      ctx.moveTo(85, 80);
      ctx.arc(80, 80, 5, 0, 2 * Math.PI, true);
      ctx.moveTo(125, 80);
      ctx.arc(120, 80, 5, 0, 2 * Math.PI, true);
      ctx.stroke();
    });
    drawPoster.draw(async (ctx) => {
      const url: string = await new Promise((resolve) => {
        uni.chooseImage({
          success(res) {
            resolve(res.tempFilePaths[0]);
          },
        });
      });
      await ctx.drawRoundImage(url, 0, 0, 100, 100, 50);
    });
    console.log('绘制结果: ', await drawPoster.awaitCreate());
    console.log('创建路径: ', await drawPoster.createImagePath());
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

<style lang="scss"></style>
