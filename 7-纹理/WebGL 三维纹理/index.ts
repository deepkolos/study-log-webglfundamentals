import vert from './vert.glsl';
import frag from './frag.glsl';
import {
  createCube,
  createProgram,
  createRectangle,
  createShader,
  deg2rad,
  initCanvas,
  loadImage,
  m3,
} from 'utils/helper';

async function main() {
  // init canvas
  const { gl } = initCanvas();

  // init webgl
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionBuffer = gl.createBuffer();
  const texcoordBuffer = gl.createBuffer();
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const texsizeUniformLocation = gl.getUniformLocation(program, 'u_texsize');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  // 设置uniform
  const texture = gl.createTexture();
  const image = await loadImage('./deepkolos.jpg');
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

  // 初始化attribute并写入数据
  const positions = createCube(imgW, imgH, (imgW + imgH) * 0.5);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texcoords = [
    ...createRectangle(0, 0, 1, 1),
    ...createRectangle(0, 0, 1, 1),
    ...createRectangle(0, 0, 1, 1),
    ...createRectangle(0, 0, 1, 1),
    ...createRectangle(0, 0, 1, 1),
    ...createRectangle(0, 0, 1, 1),
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
  matrix = m3.multiply(matrix, m3.translation(imgW, imgH));
  matrix = m3.multiply(matrix, m3.rotation(deg2rad(30)));
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  // render
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

  // build ui
}

main();
