# WebGL 二维 DrawImage

使用 webgl 实现 canvas 2d 的 DrawImage 接口

```js
ctx.drawImage(image, x, y)

/**
 * webgl实现
 *  上传纹理
 *  正交投影
 *  使用[1,1]正方形网格
 *    根据纹理宽高设置scale
 *    根据x, y设置translate
 * /
```
