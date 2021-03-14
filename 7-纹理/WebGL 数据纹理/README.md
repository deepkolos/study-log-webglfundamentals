# WebGL 数据纹理

WebGL1 支持的格式

| 格式            | 数据类型               | 通道数 | 单像素字节数 |
| --------------- | ---------------------- | ------ | ------------ |
| RGBA            | UNSIGNED_BYTE          | 4      | 4            |
| RGB             | UNSIGNED_BYTE          | 3      | 3            |
| RGBA            | UNSIGNED_SHORT_4_4_4_4 | 4      | 2            |
| RGBA            | UNSIGNED_SHORT_5_5_5_1 | 4      | 2            |
| RGB             | UNSIGNED_SHORT_5_6_5   | 3      | 2            |
| LUMINANCE_ALPHA | UNSIGNED_BYTE          | 2      | 2            |
| LUMINANCE       | UNSIGNED_BYTE          | 1      | 1            |
| ALPHA           | UNSIGNED_BYTE          | 1      | 1            |

WebGL 默认使用 4 字节长度，所以它期望每一行数据是多个 4 字节数据（最后一行除外）。

```js
const alignment = 1; // 1，2，4 和 8.
gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
```

所以 UNPACK_ALIGNMENT 8 是会加快数据的读取么？还是用于读取更高精度的数据？

### Pixel vs Texel

有时纹理上的像素叫 texels，像素是图片元素的简写，Texel 是纹理元素的简写。
我知道我可能会收到一些图形学大师的牢骚，但是我所说的 "texel" 是一种行话。
我通常在使用纹理的元素时不假思索的使用了“像素”这个词。 😇
