# WebGL 文字 - 二维 Canvas

```js
// pixelX, pixelY js 计算出裁剪空间转换到2d canvas坐标系的值
ctx.fillText(someMsg, pixelX, pixelY);

// 绘制箭头和文字

// 保存画布设置
ctx.save();

// 将画布原点移动到 F 的正面右上角
ctx.translate(pixelX, pixelY);

// 绘制箭头
ctx.beginPath();
ctx.moveTo(10, 5);
ctx.lineTo(0, 0);
ctx.lineTo(5, 10);
ctx.moveTo(0, 0);
ctx.lineTo(15, 15);
ctx.stroke();

// 绘制文字
ctx.fillText(someMessage, 20, 20);

// 还原画布设置
ctx.restore();
```
