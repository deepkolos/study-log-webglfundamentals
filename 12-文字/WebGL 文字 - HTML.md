# WebGL 文字 - HTML

通过那篇文章我们知道了如何使用矩阵，如何将它们乘起来，如何使用一个透视投影矩阵将坐标转换到裁剪空间。
我们也可以在 JavaScript 中做相同的运算，然后将裁剪空间坐标 (-1 到 +1) 转换到像素坐标， 使用这个像素坐标设置 div 的位置。

使用矩阵计算出相应点在裁剪空间的位置，然后再转化为 dom 下的布局坐标系即可

那么三维下动画但是二维展示也是可以使用投影的方式去计算出二维结果

```js
// compute a clipspace position
// using the matrix we computed for the F
var clipspace = m4.transformVector(matrix, [100, 0, 0, 1]);

// divide X and Y by W just like the GPU does.
clipspace[0] /= clipspace[3];
clipspace[1] /= clipspace[3];

// convert from clipspace to pixels
var pixelX = (clipspace[0] * 0.5 + 0.5) * gl.canvas.width;
var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;

// position the div
div.style.left = Math.floor(pixelX) + 'px';
div.style.top = Math.floor(pixelY) + 'px';
```
