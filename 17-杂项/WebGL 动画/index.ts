import vert from './vert.glsl';
import frag from './frag.glsl';
import { createBuffer, createProgram, createShader, deg2rad, initCanvas, m4 } from 'utils/helper';
import { animate } from 'utils/animate';

async function main() {
  // init canvas
  const { gl } = initCanvas();
  let translation = [0, 0, -1000];
  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];
  let fudgeFactor = 0;

  // init webgl
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const fudgeFactorLocation = gl.getUniformLocation(program, 'u_fudgeFactor');

  // prettier-ignore
  const positionBuffer = createBuffer(gl, [
    // left column front
    0,   0,  0,
    0, 150,  0,
    30,   0,  0,
    0, 150,  0,
    30, 150,  0,
    30,   0,  0,

    // top rung front
    30,   0,  0,
    30,  30,  0,
    100,   0,  0,
    30,  30,  0,
    100,  30,  0,
    100,   0,  0,

    // middle rung front
    30,  60,  0,
    30,  90,  0,
    67,  60,  0,
    30,  90,  0,
    67,  90,  0,
    67,  60,  0,

    // left column back
      0,   0,  30,
     30,   0,  30,
      0, 150,  30,
      0, 150,  30,
     30,   0,  30,
     30, 150,  30,

    // top rung back
     30,   0,  30,
    100,   0,  30,
     30,  30,  30,
     30,  30,  30,
    100,   0,  30,
    100,  30,  30,

    // middle rung back
     30,  60,  30,
     67,  60,  30,
     30,  90,  30,
     30,  90,  30,
     67,  60,  30,
     67,  90,  30,

    // top
      0,   0,   0,
    100,   0,   0,
    100,   0,  30,
      0,   0,   0,
    100,   0,  30,
      0,   0,  30,

    // top rung right
    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    // under top rung
    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    // between top rung and middle
    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    // top of middle rung
    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    // right of middle rung
    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    // bottom of middle rung.
    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    // right of bottom
    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    // bottom
    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    // left side
    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0]);

  // prettier-ignore
  const colorBuffer = createBuffer(gl, [
    // left column front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // top rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // middle rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // left column back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // middle rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,

    // top rung right
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,

    // under top rung
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,

    // between top rung and middle
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,

    // top of middle rung
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,

    // right of middle rung
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,

    // bottom of middle rung.
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,

    // right of bottom
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,

    // bottom
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,

    // left side
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220], Uint8Array)

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // render
  function draw() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let matrix = m4.perspective((30 / 180) * Math.PI, gl.canvas.width / gl.canvas.height, 1, 2000);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniform1f(fudgeFactorLocation, fudgeFactor);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  }

  draw();

  const animateRotateY = () =>
    animate([0], [deg2rad(359)], 1000, ([rotateY]) => {
      rotation[1] = rotateY;
      draw();
    }).then(animateRotateY);
  animateRotateY();

  // build ui
  const inputX = document.getElementById('inputX') as HTMLInputElement;
  const inputY = document.getElementById('inputY') as HTMLInputElement;
  const inputZ = document.getElementById('inputZ') as HTMLInputElement;
  const inputRX = document.getElementById('inputRX') as HTMLInputElement;
  const inputRY = document.getElementById('inputRY') as HTMLInputElement;
  const inputRZ = document.getElementById('inputRZ') as HTMLInputElement;
  const inputSX = document.getElementById('inputSX') as HTMLInputElement;
  const inputSY = document.getElementById('inputSY') as HTMLInputElement;
  const inputSZ = document.getElementById('inputSZ') as HTMLInputElement;
  const inputFF = document.getElementById('inputFF') as HTMLInputElement;

  function beforeDraw(cb) {
    return () => {
      cb();
      // draw();
    };
  }

  inputX.oninput = beforeDraw(() => {
    translation[0] = (inputX.valueAsNumber / 100) * gl.canvas.width;
  });
  inputY.oninput = beforeDraw(() => {
    translation[1] = (inputY.valueAsNumber / 100) * gl.canvas.height;
  });
  inputZ.oninput = beforeDraw(() => {
    translation[2] = inputZ.valueAsNumber;
  });

  inputRX.oninput = beforeDraw(() => {
    const rotationDeg = 360 - ~~inputRX.value;
    rotation[0] = (rotationDeg * Math.PI) / 180;
  });
  inputRY.oninput = beforeDraw(() => {
    const rotationDeg = 360 - ~~inputRY.value;
    rotation[1] = (rotationDeg * Math.PI) / 180;
  });
  inputRZ.oninput = beforeDraw(() => {
    const rotationDeg = 360 - ~~inputRZ.value;
    rotation[2] = (rotationDeg * Math.PI) / 180;
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

  inputFF.oninput = beforeDraw(() => {
    fudgeFactor = (inputFF.valueAsNumber / 100) * 5;
  });
}

main();
