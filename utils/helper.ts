export function initCanvas() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');

  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  document.body.appendChild(canvas);
  return { canvas, gl };
}

export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(gl: WebGLRenderingContext, vert: WebGLShader, frag: WebGLShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export function loadImage(src) {
  return new Promise<HTMLImageElement>(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export function createRectangle(l, t, w, h) {
  const r = l + w;
  const b = t + h;
  return [l, t, l, b, r, t, r, t, l, b, r, b];
}
