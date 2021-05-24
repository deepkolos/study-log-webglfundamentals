# WebGL GPGPU

纹理不是图片
The basic realization to understanding GPGPU in WebGL is that a texture is not an image, it's a 2D array of values.

readPixels 仅仅支持 RGBA/UNSIGNED_BYTE，所以 three 的 renderTarget 格式也只能是 RGBA/UNSIGNED_BYTE
In this particular case this affects how we read the output. We ask for RGBA/UNSIGNED_BYTE from readPixels because other format/type combinations are not supported. So we have to look at every 4th value for our answer.

shader 是遍历的是输出图像像素
Shaders are destination based, not source based.

In WebGL textures are 2D arrays.

读取单个像素公式

    // (x + .5) / width
    vec2 texcoord = (vec2(x, y) + 0.5) / dimensionsOfTexture;

计算点到线段的最短距离
https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/6853926#6853926

点乘

    dot(a,b) = |a||b|cosA

```glsl
  if (len != 0.0) {
    param = clamp(d / (len * len), 0.0, 1.0);
  }
  vec3 r = b + bc * param;

  // 化简之后
  // 为什么需要加clamp呢？可能cosA可能是负数？希望点是两点连线之间？
  // ba * cosA 就是 cosA的邻边 比 bc就是希望这个比值是在线段上
  d / (len * len) = bc * ba * cosA / (bc * bc) = ba * cosA / bc
  vec3 r = b + ba * cosA
```

WebGL1 for 循环 需要常量的长度
The first thing to notice is we need to generate the shader. Shaders in WebGL1 have to have constant integer expression loops so we can't pass in the number of line segments, we have to hard code it into the shader.

这颜色转换感觉比试戴里面的简约，一样，clamp 的位置变了

```glsl
// converts hue, saturation, and value each in the 0 to 1 range
// to rgb.  c = color, c.x = hue, c.y = saturation, c.z = value
vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/// 试戴里的
// 颜色转换
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 hsv2hsl(vec3 c) {
  vec3 oc = vec3(c.x, 0.0, c.z * (1.0 - c.y * 0.5));
  if (oc.z != 0.0 && oc.z != 1.0) {
    oc.y = (c.z - oc.z) / min(oc.z, 1.0 - oc.z);
  }
  return oc;
}
vec3 hsl2hsv(vec3 c) {
  vec3 oc = vec3(c.x, 0.0, c.z + c.y * min(c.z, 1.0 - c.z));
  if (oc.z != 0.0) {
    oc.y = 2.0 * (1.0 - c.z / oc.z);
  }
  return oc;
}
vec3 rgb2hsl(vec3 c) {
  return hsv2hsl(rgb2hsv(c));
}
vec3 hsl2rgb(vec3 c) {
  return hsv2rgb(hsl2hsv(c));
}
```

## Some Caveats about GPGPU

可以用过 gl_FragData\[i\]设置 colorAttachment
GPGPU in WebGL1 is mostly limited to using 2D arrays as output though you can output to more than one 2D array at the same time using the WEBGL_draw_buffers extension if it exists.

WebGL2 可以处理任意长度 1 维数组 WebGPU 支持在 compute shader 随机读写
WebGL2 adds the ability to just process a 1D array of arbitrary size. WebGPU (AFAIK) lets you have random access writing, ie (compute shaders).

GPUs don't have the same precision as CPUs.

### readPixels is slow

尽量避免从 GPU 读数据，然后又写回 GPU

Where you can, keep the results on the GPU for as long as possible. In other words, you could do something like

    compute stuff on GPU
    read result
    prep result for next step
    upload prepped result to gpu
    compute stuff on GPU
    read result
    prep result for next step
    upload prepped result to gpu
    compute stuff on GPU
    read result

where as via creative solutions it would be much faster if you could

    compute stuff on GPU
    prep result for next step using GPU
    compute stuff on GPU
    prep result for next step using GPU
    compute stuff on GPU
    read result

Our dynamic closest lines example did this. The results never leave the GPU.

### lost context ?

过长 shader 执行会导致 lost context ?
GPUs can do many things in parallel but most can't multi-task the same way a CPU can. GPUs usually can't do "preemptive multitasking". That means if you give them a very complex shader that say takes 5 minutes to run they'll potentially freeze your entire machine for 5 minutes. Most well made OSes deal with this by having the CPU check how long it's been since the last command they gave to the GPU. If it's been to long (5-6 second) and the GPU has not responded then their only option is to reset the GPU.

### 输出 32bit 高精度整数

把 0~1 encode 到 32bit 的 4 通道 RGBA

https://stackoverflow.com/questions/63827836/is-it-possible-to-do-a-rgba-to-float-and-back-round-trip-and-read-the-pixels-in/63830492#63830492


