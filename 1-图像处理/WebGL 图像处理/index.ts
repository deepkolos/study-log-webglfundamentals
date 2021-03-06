import vert from './vert.glsl';
import frag from './frag.glsl';
import { createProgram, createRectangle, createShader, initCanvas, loadImage } from 'utils/helper';

// Define several convolution kernels
const kernels = {
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
  emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

function computeKernelWeight(kernel) {
  const weight = kernel.reduce((prev, curr) => prev + curr);
  return weight <= 0 ? 1 : weight;
}

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
  const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
  const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');

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
  const positions = createRectangle(0, 0, imgW, imgH);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texcoords = createRectangle(0, 0, 1, 1);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  // render
  function drawEffect(name: keyof typeof kernels) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1fv(kernelLocation, kernels[name]);
    gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texcoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawEffect('normal');

  // build ui
  const select = document.createElement('select');
  const names = Object.keys(kernels);
  select.onchange = () => {
    // @ts-ignore
    drawEffect(names[select.selectedIndex]);
  };
  names.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.innerText = name;
    select.appendChild(option);
  });
  document.body.appendChild(select);
}

main();
