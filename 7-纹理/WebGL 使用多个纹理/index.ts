import vert from './vert.glsl';
import frag from './frag.glsl';
import { createBuffer, createProgram, createShader, initCanvas, loadImage, m4 } from 'utils/helper';

async function main() {
  // init canvas
  const { gl } = initCanvas();
  let translation = [0, 0, -1000];
  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];

  // init webgl
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const image0Location = gl.getUniformLocation(program, 'u_image0');
  const image1Location = gl.getUniformLocation(program, 'u_image1');

  // prettier-ignore
  const positionBuffer = createBuffer(gl, [
  // left column back
    -150,   0,  30,
    150,   0,  30,
    -150, 150,  30,
    -150, 150,  30,
    150,   0,  30,
    150, 150,  30,
  ]);

  // prettier-ignore
  const texcoordBuffer = createBuffer(gl, [
    0, 0,
    1, 0,
    0, 1,
    0, 1, 
    1, 0,
    1, 1,
  ], Float32Array)

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // 设置uniform
  {
    const texture = gl.createTexture();
    const image = await loadImage('./star.jpg');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(image0Location, 0);
  }

  {
    const texture = gl.createTexture();
    const image = await loadImage('./leaves.jpg');

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(image1Location, 1);
  }

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

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texcoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  draw();
}

main();
