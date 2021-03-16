(() => {
  // 2-二维平移，旋转，缩放和矩阵运算/WebGL 二维矩阵/vert.glsl
  var vert_default = "attribute vec2 a_position;\nattribute vec2 a_texcoord;\n\nvarying vec2 v_texcoord;\n\n// uniform vec2 u_resolution;\n// uniform vec2 u_translation;\n// uniform vec2 u_rotation;\n// uniform vec2 u_scale;\nuniform mat3 u_matrix;\n\nvoid main() {\n  vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n  // vec2 pos = (position / u_resolution) * 2.0 - 1.0;\n  // gl_Position = vec4(pos * vec2(1.0, -1.0), 0, 1);\n  gl_Position = vec4(position, 0, 1);\n  v_texcoord = a_texcoord;\n}";

  // 2-二维平移，旋转，缩放和矩阵运算/WebGL 二维矩阵/frag.glsl
  var frag_default = "precision mediump float;\n\nuniform sampler2D u_image;\nuniform vec2 u_texsize;\nuniform float u_kernel[9];\nuniform float u_kernelWeight;\n\nvarying vec2 v_texcoord;\n\nvoid main() {\n  gl_FragColor = texture2D(u_image, v_texcoord);\n  // gl_FragColor = texture2D(u_image, v_texcoord).bgra;\n\n  vec2 onePixel = vec2(1.0, 1.0) / u_texsize;\n\n  // gl_FragColor = (\n  //   texture2D(u_image, v_texcoord) +\n  //   texture2D(u_image, v_texcoord + vec2(onePixel.x, 0.0)) +\n  //   texture2D(u_image, v_texcoord - vec2(onePixel.x, 0.0))\n  // ) / 3.0;\n\n  vec4 colorSum =\n    texture2D(u_image, v_texcoord + onePixel * vec2(-1, -1)) * u_kernel[0] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 0, -1)) * u_kernel[1] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 1, -1)) * u_kernel[2] +\n    texture2D(u_image, v_texcoord + onePixel * vec2(-1,  0)) * u_kernel[3] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 0,  0)) * u_kernel[4] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 1,  0)) * u_kernel[5] +\n    texture2D(u_image, v_texcoord + onePixel * vec2(-1,  1)) * u_kernel[6] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 0,  1)) * u_kernel[7] +\n    texture2D(u_image, v_texcoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;\n \n   // \u53EA\u628Argb\u503C\u6C42\u548C\u9664\u4EE5\u6743\u91CD\n   // \u5C06\u963F\u5C14\u6CD5\u503C\u8BBE\u4E3A 1.0\n   gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);\n}";

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

  // 2-二维平移，旋转，缩放和矩阵运算/WebGL 二维矩阵/index.ts
  var kernels = {
    normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
    gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
    unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
    edgeDetect: [-0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125],
    edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
    edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
    edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
    edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
    sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
    sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
    previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
    previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
    boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
    triangleBlur: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625],
    emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
  };
  function computeKernelWeight(kernel) {
    const weight = kernel.reduce((prev, curr) => prev + curr);
    return weight <= 0 ? 1 : weight;
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
  async function main() {
    const {gl} = initCanvas();
    let currEffect;
    let translateX = 0;
    let translateY = 0;
    let rotationX = 0;
    let rotationY = 1;
    let rotationDeg = 0;
    let rotationRad = 0;
    let scaleX = 1;
    let scaleY = 1;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert_default);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_default);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const positionBuffer = gl.createBuffer();
    const texcoordBuffer = gl.createBuffer();
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
    const texsizeUniformLocation = gl.getUniformLocation(program, "u_texsize");
    const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
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
    gl.uniform2f(texsizeUniformLocation, imgW, imgH);
    const positions = createRectangle(0, 0, imgW, imgH);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const texcoords = createRectangle(0, 0, 1, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    function drawEffect(name = currEffect) {
      currEffect = name;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1fv(kernelLocation, kernels[name]);
      gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
      const translationMatrix = m3.translation(translateX, translateY);
      const rotationMatrix = m3.rotation(rotationRad);
      const scaleMatrix = m3.scaling(scaleX, scaleY);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texcoordAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
      for (var i = 0; i < 5; ++i) {
        matrix = m3.multiply(matrix, translationMatrix);
        matrix = m3.multiply(matrix, rotationMatrix);
        matrix = m3.multiply(matrix, scaleMatrix);
        matrix = m3.multiply(matrix, m3.translation(-imgW / 2, -imgH / 2));
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
    drawEffect("normal");
    const select = document.createElement("select");
    const names = Object.keys(kernels);
    select.onchange = () => {
      drawEffect(names[select.selectedIndex]);
    };
    names.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.innerText = name;
      select.appendChild(option);
    });
    document.body.appendChild(select);
    const inputX = document.getElementById("inputX");
    const inputY = document.getElementById("inputY");
    const inputR = document.getElementById("inputR");
    const inputSX = document.getElementById("inputSX");
    const inputSY = document.getElementById("inputSY");
    inputX.oninput = () => {
      translateX = inputX.valueAsNumber / 100 * gl.canvas.width;
      drawEffect();
    };
    inputY.oninput = () => {
      translateY = inputY.valueAsNumber / 100 * gl.canvas.height;
      drawEffect();
    };
    inputR.oninput = () => {
      rotationDeg = 360 - ~~inputR.value;
      rotationRad = rotationDeg * Math.PI / 180;
      rotationX = Math.sin(rotationRad);
      rotationY = Math.cos(rotationRad);
      drawEffect();
    };
    inputSX.oninput = () => {
      scaleX = inputSX.valueAsNumber / 100;
      drawEffect();
    };
    inputSY.oninput = () => {
      scaleY = inputSY.valueAsNumber / 100;
      drawEffect();
    };
  }
  main();
})();
