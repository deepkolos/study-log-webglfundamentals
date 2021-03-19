# WebGL 可视化相机

理解视锥体的矩阵运算

```js
// prettier-ignore
const perspectiveProjectionMatrix = m4.perspective(degToRad(cam1FieldOfView), aspect, cam1Near, cam1Far,);
const cameraMatrix = m4.lookAt(cameraPosition, target, up);

const perspectiveProjectionMatrix2 = m4.perspective(degToRad(60), aspect, near, far);
const cameraMatrix2 = m4.lookAt(cameraPosition2, target2, up);

mat =
  perspectiveProjectionMatrix2 * // 第二个相机的坐标系下进行投影出裁剪空间的正方体
  m4.inverse(cameraMatrix2) * // 相对于第二个相机的坐标系
  cameraMatrix * // 移动到第一个相机的位置和姿态
  m4.inverse(perspectiveProjectionMatrix); // 把裁剪空间的正方体变回视锥体
```

### 问题

透视投影的 near 和 far 可互换？

虽然有内容显示出来，但是 z 的是错的，小值在前面了

unproject 是 project Matrix 的逆矩阵么？貌似不是这样说法

```js
class Vector3 {
  project(camera) {
    return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
  }

  unproject(camera) {
    return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
  }
}
```
