# WebGL 蒙皮

图形学中的蒙皮是根据多矩阵的加权影响来移动一组顶点（抽象）

通常每个顶点对应骨骼数量的权重，大多数实时蒙皮系统限制每个顶点~4 个权重

伪代码示例，非蒙皮顶点通常会像这样计算

```glsl
gl_Position = projection * view * model * position;
```

蒙皮顶点像这样被有效计算

```glsl
  gl_Position = projection * view *
                (bone1Matrix * position * weight1 +
                 bone2Matrix * position * weight2 +
                 bone3Matrix * position * weight3 +
                 bone4Matrix * position * weight4);
```

不幸的是着色器中可以使用的全局变量的数量是有限制的。对 WebGL 比较低的限制是 64 个 vec4

纹理在某一纬度上的限制通常至少 2048 个像素（怪不得小程序就给了最小限制）

一种解决方案是存储"绑定姿势"，这是每个关节的额外矩阵，你用矩阵来作用于顶点位置之前的位置。这个例子，头部矩阵的绑定姿势比原点高 2 个单位。所以现在你可以使用该矩阵的逆来减去额外的 2 个矩阵。(先把顶点模型矩阵求逆？相当于把顶点放到原点再使用骨骼矩阵计算出顶点后的位置？)

换句话说，传递给着色器的骨骼矩阵每个都乘以了他们的绑定姿势的逆矩阵，以便只影响从原有位置的变化，相对于网格原点。
