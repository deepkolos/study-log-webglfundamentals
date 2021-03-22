import vert from './vert.glsl';
import frag from './frag.glsl';
import { createBuffer, createProgram, createShader, initCanvas, m4, normalize } from 'utils/helper';

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
  const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
  const worldInverseTransposeMatrixLocation = gl.getUniformLocation(
    program,
    'u_worldInverseTransposeMatrix',
  );
  const projectWorldMatrixLocation = gl.getUniformLocation(program, 'u_projectWorldMatrix');
  const u_lightDirReversedLocation = gl.getUniformLocation(program, 'u_lightDirReversed');

  const positionBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  setNormals(gl);

  gl.uniform3fv(u_lightDirReversedLocation, normalize([0, 0, 1]));

  // render
  function draw() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let projectMatrix = m4.perspective(
      (30 / 180) * Math.PI,
      gl.canvas.width / gl.canvas.height,
      1,
      2000,
    );

    // 当相机在原点的时候就是这个配置了
    var camera = [0, 0, 500];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(camera, target, up);

    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectMatrix, viewMatrix);

    let worldMatrix = m4.translation(translation[0], translation[1], translation[2]);
    worldMatrix = m4.xRotate(worldMatrix, rotation[0]);
    worldMatrix = m4.yRotate(worldMatrix, rotation[1]);
    worldMatrix = m4.zRotate(worldMatrix, rotation[2]);
    worldMatrix = m4.scale(worldMatrix, scale[0], scale[1], scale[2]);

    let projectWorldMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    gl.uniformMatrix4fv(projectWorldMatrixLocation, false, projectWorldMatrix);

    var worldInverseMatrix = m4.inverse(worldMatrix);
    var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);
    gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
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
}

main();

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  // prettier-ignore
  var positions = new Float32Array([
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

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  var matrix = m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformPoint(matrix, [
      positions[ii + 0],
      positions[ii + 1],
      positions[ii + 2],
      1,
    ]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// prettier-ignore
function setNormals(gl) {
  var normals = new Float32Array([
          // left column front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // top rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // middle rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // left column back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // middle rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // top rung right
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // under top rung
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // between top rung and middle
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // top of middle rung
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // right of middle rung
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom of middle rung.
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // right of bottom
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // left side
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
