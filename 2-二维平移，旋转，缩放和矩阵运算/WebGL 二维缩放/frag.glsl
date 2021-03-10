precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_texsize;
uniform float u_kernel[9];
uniform float u_kernelWeight;

varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_image, v_texcoord);
  // gl_FragColor = texture2D(u_image, v_texcoord).bgra;

  vec2 onePixel = vec2(1.0, 1.0) / u_texsize;

  // gl_FragColor = (
  //   texture2D(u_image, v_texcoord) +
  //   texture2D(u_image, v_texcoord + vec2(onePixel.x, 0.0)) +
  //   texture2D(u_image, v_texcoord - vec2(onePixel.x, 0.0))
  // ) / 3.0;

  vec4 colorSum =
    texture2D(u_image, v_texcoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
    texture2D(u_image, v_texcoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
    texture2D(u_image, v_texcoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
    texture2D(u_image, v_texcoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
 
   // 只把rgb值求和除以权重
   // 将阿尔法值设为 1.0
   gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
}