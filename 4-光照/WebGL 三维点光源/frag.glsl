precision mediump float;

uniform float u_shininess;

varying vec3 v_normal;
varying vec3 v_light;
varying vec3 v_camera;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(v_light);
  vec3 cameraDir = normalize(v_camera);
  vec3 halfDir = normalize(lightDir + cameraDir);

  float light = dot(normal, lightDir);
  float specular = 0.0;
  if(light > 0.0) {
    specular = pow(dot(normal, halfDir), u_shininess);
  }

  gl_FragColor = vec4(0.08, 0.76, 0.89, 1);
  gl_FragColor.rgb *= light;
  if(specular > 0.0) {
    gl_FragColor.rgb += specular;
  }
}