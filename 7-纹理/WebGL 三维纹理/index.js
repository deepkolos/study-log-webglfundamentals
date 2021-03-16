(() => {
  // 7-纹理/WebGL 三维纹理/vert.glsl
  var vert_default = "attribute vec2 a_position;\nattribute vec2 a_texcoord;\n\nvarying vec2 v_texcoord;\n\nuniform mat3 u_matrix;\n\nvoid main() {\n  vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n  gl_Position = vec4(position, 0, 1);\n  v_texcoord = a_texcoord;\n}";

  // 7-纹理/WebGL 三维纹理/frag.glsl
  var frag_default = "precision mediump float;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_texcoord;\n\nvoid main() {\n  gl_FragColor = texture2D(u_image, v_texcoord);\n}";

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
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }
  function createRectangle(l, t, w, h) {
    const r = l + w;
    const b = t + h;
    return [l, t, l, b, r, t, r, t, l, b, r, b];
  }
  function deg2rad(deg) {
    return deg / 180 * Math.PI;
  }
  function createCube(w, h, l) {
    w *= 0.5;
    h *= 0.5;
    l *= 0.5;
    return [
      -w,
      -h,
      l,
      w,
      -h,
      l,
      w,
      h,
      l,
      -w,
      -h,
      l,
      w,
      h,
      l,
      -w,
      h,
      l,
      -w,
      -h,
      -l,
      w,
      -h,
      -l,
      w,
      h,
      -l,
      -w,
      -h,
      -l,
      w,
      h,
      -l,
      -w,
      h,
      -l,
      -w,
      h,
      l,
      w,
      h,
      l,
      w,
      h,
      -l,
      -w,
      h,
      l,
      w,
      h,
      -l,
      -w,
      h,
      -l,
      -w,
      -h,
      l,
      w,
      -h,
      l,
      w,
      -h,
      -l,
      -w,
      -h,
      l,
      w,
      -h,
      -l,
      -w,
      -h,
      -l,
      w,
      -h,
      l,
      w,
      -h,
      -l,
      w,
      h,
      -l,
      w,
      -h,
      l,
      w,
      h,
      -l,
      w,
      h,
      l,
      -w,
      -h,
      l,
      -w,
      -h,
      -l,
      -w,
      h,
      -l,
      -w,
      -h,
      l,
      -w,
      h,
      -l,
      -w,
      h,
      l
    ];
  }
  var m3 = {
    projection: function(width, height) {
      return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
    },
    identity: function() {
      return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },
    translation: function(tx, ty) {
      return [1, 0, 0, 0, 1, 0, tx, ty, 1];
    },
    rotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [c, -s, 0, s, c, 0, 0, 0, 1];
    },
    scaling: function(sx, sy) {
      return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    },
    multiply: function(a, b) {
      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22
      ];
    }
  };

  // 7-纹理/WebGL 三维纹理/index.ts
  async function main() {
    const {gl} = initCanvas();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert_default);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_default);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const positionBuffer = gl.createBuffer();
    const texcoordBuffer = gl.createBuffer();
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const texsizeUniformLocation = gl.getUniformLocation(program, "u_texsize");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    const texture = gl.createTexture();
    const image = await loadImage("./deepkolos.jpg");
    const imgW = image.naturalWidth / 2;
    const imgH = image.naturalHeight / 2;
    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(texsizeUniformLocation, imgW, imgH);
    const positions = createCube(imgW, imgH, (imgW + imgH) * 0.5);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const texcoords = [
      ...createRectangle(0, 0, 1, 1),
      ...createRectangle(0, 0, 1, 1),
      ...createRectangle(0, 0, 1, 1),
      ...createRectangle(0, 0, 1, 1),
      ...createRectangle(0, 0, 1, 1),
      ...createRectangle(0, 0, 1, 1)
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
    matrix = m3.multiply(matrix, m3.translation(imgW, imgH));
    matrix = m3.multiply(matrix, m3.rotation(deg2rad(30)));
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    function draw() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix3fv(matrixLocation, false, matrix);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texcoordAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    draw();
  }
  main();
})();
