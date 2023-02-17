## canvas 当做为生成工具

canvas在海报生成中请当做一个生成工具来看待，它的作用仅是绘制出海报。应把生成得到的资源保存并使用，显示用image图片组件，原因是方便操作，例如调整大小，或是H5端长按保存或识别，所以canvas应将它放在看不见的地方。不能用display:none;overflow:hidden;隐藏，否则生成空白。这里推荐canvas的隐藏样式代码，该说明为 [uQRCode](https://github.com/Sansnn/uQRCode) 提供的说明，同样`u-draw-poster`也适用
~~~css
.canvas-hide {
	/* 1 */
	position: fixed;
	right: 100vw;
	bottom: 100vh;
	/* 2 */
	z-index: -9999;
	/* 3 */
	opacity: 0;
}
~~~

## 支持重复调用

需要注意的是，创建绘制工具支持重复调用，当构建第一次的绘制工具后，重复构建将自动获取第一次的实例。不需要存入`this`中，其实`vue3`也不提倡使用`this`这个黑盒，甚至抛弃了使用`this`。
~~~js
export default {
  data: () => ({}),
  // 不存入实例(推荐)
  method: {
    draw() {
      const dp = await useDrawPoster('canvas')
    // ...
    }
  },
  async onReady() {
    this.draw()
    // 重复调用....
    this.draw()
  }
}
~~~
~~~js
export default {
  // 存入实例(不推荐)
  data: () => ({
    dp: null
  }),
  method: {
    draw() {
      if (!this.dp) {
        const dp = await useDrawPoster('canvas')
        this.dp = dp
      }
    // ...
    }
  },
  async onReady() {
    this.draw()
    // 重复调用....
    this.draw()
  }
}
~~~
