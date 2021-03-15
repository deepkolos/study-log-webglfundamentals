# WebGL 渲染到纹理

帧缓冲只是一个附件集，附件是纹理或者 renderbuffers

需要特别注意的是 WebGL 只允许三种附件组合形式。 根据规范 一定能正确运行的附件组合是：

    COLOR_ATTACHMENT0 = RGBA/UNSIGNED_BYTE texture
    COLOR_ATTACHMENT0 = RGBA/UNSIGNED_BYTE texture + DEPTH_ATTACHMENT = DEPTH_COMPONENT16 renderbuffer
    COLOR_ATTACHMENT0 = RGBA/UNSIGNED_BYTE texture + DEPTH_STENCIL_ATTACHMENT = DEPTH_STENCIL renderbuffer

通过 setFrameBuffer 可以把 shader 结果输出到一张纹理而不是 canvas，其实 canvas 也是一张纹理

微信小程序可以读取绑定到 fb 的 texture，写到 fb 里面去，这是一种神奇的操作

使用流程

createFrameBuffer -> framebufferTexture2D -> bindFramebuffer -> drawArrays


