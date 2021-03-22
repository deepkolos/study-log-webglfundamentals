attribute vec4 a_position;
// attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_worldInverseTransposeMatrix;
uniform mat4 u_projectWorldMatrix;

// varying vec4 v_color;
varying vec3 v_normal;

void main() {
  vec4 pos = u_projectWorldMatrix * a_position;
  gl_Position = pos;
  // v_color = a_color;
  v_normal = mat3(u_worldInverseTransposeMatrix) * a_normal;
  // v_normal = a_normal;

}