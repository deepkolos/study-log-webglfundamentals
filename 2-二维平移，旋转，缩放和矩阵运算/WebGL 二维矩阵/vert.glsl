attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

// uniform vec2 u_resolution;
// uniform vec2 u_translation;
// uniform vec2 u_rotation;
// uniform vec2 u_scale;
uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  // vec2 pos = (position / u_resolution) * 2.0 - 1.0;
  // gl_Position = vec4(pos * vec2(1.0, -1.0), 0, 1);
  gl_Position = vec4(position, 0, 1);;
  v_texcoord = a_texcoord;
}