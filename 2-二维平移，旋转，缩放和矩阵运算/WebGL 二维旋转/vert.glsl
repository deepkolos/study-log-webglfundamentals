attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main() {
  vec2 rotatedPos = vec2(
    a_position.x * u_rotation.y + a_position.y * u_rotation.x,
    a_position.y * u_rotation.y - a_position.x * u_rotation.x
  );
  vec2 pos = (rotatedPos / u_resolution + u_translation) * 2.0 - 1.0;
  pos *= vec2(1.0, -1.0);
  gl_Position = vec4(pos, 0, 1);
  v_texcoord = a_texcoord;
}