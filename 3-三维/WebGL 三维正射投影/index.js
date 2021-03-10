(() => {
  // 3-三维/WebGL 三维正射投影/vert.glsl
  var vert_default = "attribute vec4 a_position;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n  gl_Position = u_matrix * a_position;\n}";

  // 3-三维/WebGL 三维正射投影/frag.glsl
  var frag_default = "precision mediump float;\n\nvoid main() {\n  gl_FragColor = vec4(0.08, 0.76, 0.89, 1);\n}";

  // utils/helper.ts
  function initCanvas() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    document.body.appendChild(canvas);
    return {canvas, gl};
  }
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
      return shader;
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  function createProgram(gl, vert, frag) {
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success)
      return program;
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  function createBuffer(gl, data, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
    return buffer;
  }
  var m4 = {
    projection: function(width, height, depth) {
      return [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1];
    },
    translation: function(tx, ty, tz) {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    },
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
    },
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
    },
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    },
    scaling: function(sx, sy, sz) {
      return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    },
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
    multiply: function(a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
      ];
    }
  };

  // 3-三维/WebGL 三维正射投影/index.ts
  async function main() {
    const {gl} = initCanvas();
    let translation = [0, 0, 0];
    let rotation = [0, 0, 0];
    let scale = [1, 1, 1];
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert_default);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_default);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    const positionBuffer = createBuffer(gl, [
      0,
      0,
      0,
      30,
      0,
      0,
      0,
      150,
      0,
      0,
      150,
      0,
      30,
      0,
      0,
      30,
      150,
      0,
      30,
      0,
      0,
      100,
      0,
      0,
      30,
      30,
      0,
      30,
      30,
      0,
      100,
      0,
      0,
      100,
      30,
      0,
      30,
      60,
      0,
      67,
      60,
      0,
      30,
      90,
      0,
      30,
      90,
      0,
      67,
      60,
      0,
      67,
      90,
      0
    ]);
    gl.useProgram(program);
    function draw() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      let matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
      matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6 * 3);
    }
    draw();
    const inputX = document.getElementById("inputX");
    const inputY = document.getElementById("inputY");
    const inputZ = document.getElementById("inputZ");
    const inputRX = document.getElementById("inputRX");
    const inputRY = document.getElementById("inputRY");
    const inputRZ = document.getElementById("inputRZ");
    const inputSX = document.getElementById("inputSX");
    const inputSY = document.getElementById("inputSY");
    const inputSZ = document.getElementById("inputSZ");
    function beforeDraw(cb) {
      return () => {
        cb();
        draw();
      };
    }
    inputX.oninput = beforeDraw(() => {
      translation[0] = inputX.valueAsNumber / 100 * gl.canvas.width;
    });
    inputY.oninput = beforeDraw(() => {
      translation[1] = inputY.valueAsNumber / 100 * gl.canvas.height;
    });
    inputZ.oninput = beforeDraw(() => {
      translation[2] = inputZ.valueAsNumber / 100 * 400;
    });
    inputRX.oninput = beforeDraw(() => {
      const rotationDeg = 360 - ~~inputRX.value;
      rotation[0] = rotationDeg * Math.PI / 180;
    });
    inputRY.oninput = beforeDraw(() => {
      const rotationDeg = 360 - ~~inputRY.value;
      rotation[1] = rotationDeg * Math.PI / 180;
    });
    inputRZ.oninput = beforeDraw(() => {
      const rotationDeg = 360 - ~~inputRZ.value;
      rotation[2] = rotationDeg * Math.PI / 180;
    });
    inputSX.oninput = beforeDraw(() => {
      scale[0] = inputSX.valueAsNumber / 100;
    });
    inputSY.oninput = beforeDraw(() => {
      scale[1] = inputSY.valueAsNumber / 100;
    });
    inputSZ.oninput = beforeDraw(() => {
      scale[2] = inputSZ.valueAsNumber / 100;
    });
  }
  main();
})();
