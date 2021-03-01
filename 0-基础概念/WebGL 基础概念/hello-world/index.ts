import vert from './vert.glsl';
import frag from './frag.glsl';

// init canvas
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;
canvas.style.width = innerWidth + 'px';
canvas.style.height = innerHeight + 'px';
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
document.body.appendChild(canvas);

// init webgl
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);

// 初始化attribute并写入数据
{
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [0, 0, 0, 0.5, 0.7, 0]; // 三个二维点坐标

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // 将绑定点绑定到缓冲数据（positionBuffer）
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  const size = 2; // 每次迭代运行提取两个单位数据
  const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
  const normalize = false; // 不需要归一化数据
  const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  const offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
}

{
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

// utils
function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl: WebGLRenderingContext, vert: WebGLShader, frag: WebGLShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
