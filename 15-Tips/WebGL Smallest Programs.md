# WebGL Smallest Programs

文章两个目的：

0. 展示最小的 WebGL 程序（用于测试，编写 StackOverflow 的 MCVE，缩小 bug 的范围）
1. 学着跳出框子思考？？宏观思考？？

最小的 WebGL 程序

```js
const gl = document.querySelector('canvas').getContext('webgl');
gl.clearColor(1, 0, 0, 1); // 红色
gl.clear(gl.COLOR_BUFFER_BIT);
```

矩形可以通过 gl.scissor、clearColor、clear 实现

```js
function drawRect(x, y, width, height, color) {
  gl.scissor(x, y, width, height);
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
```

绘制一个点

```glsl
// 顶点着色器
void main() {
  gl_Position = vec4(0, 0, 0, 1); // 中心
  gl_PointSize = 120.0;
}
```

```glsl
// 片元着色器
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 0, 1); // 红色
}
```

```js
// 设置 GLSL 程序
const program = webglUtils.createProgramFromSources(gl, [vs, fs]);

gl.useProgram(program);

const offset = 0;
const count = 1;
gl.drawArrays(gl.POINTS, offset, count);
```

多个点就是 for 循环设置 uniform
