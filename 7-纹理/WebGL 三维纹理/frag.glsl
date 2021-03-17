precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_image, v_texcoord); // vec4(0.08, 0.76, 0.89, 1);
  // gl_FragColor = vec4(0.08, 0.76, 0.89, 1);

}