# WebGL 着色器

顶点着色器的工作是生成裁剪空间坐标值，通过`gl_Position`设置

片断着色器的工作是为当前光栅化的像素提供颜色值，通过`gl_FragColor`设置

注：除了 `gl_FragColor` 还可以使用 `gl_FragData[0]` 设置颜色

### Attribute 使用

Attribute 支持的数据类型： float, vec2, vec3, vec4, mat2, mat3 和 mat4 。

Attribute 的设置就是昨天里看到的三部曲

```js
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 2]));

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 告诉属性怎么从buffer中读取数据 (ARRAY_BUFFER)
const size = 2; // 每次迭代运行提取两个单位数据
const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
const normalize = false; // 不需要归一化数据
const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// 每次迭代运行运动多少内存到下一个数据开始点
const offset = 0; // 从缓冲起始位置开始读取
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
```

### Uniform 使用

```js
gl.uniform1f (floatUniformLoc, v);                 // float
gl.uniform1fv(floatUniformLoc, [v]);               // float 或 float array
gl.uniform2f (vec2UniformLoc,  v0, v1);            // vec2
gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // vec2 或 vec2 array
gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // vec3
gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // vec3 或 vec3 array
gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // vec4
gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // vec4 或 vec4 array

gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // mat2 或 mat2 array
gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // mat3 或 mat3 array
gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // mat4 或 mat4 array

gl.uniform1i (intUniformLoc,   v);                 // int
gl.uniform1iv(intUniformLoc, [v]);                 // int 或 int array
gl.uniform2i (ivec2UniformLoc, v0, v1);            // ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // ivec2 或 ivec2 array
gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // ivec3 or ivec3 array
gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // ivec4 或 ivec4 array

gl.uniform1i (sampler2DUniformLoc,   v);           // sampler2D (textures)
gl.uniform1iv(sampler2DUniformLoc, [v]);           // sampler2D 或 sampler2D array

gl.uniform1i (samplerCubeUniformLoc,   v);         // samplerCube (textures)
gl.uniform1iv(samplerCubeUniformLoc, [v]);         // samplerCube 或 samplerCube array

// 着色器里
`uniform vec2 u_someVec2[3];`

var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2");
var someVec2Element0Loc = gl.getUniformLocation(someProgram, "u_someVec2[0]");

gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // 设置数组 u_someVec2
gl.uniform2fv(someVec2Element0Loc, [1, 2]);  // set element 0

`struct SomeStruct {
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;`

var someThingActiveLoc = gl.getUniformLocation(someProgram, "u_someThing.active");
```

### Texture 的使用

```glsl
precision mediump float;

uniform sampler2D u_texture;

void main() {
    vec2 texcoord = vec2(0.5, 0.5)  // 获取纹理中心的值
    gl_FragColor = texture2D(u_texture, texcoord);
}
```

```js
// 设置纹理
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
var level = 0;
var width = 2;
var height = 1;
// prettier-ignore
var data = new Uint8Array([
    255, 0, 0, 255,   // 一个红色的像素
    0, 255, 0, 255,   // 一个绿色的像素
]);
gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

// 把纹理通过uniform传递到Program
var someSamplerLoc = gl.getUniformLocation(someProgram, 'u_texture');

// 在渲染的时候WebGL要求纹理必须绑定到一个纹理单元上
// 纹理单元和纹理是什么关系？？
var unit = 5; // 挑选一个纹理单元
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);

// 然后通过纹理单元去关联纹理
gl.uniform1i(someSamplerLoc, unit);

// gl.TEXTURE_2D 用来写入纹理
// shader根据纹理单元读取纹理
```

### Varyings

比较容易理解，用来插值的

```glsl
# vert
attribute vec4 a_position;

uniform vec4 u_offset;

varying vec4 v_positionWithOffset;

void main() {
  gl_Position = a_position + u_offset;
  v_positionWithOffset = a_position + u_offset;
}
```

```glsl
# frag
precision mediump float;

varying vec4 v_positionWithOffset;

void main() {
  // 从裁剪空间 (-1 <-> +1) 转换到颜色空间 (0 -> 1).
  vec4 color = v_positionWithOffset * 0.5 + 0.5
  gl_FragColor = color;
}
```

# GLSL

GLSL 全称是 Graphics Library Shader Language （图形库着色器语言），是着色器使用的语言。 它有一些不同于 JavaScript 的特性，主要目的是为栅格化图形提供常用的计算功能

0. v.x 和 v.s 以及 v.r ， v[0] 表达的是同一个分量。
1. v.y 和 v.t 以及 v.g ， v[1] 表达的是同一个分量。
2. v.z 和 v.p 以及 v.b ， v[2] 表达的是同一个分量。
3. v.w 和 v.q 以及 v.a ， v[3] 表达的是同一个分量。

它还支持矢量调制，意味者你可以交换或重复分量。

```
vec4(v.rgb, 1) 等同于 vec4(v.r, v.g, v.b, 1)
```

GLSL 有一系列内置方法，其中大多数运算支持多种数据类型，并且一次可以运算多个分量，这个和 SIMD 类似么？

mix(v1, v2, f): linear blend of x and y

mix 这个函数是 GLSL 中一个特殊的线性插值函数，他将前两个参数的值基于第三个参数按照以下公式进行插值：

    genType mix (genType x, genType y, float a)

    返回线性混合的x和y，如：x⋅(1−a)+y⋅a
