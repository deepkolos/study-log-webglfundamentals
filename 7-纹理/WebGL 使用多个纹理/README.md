# WebGL 使用多个纹理

单张纹理不需要指定 u_image 对应的纹理单元，默认是 0
但是多张的时候需要指定

指定纹理单元需要使用 **gl.uniform1i** 整型，不是 gl.uniform1f
