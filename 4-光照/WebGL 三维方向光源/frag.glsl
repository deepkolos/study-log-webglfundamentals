precision mediump float;

uniform vec3 u_lightDirReversed;

varying vec3 v_normal;

void main() {
  vec3 normal = normalize(v_normal);
  float light = dot(normal, u_lightDirReversed);

  gl_FragColor = vec4(0.08, 0.76, 0.89, 1);
  gl_FragColor.rgb *= light;
}