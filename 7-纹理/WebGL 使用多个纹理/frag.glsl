precision mediump float;

uniform sampler2D u_image0;
uniform sampler2D u_image1;

varying vec2 v_texcoord;

void main() {
  vec4 color0 = texture2D(u_image0, v_texcoord);
  vec4 color1 = texture2D(u_image1, v_texcoord);
  gl_FragColor = color0 * color1;
}