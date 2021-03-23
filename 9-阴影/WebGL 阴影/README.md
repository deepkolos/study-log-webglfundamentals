# WebGL 阴影

阴影映射（shadow map）

0. 光源所照射到深度信息写入纹理
1. 投影映射深度与读取深度纹理的值对比，绘制阴影

阴影痤疮（shadow acne），因为深度纹理已经被量化，有误差

通过增加 bias 缓解，但是 bias 太大会导致部分阴影丢失

## 软阴影

TODO: 回顾 GAMES202 实时阴影 1（shadow mapping，PCSS）

## PCF

## PCSS
