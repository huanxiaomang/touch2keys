import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../../dist');
const staticDir = path.resolve(__dirname, '../../static');
const templatesDir = path.resolve(__dirname, '../../templates');

// 确保目标目录存在
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// 复制静态资源到 static 目录
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const targetAssetsDir = path.join(staticDir, 'assets');
  if (fs.existsSync(targetAssetsDir)) {
    fs.rmSync(targetAssetsDir, { recursive: true });
  }
  fs.cpSync(assetsDir, targetAssetsDir, { recursive: true });
  console.log('✓ 静态资源已复制到 static/assets');
}

// 复制并修改 index.html 到 templates 目录
const indexHtml = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtml)) {
  let html = fs.readFileSync(indexHtml, 'utf-8');

  // 将 /assets/ 路径替换为 Flask 的 static 路径
  html = html.replace(/\/assets\//g, '/static/assets/');

  fs.writeFileSync(path.join(templatesDir, 'index.html'), html);
  console.log('✓ index.html 已复制到 templates/ (路径已更新)');
}

console.log('✓ 构建完成！');

