# WebGL 工作原理

WebGL 在 GPU 上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标， 第二部分是基于第一部分的结果绘制像素点。

`gl_Position`这个变量就是该顶点转换到裁剪空间中的坐标值，GPU 接收该值并将其保存起来。

`gl_FragColor`设置一个颜色值，实现自定义像素颜色。

画布大小(400x300)
三个顶点      平移200，150后    转换成裁剪坐标
  0   ,-100   200,50            200/400 * 2 - 1 = 0    ,  -50/300 * 2 + 1 = 0.666
  150 ,125    350,275           350/400 * 2 - 1 = 0.750, -275/300 * 2 + 1 =-0.833
  -175,100    25 ,250            25/400 * 2 - 1 =-0.875, -250/300 * 2 + 1 =-0.666

颜色空间
  (0 + 1) * 0.5 = -0.5, (0.666 + 1) * 0.5 = 0.833
  以此类推 (x + 1) * 0.5, (y + 1) * 0.5

## 关于buffer和attribute的代码是干什么的？

```js
// 设置Attribute三部曲

// 这个命令是告诉WebGL我们想从缓冲中提供数据。
gl.enableVertexAttribArray(colorLocation);

// 这个命令是将缓冲绑定到 ARRAY_BUFFER 绑定点，它是WebGL内部的一个全局变量。
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

// 这个命令告诉WebGL从 ARRAY_BUFFER 绑定点当前绑定的缓冲获取数据。 每个顶点有几个单位的数据(1 - 4)，单位数据类型是什么(BYTE, FLOAT, INT, UNSIGNED_SHORT, 等等...)， stride 是从一个数据到下一个数据要跳过多少位，最后是数据在缓冲的什么位置。
// 单位个数永远是 1 到 4 之间。
gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)
```