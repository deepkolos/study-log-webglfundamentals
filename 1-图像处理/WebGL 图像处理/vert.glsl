attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform vec2 u_resolution;

void main() {
  vec2 pos = (a_position / u_resolution) * 2.0 - 1.0;
  pos *= vec2(1.0, -1.0);
  gl_Position = vec4(pos, 0, 1);
  v_texcoord = a_texcoord;
}