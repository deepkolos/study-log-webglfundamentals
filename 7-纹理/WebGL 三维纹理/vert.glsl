attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  gl_Position = vec4(position, 0, 1);
  v_texcoord = a_texcoord;
}