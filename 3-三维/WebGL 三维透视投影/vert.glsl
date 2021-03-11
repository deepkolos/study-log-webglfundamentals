attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;
uniform float u_fudgeFactor;

varying vec4 v_color;

void main() {
  vec4 pos = u_matrix * a_position;
  float zToDivideBy = 1.0 + pos.z * u_fudgeFactor;
  gl_Position = vec4(pos.xy / zToDivideBy, pos.zw);
  v_color = a_color;
}