# Notch 官网 Web 项目交接文档

更新时间：2026-07-11

## 当前状态

`rebuild/hero-pc` 是从 `website` 工程复制出的独立实现分支。当前副本已经移除旧的 Hero、浮动导航、MacBook、Notch、模块、FAQ 和联系区视觉代码，只保留 Vite + React + TypeScript 的运行、构建、测试和站点配置底层。

当前页面范围只有 Figma 首屏 PC：1441×800 参考画布，包含运行时环形背景、顶部导航、产品标记、标题、副标题和立即体验按钮。H5、第二屏、FAQ、联系区不在本轮范围内。

## 工程位置

- Git 分支：`rebuild/hero-pc`
- Worktree：`/Users/luojie/Documents/Notch官网/.worktrees/website-hero-pc`
- 原始工程：`/Users/luojie/Documents/Notch官网/.worktrees/website`
- Figma 首屏：<https://www.figma.com/design/sPAqmRh7r6Z8K2sXtQtjye/VibeCoding?node-id=640-6587>

## 首屏实现

新版首屏代码位于 `src/pages/home/hero-pc/`：

- `HeroPcPage.tsx`：首屏组合、CTA 和下载提示。
- `HeroPcNavigation.tsx`：680×60 顶部导航和 GitHub 链接。
- `HeroPcBackground.tsx`：官网首屏的官方 Magic Rings 外层容器。
- `MagicRings.tsx` / `MagicRings.css`：直接复用 React Bits 官方 Magic Rings 源码和样式。
- `hero-ring-config.ts`：按 Magic Rings Basic 面板保存的背景参数。
- `hero-pc.css`：只包含新版首屏样式。

Figma 锚点：

- 导航：680×60，顶部 29px。
- 产品标记：128×128，顶部 240px。
- 标题：70px，顶部 400px。
- 副标题：24px / 40px，两行，宽 806px，顶部 514px。
- CTA：320×70，顶部 654px，圆角 24px。

## 切图规则与已导出资源

首屏命名为「切图文件」的图层必须优先作为切图来源，并按 2 倍显示场景处理。由于本次命中的资源都是矢量 SVG，使用 SVG 而不是 PNG，以保留透明边缘和 2× 清晰度。

- `640:6595`「切图文件」：产品标记，128×128。
- `640:6616`「切图文件」：GitHub 图标，32×32。
- `640:6608`「Frame」：立即体验按钮箭头，32×32。

本地资源：`src/assets/figma/hero-pc/`。来源、节点 ID、格式和渲染尺寸记录在 `manifest.json`，资源格式测试位于 `heroAssets.test.ts`。

## 当前背景参数

`src/pages/home/hero-pc/hero-ring-config.ts` 按 Magic Rings 页面链接配置，当前 URL 参数为 `ringCount=9&speed=0.8`，其余参数沿用已确认的 Customize 配置：

- 颜色：`#a855f7` / `#6366f1`
- 环数：9；速度：0.8；衰减：10
- 线宽：2；基础半径：0.35；半径步进：0.1；环间距：1.5
- 缩放速率：0.1；透明度：1；模糊：0；噪声：0.1
- 旋转：0；淡入：0.7；淡出：0.5
- 鼠标影响：0.2；悬停缩放：1.2；视差：0.05
- 跟随鼠标：关闭；点击爆发：关闭

官方来源：

- <https://reactbits.dev/animations/magic-rings?ringCount=9&speed=0.8>
- <https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/MagicRings/MagicRings.tsx>

## 已验证命令

```bash
npm test
npm run build
npm run e2e
```

E2E 使用新副本的 5174 端口，覆盖 Chromium 和 WebKit 的 1440×800 PC 首屏、无横向溢出和 CTA 未配置下载地址时的提示。

## 本地运行

```bash
cd /Users/luojie/Documents/Notch官网/.worktrees/website-hero-pc
npm install
npm run dev -- --host 0.0.0.0 --port 5174
```

## 后续顺序

1. 继续对比首屏背景环形中心、密度和发光强度。
2. 完成 PC 第二屏 MacBook 三层结构。
3. 只实现 Music 模块并对齐 Figma。
4. 再补其他模块、FAQ、联系区和 H5。
