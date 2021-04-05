# WebGL 环境贴图 (反射)

前面立方体纹理的设置 + 反射公式

```js
reflectionDir = eyeToSurfaceDir –
  2 ∗ dot(surfaceNormal, eyeToSurfaceDir) ∗ surfaceNormal;
```

```js
precision highp float;

// Passed in from the vertex shader.
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

// The texture.
uniform samplerCube u_texture;

// The position of the camera
uniform vec3 u_worldCameraPosition;

void main() {
  vec3 worldNormal = normalize(v_worldNormal);
  vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
  vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

  gl_FragColor = textureCube(u_texture, direction);
}
```

direction 是单位向量，因为传入向量是单位向量，但是没有找到 textureCube 关于纹理坐标的格式说明

https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/reflect.xhtml

https://thebookofshaders.com/glossary/?search=textureCube#:~:text=Description%20The%20textureCube%20function%20returns%20a%20texel%2C%20i.e.,3-dimensional%20coordinates%20of%20the%20texel%20to%20look%20up.
