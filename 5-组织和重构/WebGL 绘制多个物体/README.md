# WebGL 绘制多个物体

清楚这个以后，WebGL 应用基本都遵循以下结构

初始化阶段

    创建所有着色器和程序并寻找参数位置
    创建缓冲并上传顶点数据
    创建纹理并上传纹理数据

渲染阶段

    清空并设置视图和其他全局状态（开启深度检测，剔除等等）
    对于想要绘制的每个物体
        调用 gl.useProgram 使用需要的程序
        设置物体的属性变量
            为每个属性调用 gl.bindBuffer, gl.vertexAttribPointer, gl.enableVertexAttribArray
        设置物体的全局变量
            为每个全局变量调用 gl.uniformXXX
            调用 gl.activeTexture 和 gl.bindTexture 设置纹理到纹理单元
        调用 gl.drawArrays 或 gl.drawElements

基本上就是这些，详细情况取决于你的实际目的和代码组织情况。

根据对渲染阶段抽象整合，然后配置化

```js
// ------ 绘制几何体 --------

objectsToDraw.forEach(function (object) {
  var programInfo = object.programInfo;
  var bufferInfo = object.bufferInfo;

  gl.useProgram(programInfo.program);

  // 设置所需的属性
  webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  // 设置全局变量
  webglUtils.setUniforms(programInfo, object.uniforms);

  // 绘制
  gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
});
```

你创建几何体时只需要告诉 three.js 你想如何渲染， 它就会在运行时为你创建你需要的着色器。