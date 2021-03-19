# WebGL 平面的和透视的投影映射

视锥体投影到近平面对应到纹理坐标就行了
投影纹理和纹理映射是同一个事情来的，卧槽

理解投影映射的矩阵作用，尤其是除 w

```js
const textureProjectionMatrix = settings.perspective
  ? m4.perspective(
      degToRad(settings.fieldOfView),
      settings.projWidth / settings.projHeight,
      0.1, // near
      200,
    ) // far
  : m4.orthographic(
      -settings.projWidth / 2, // left
      settings.projWidth / 2, // right
      -settings.projHeight / 2, // bottom
      settings.projHeight / 2, // top
      0.1, // near
      200,
    ); // far

// use the inverse of this world matrix to make
// a matrix that will transform other positions
// to be relative this this world space.
const textureMatrix = m4.multiply(textureProjectionMatrix, m4.inverse(textureWorldMatrix));



vec4 worldPosition = u_world * a_position;
// 世界坐标下转换，得到世界坐标

// textureProjectionMatrix * m4.inverse(textureWorldMatrix) * worldPosition
// 先变成投影映射的坐标系
// 然后进行投影到纹理坐标
v_projectedTexcoord = u_textureMatrix * worldPosition;
```

## 应用

0. CS 里面的喷漆
1. 光照？
2. 阴影
