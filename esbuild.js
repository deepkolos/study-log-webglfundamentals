const { build } = require('esbuild');
const { glsl } = require('esbuild-plugin-glsl');
const process = require('process');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('-D');

const walk = (filePath, cb) => {
  const stat = fs.statSync(filePath);
  if (cb(filePath) && stat.isDirectory()) {
    fs.readdirSync(filePath).forEach(child => {
      walk(filePath + path.sep + child, cb);
    });
  }
};

// 找到需要构建的入口即可
walk(__dirname, filePath => {
  if (['node_modules', '.git', 'types', 'utils'].includes(path.basename(filePath))) return false;

  // 只需要编译ts文件即可
  if (path.extname(filePath) === '.ts') {
    build({
      entryPoints: [filePath],
      outfile: filePath.replace('.ts', '.js'),
      watch: isDev,
      bundle: true,
      plugins: [glsl({ minify: !isDev })],
    });
  }

  return true;
});
