# WebGL 文字 - 使用纹理

如果你想让文字保持固定大小怎么办？如果你还记得透视投影 种讲到过透视矩阵就是将物体缩放 1 / -Z，以实现近大远小。所以，我们只需缩放 -Z 的期望倍数。

对于文字我们只需要将原点移到 F，还需要将单位矩形缩放到纹理的大小，最后需要乘以投影矩阵。

```js
var fViewMatrix = m4.translate(
  viewMatrix,
  translation[0] + xx * spread,
  translation[1] + yy * spread,
  translation[2],
);
fViewMatrix = m4.xRotate(fViewMatrix, rotation[0]);
fViewMatrix = m4.yRotate(fViewMatrix, rotation[1] + yy * xx * 0.2);
fViewMatrix = m4.zRotate(fViewMatrix, rotation[2] + now + (yy * 3 + xx) * 0.1);
fViewMatrix = m4.scale(fViewMatrix, scale[0], scale[1], scale[2]);
fViewMatrix = m4.translate(fViewMatrix, -50, -75, 0);

// 只使用 'F' 视图矩阵的位置
var textMatrix = m4.translate(projectionMatrix, fViewMatrix[12], fViewMatrix[13], fViewMatrix[14]);
// 缩放单位矩形到所需大小
textMatrix = m4.scale(textMatrix, textWidth, textHeight, 1);
```

```js
// 开启混合
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

result = dest * (1 - src_alpha) + src * src_alpha;

// 画布的默认颜色是黑色透明(0, 0, 0, 0);
src = [0, 0, 0, 0];
dst = [0, 1, 0, 1];
src_alpha = src[3]; // 这是 0
result = dst * (1 - src_alpha) + src * src_alpha;

// 相当于
result = dst * 1 + src * 0;

// 最后结果
result = dst;
```

混合的 src 和 dest 是怎么理解呢？

好家伙，我对 src 和 dest 的理解全错的。。。
https://blog.csdn.net/qq_36761511/article/details/113643575

src 是片元生成的颜色，dest 是缓冲区已有的颜色，把 src 混合到 dest 去

### 透明问题

我们遇到了一个使用 GPU 渲染三维时的最难解决的问题，透明出现问题。

对与透明渲染常用的解决方法是先渲染不透明的物体，然后按照 z 的顺寻绘制透明物体， 绘制时开启深度检测但是关闭深度缓冲更新。

```js
// 绘制 F 前关闭混合模式开启深度缓冲
gl.disable(gl.BLEND);
gl.depthMask(true);

// 绘制文字开启混合关闭深度缓冲写入
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.depthMask(false);
```

### 相交的问题

0. +Y 加一些距离，确保它总是在玩家头上方。
1. 往相机方向移动

'pos' 在视图空间中， 这意味着它和眼睛位置（在视图空间 0,0,0 处）有关，所以如果我们将它单位化然后乘以一个值， 将它移到眼睛方向固定距离。

### 文字边缘的问题

这个问题是 Canvas 2D API 只生成预乘阿尔法通道的值，当我们上传画布内容为 WebGL 纹理时， WebGL 视图获取没有预乘阿尔法的值，但是由于预乘阿尔法的值缺失阿尔法，所以很难完美转换成非预乘值。

解决这个问题需要告诉 WebGL 不用做反预乘。

```js
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

// 旧的方法将源和它的阿尔法通道相乘，就是 SRC_ALPHA 代表的意思。
// 但是现在我们的纹理数据已经乘了它的阿尔法值，就是预乘的意思。
// 所以就不需要让GPU再做乘法，设置为 ONE 表示乘以 1。

// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
```

### 保持固定大小

如果你还记得透视投影 种讲到过透视矩阵就是将物体缩放 1 / -Z，以实现近大远小。
所以，我们只需缩放 -Z 的期望倍数。

我们使用黑色绘制的文字，如果使用白色会更有用。那样就可以将文字颜色乘以一个颜色值然后变成任意需要的颜色。

### layer

事实上浏览器在开启 GPU 加速时使用了这个技术，它们使用你的 HTML 内容和各种样式生成纹理， 只要内容不变就只需要不停渲染纹理，即使是滚动之类..当然，如果每次都不停的更新内容就会慢一些， 因为重生成纹理并重上传它们到 GPU 是相对较慢的操作。
