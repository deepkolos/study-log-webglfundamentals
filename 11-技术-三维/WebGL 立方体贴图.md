# WebGL 立方体贴图

```js
// 生成纹理。
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

// 获取2维上下文。
/** @type {Canvas2DRenderingContext} */
const ctx = document.createElement('canvas').getContext('2d');

ctx.canvas.width = 128;
ctx.canvas.height = 128;

const faceInfos = [
  { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, faceColor: '#F00', textColor: '#0FF', text: '+X' },
  { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, faceColor: '#FF0', textColor: '#00F', text: '-X' },
  { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
  { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, faceColor: '#0FF', textColor: '#F00', text: '-Y' },
  { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, faceColor: '#00F', textColor: '#FF0', text: '+Z' },
  { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
];
faceInfos.forEach(faceInfo => {
  const { target, faceColor, textColor, text } = faceInfo;
  generateFace(ctx, faceColor, textColor, text);

  // 上传画布到立方体贴图的每个面。
  const level = 0;
  const internalFormat = gl.RGBA;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  gl.texImage2D(target, level, internalFormat, format, type, ctx.canvas);
});
gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
```
