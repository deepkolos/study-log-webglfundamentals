# WebGL GPGPU

纹理不是图片
The basic realization to understanding GPGPU in WebGL is that a texture is not an image, it's a 2D array of values.

readPixels仅仅支持RGBA/UNSIGNED_BYTE，所以three的renderTarget格式也只能是RGBA/UNSIGNED_BYTE
In this particular case this affects how we read the output. We ask for RGBA/UNSIGNED_BYTE from readPixels because other format/type combinations are not supported. So we have to look at every 4th value for our answer.

