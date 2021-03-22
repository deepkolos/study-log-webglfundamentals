attribute vec4 a_position;
// attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_worldInverseTransposeMatrix;
uniform mat4 u_projectWorldMatrix;
uniform mat4 u_worldMatrix;
uniform vec3 u_pointLightPosition;
uniform vec3 u_cameraPosition;

// varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_light;
varying vec3 v_camera;

void main() {
  vec4 pos = u_projectWorldMatrix * a_position;
  vec3 worldPos = (u_worldMatrix * a_position).xyz;
  gl_Position = pos;
  // v_color = a_color;
  v_normal = mat3(u_worldInverseTransposeMatrix) * a_normal;
  v_light = u_pointLightPosition - worldPos.xyz;
  v_camera = u_cameraPosition - worldPos.xyz;
  // v_normal = a_normal;

}