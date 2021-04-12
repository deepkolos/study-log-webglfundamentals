# WebGL 雾

基本上你所做的就是在着色器中使用某些从相机位置计算的深度或者距离来使颜色或多或少的成为雾色。

```glsl
gl_FragColor = mix(originalColor, fogColor, fogAmount);

// 等同于
gl_FragColor = originalColor + (fogColor - originalColor) * fogAmount;
```

其中 fogAmount 是 0 到 1 之间的值。mix 函数混合前 2 个值。当 fogAmount 为 0 时，mix 返回 originalColor。当 fogAmount 为 1 时，mix 返回 fogColor。在 0 到 1 之间时，你会获得两个颜色按百分比混合的颜色值。

我们可以编写代码来实现这点，但 GLSL 有一个函数 smoothstep 就是这样做的。你给定最小值，最大值，和要测试的值。如果测试值小于等于最小值返回 0。如果测试值大于等于最大值返回 1。如果测试值在两值之间，则根据测试值在最小值和最大值之间的位置返回 0 到 1 之间的插值。

```glsl
vec4 color = texture2D(u_texture, v_texcoord);

float fogAmount = smoothstep(u_fogNear, u_fogFar, v_fogDepth);

gl_FragColor = mix(color, u_fogColor, fogAmount);
```

到目前为止，我们所有的雾都使用了线性计算。换句话说，在最近处到最远处之间雾颜色被线性地施加。像现实中的许多事物一样，雾是指数方式显现的。它根据距观察者距离的平方变厚。一个常见的指数雾公式是

```glsl
#define LOG2 1.442695

fogAmount = 1. - exp2(-fogDensity * fogDensity * fogDistance * fogDistance * LOG2));
fogAmount = clamp(fogAmount, 0., 1.);
```

需要注意的是基于密度的雾没有最近值和最远值设置。它可能更符合真实情况但也可能不符合你的审美需求。你更喜欢哪一个是一个艺术问题。
