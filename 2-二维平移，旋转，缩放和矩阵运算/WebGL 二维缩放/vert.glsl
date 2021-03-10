attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  // 缩放
  vec2 scaledPosition = a_position * u_scale;

  // 旋转
  vec2 rotatedPos = vec2(
    scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
  );
  vec2 pos = (rotatedPos / u_resolution + u_translation) * 2.0 - 1.0;
  pos *= vec2(1.0, -1.0);
  gl_Position = vec4(pos, 0, 1);
  v_texcoord = a_texcoord;
}