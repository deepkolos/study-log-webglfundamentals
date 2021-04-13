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
