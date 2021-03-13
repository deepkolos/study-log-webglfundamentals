# WebGL 动画

感觉 3d 的动画一般用的是 deltaTime，实现一些非 duration 固定的动画，比如 OrbitControls 的 damping 效果

网页一般都是使用固定 duration 的动画

而三维的动画会在主循环更新，而不是单独 rFA 里设置
