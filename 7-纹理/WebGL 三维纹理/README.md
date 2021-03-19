# WebGL 三维纹理

纹理坐标[0,1], 超过部分通过 TEXTURE_WRAP_S 和 TEXTURE_WRAP_T 控制

你可以为纹理选择不同的贴图筛选条件来控制 WebGL 的插值， 一共有这 6 种模式

    NEAREST = 从最大的贴图中选择 1 个像素
    LINEAR = 从最大的贴图中选择4个像素然后混合
    NEAREST_MIPMAP_NEAREST = 选择最合适的贴图，然后从上面找到一个像素
    LINEAR_MIPMAP_NEAREST = 选择最合适的贴图，然后取出 4 个像素进行混合
    NEAREST_MIPMAP_LINEAR = 选择最合适的两个贴图，从每个上面选择 1 个像素然后混合
    LINEAR_MIPMAP_LINEAR = 选择最合适的两个贴图，从每个上选择 4 个像素然后混合

只有 2 的幂次方才能使用 gl.generateMipmap 生成 mipmap

混合会导致颜色的变化?? mipmap 是深度相关的？间接相关？

mipmap 占额外的 33.33% 空间

这种将多个图像通过一个纹理提供的方法通常被叫做纹理图集

### UVs vs. 纹理坐标

纹理坐标经常被简写为 texture coords，texcoords 或 UVs
顶点位置使用 x, y, z, w，
纹理坐标使用 s, t, u, v，
因为纹理包裹的设置被叫做 TEXTURE_WRAP_S 和 TEXTURE_WRAP_T

#### Texture Internal Formats

https://blog.csdn.net/opengl_es/article/details/18048297

> For example if you want to minimize texture storage and bandwidth requirements at the expense of visual quality, you should use GL_RGB5 or GL_RGBA4 internalformats. If you only need a single bit of alpha you can use GL_RGB5_A1 for increased color resolution. If you are willing to sacrifice some performance for improved visual quality, be sure to request GL_RGB8 or GL_RGBA8 internalformats. Otherwise you leave this decision in the hands of the person writing the driver, whose priorities may not match your own.

## 实验

目的：熟悉纹理使用的 API，纹理映射，纹理参数的设置，不同的 MIN-FILTER、MAG-FILTER 带来不同的效果影响

## 问题

three 的 double-side 是如何实现，示例中的 F 的另一面的纹理坐标和正面一样？
示例中是通过交换三角形的点的顺序实现，三角面的朝向的改变，所以纹理贴图

gl.generateMipmap 是 CPU 还是 GPU 上生成的？ (具体看平台实现，老的平台需要自己引入 CPU 处理库实现，WebGL 基于 OpenGL ES 2.0，新平台基本都是硬件实现)

https://stackoverflow.com/questions/23017317/mipmap-generation-in-opengl-is-it-hardware-accelerated

http://cncc.bingj.com/cache.aspx?q=http%3a%2f%2fwww.g-truc.net%2fpost-0256.html&d=4968761950482805&mkt=en-US&setlang=en-US&w=Ao95Vg6mm37TiFyeDyD8_AgItHLf-UO1

generateMipmap 非二次幂的是需要 frameBuffer，three 的 HDR 的 mipmap 生成就是非二次幂纹理生成 mipmap

可以通过 gl.hint 设置 gl.GENERATE_MIPMAP_HINT `gl.FASTEST` | `gl.NICEST` | `gl.DONT_CARE`
