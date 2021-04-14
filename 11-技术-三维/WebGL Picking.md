# WebGL Picking

That means any concept of "picking" something has to come from your code.

### Int 转 RGBA[0, 1]

```js
{
  u_id: [
    ((id >> 0) & 0xff) / 0xff,
    ((id >> 8) & 0xff) / 0xff,
    ((id >> 16) & 0xff) / 0xff,
    ((id >> 24) & 0xff) / 0xff,
  ];
}
```

### RGBA[0, 255] 转 Int

```js
const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
```

### 时序脉冲

```js
(8 * 0) & 0x8; // 0
(8 * 1) & 0x8; // 8
(8 * 2) & 0x8; // 0
(8 * 3) & 0x8; // 8
```

优化，仅仅绘制鼠标下的颜色，只需要 1x1 大小的额外纹理，还是两个 pass

One optimization we can make, we're rendering the ids to a texture that's the same size as the canvas. This is conceptually the easiest thing to do.

But, we could instead just render the pixel under the mouse. To do this we use a frustum who's math will cover just the space for that 1 pixel.

```js
// compute the rectangle the near plane of our frustum covers
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const top = Math.tan(fieldOfViewRadians * 0.5) * near;
const bottom = -top;
const left = aspect * bottom;
const right = aspect * top;
const width = Math.abs(right - left);
const height = Math.abs(top - bottom);

// compute the portion of the near plane covers the 1 pixel
// under the mouse. 鼠标相对于canvas.width/height的坐标
const pixelX = (mouseX * gl.canvas.width) / gl.canvas.clientWidth;
const pixelY = gl.canvas.height - (mouseY * gl.canvas.height) / gl.canvas.clientHeight - 1;

// 这里的width/height指向真实投影矩阵的近平面宽高
const subLeft = left + (pixelX * width) / gl.canvas.width;
const subBottom = bottom + (pixelY * height) / gl.canvas.height;
const subWidth = 1 / gl.canvas.width;
const subHeight = 1 / gl.canvas.height;

// make a frustum for that 1 pixel
const projectionMatrix = m4.frustum(
  subLeft,
  subLeft + subWidth,
  subBottom,
  subBottom + subHeight,
  near,
  far,
);
```

从 fov 和 aspect 可以计算出 top,left,right,bottom 就是这近平面的矩阵加[0,0]原点和近远平面控制视锥体的形态

所以 fov 的变大变小，也就是实现近平面矩形放大缩小

