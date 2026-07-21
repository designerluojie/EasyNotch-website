# Notch 官网

Notch 的官网前端成品，基于 React、TypeScript 和 Vite 构建，包含桌面端与移动端适配、Notch 功能展示动效、FAQ 与联系模块。

## 本地运行

建议使用 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

终端会输出本地预览地址（通常是 `http://localhost:5173`）。

## 常用命令

```bash
npm run build   # 生成生产环境构建产物到 dist/
npm run preview # 本地预览生产构建
npm test        # 运行单元测试
npm run e2e     # 运行 Playwright 端到端测试
```

## 放到 GitHub

在 GitHub 新建一个空仓库后，在本目录执行：

```bash
git init
git add .
git commit -m "Initial website release"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

`.gitignore` 已排除依赖目录、构建产物、测试报告和系统缓存文件；不需要把 `node_modules/` 或 `dist/` 上传到 GitHub。
