(() => {
  // 0-基础概念/WebGL 基础概念/hello-world/vert.glsl
  var vert_default = "attribute vec4 a_position;\n\nvoid main() {\n  gl_Position = a_position;\n}";

  // 0-基础概念/WebGL 基础概念/hello-world/frag.glsl
  var frag_default = "precision mediump float;\n\nvoid main() {\n  gl_FragColor = vec4(1, 0, 0.5, 1);\n}";

  // 0-基础概念/WebGL 基础概念/hello-world/index.ts
  var canvas = document.createElement("canvas");
  var gl = canvas.getContext("webgl");
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  document.body.appendChild(canvas);
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vert_default);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_default);
  var program = createProgram(gl, vertexShader, fragmentShader);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [0, 0, 0, 0.5, 0.7, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }
  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
  function createShader(gl2, type, source) {
    const shader = gl2.createShader(type);
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    const success = gl2.getShaderParameter(shader, gl2.COMPILE_STATUS);
    if (success)
      return shader;
    console.log(gl2.getShaderInfoLog(shader));
    gl2.deleteShader(shader);
  }
  function createProgram(gl2, vert, frag) {
    const program2 = gl2.createProgram();
    gl2.attachShader(program2, vert);
    gl2.attachShader(program2, frag);
    gl2.linkProgram(program2);
    const success = gl2.getProgramParameter(program2, gl2.LINK_STATUS);
    if (success)
      return program2;
    console.log(gl2.getProgramInfoLog(program2));
    gl2.deleteProgram(program2);
  }
})();
