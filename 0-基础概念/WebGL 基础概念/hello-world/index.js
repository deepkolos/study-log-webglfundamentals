(() => {
  // 0-基础概念/WebGL 基础概念/hello-world/vert.glsl
  var vert_default = "attribute vec2 a_position;\n\nuniform vec2 u_resolution;\n\nvoid main() {\n  // \u4ECE\u50CF\u7D20\u5750\u6807\u8F6C\u6362\u5230 0.0 \u5230 1.0\n  vec2 zeroToOne = a_position / u_resolution;\n\n  // \u518D\u628A 0->1 \u8F6C\u6362 0->2\n  vec2 zeroToTwo = zeroToOne * 2.0;\n\n  // \u628A 0->2 \u8F6C\u6362\u5230 -1->+1 (\u88C1\u526A\u7A7A\u95F4)\n  vec2 clipSpace = zeroToTwo - 1.0;\n\n  // \u7FFB\u8F6CY\u8F74\n  clipSpace *= vec2(1, -1);\n\n  gl_Position = vec4(clipSpace, 0, 1);;\n}";

  // 0-基础概念/WebGL 基础概念/hello-world/frag.glsl
  var frag_default = "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n  gl_FragColor = u_color;\n}";

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
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
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
    const count = 6;
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
