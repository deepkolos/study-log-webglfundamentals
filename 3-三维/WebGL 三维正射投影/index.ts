import vert from './vert.glsl';
import frag from './frag.glsl';
import { createBuffer, createProgram, createShader, initCanvas, m4 } from 'utils/helper';

async function main() {
  // init canvas
  const { gl } = initCanvas();
  let translation = [0, 0, 0];
  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];

  // init webgl
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  // prettier-ignore
  const positionBuffer = createBuffer(gl, [
    // 左竖
     0,   0,  0,
    30,   0,  0,
     0, 150,  0,
     0, 150,  0,
    30,   0,  0,
    30, 150,  0,

    // 上横
    30,   0,  0,
   100,   0,  0,
    30,  30,  0,
    30,  30,  0,
   100,   0,  0,
   100,  30,  0,

    // 下横
    30,  60,  0,
    67,  60,  0,
    30,  90,  0,
    30,  90,  0,
    67,  60,  0,
    67,  90,  0
  ]);

  // 设置uniform
  gl.useProgram(program);

  // render
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
}

main();
