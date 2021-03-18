# WebGL 跨域图像

crossOrign 接受的值有三种。

0. undefined，这也是默认值，表示“不需要请求许可”；
1. "anonymous" 表示请求许可但不发送任何其他信息；
2. "use-credentials" 表示发送 cookies 和其他可能需要的信息，服务器通过这些信息决定是否授予许可。
   如果 crossOrign 设置为其他任意值则相当于 "anonymous"。

CORS 是双方协议
请求方表示可以跨域：img.crossOrigin = "anonymous"
发送方表示可以被跨域请求：Access-Control-Allow-Origin "\*"

http://www.ruanyifeng.com/blog/2016/04/cors.html
