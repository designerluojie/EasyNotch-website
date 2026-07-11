# Notch 官网首屏 PC 重搭设计规格

## 目标

在新的 `rebuild/hero-pc` worktree 中，保留当前 Web 工程的运行、构建、测试和配置底层，移除现有页面视觉实现，基于 Figma 节点 `640:6587` 重新实现 1440×800 的 PC 首屏与顶部导航。

## 范围

本轮只实现首屏 PC 视觉，不实现 H5、不实现第二屏 MacBook 展示、不实现 FAQ 和联系区。旧工程 `/Users/luojie/Documents/Notch官网/.worktrees/website` 保持不变，作为历史参考；所有新版改动只发生在 `/Users/luojie/Documents/Notch官网/.worktrees/website-hero-pc`。

## 保留与移除

保留 Vite、React、TypeScript、测试配置、环境变量读取、资源清单和通用测试工具。移除新副本中旧 Hero、旧浮动导航、旧 Magic Rings shader、MacBook/Notch/FAQ/Contact 页面视觉组件及其页面样式；`App` 只挂载本轮新的首屏组件。

新版组件放在 `src/pages/home/hero-pc/`，避免继续复用旧视觉组件名和旧 CSS 选择器。首屏组件只依赖站点文案配置、运行时背景组件和本地导出的 Figma 图标资源。

## Figma 视觉基准

Figma 文件：`sPAqmRh7r6Z8K2sXtQtjye`；目标节点：`640:6587`；基准画布：`1441×800`。

- 页面背景：`#060508`。
- 产品标记：图层 `640:6595`，128×128，水平居中，顶部 240px。
- 标题：图层 `640:6604`，PingFang SC Semibold，70px，白色，顶部 400px，水平居中。
- 副标题：图层 `640:6605`，PingFang SC Regular，24px，40px 行高，宽 806px，顶部 514px，居中，两行文案保持配置中的原文。
- CTA：图层 `640:6606`，320×70，顶部 654px，圆角 24px，背景 `rgba(255,255,255,0.1)`；文字为 24px Medium；箭头使用子图层 `640:6608` 的 32×32 导出资源。
- 顶部导航：图层 `640:6612`，680×60，顶部 29px，圆角 24px，背景 `rgba(255,255,255,0.05)`；左侧品牌文字图层 `640:6613` 为 20px Medium；右侧 GitHub 图标使用图层 `640:6616` 的 32×32 导出资源。

导出的资源保存到新副本的 `src/assets/figma/hero-pc/`，并在 `manifest.json` 中保留原始 Figma 资源 URL 和节点 ID。资源使用本地文件，避免依赖短期 URL。

## 背景策略

首屏背景不使用 Figma 中的 Union、Rectangle 25、Rectangle 26 静态截图。使用第三方 Magic Rings 运行时组件的默认实现作为第一版基础，再只调整容器尺寸、环形中心、颜色透明度和发光强度，使 1440×800 截图接近 Figma。背景层必须 `aria-hidden`、`pointer-events: none`，不能遮挡导航和 CTA。

新版不会复用当前手写的 Three.js shader 参数。背景组件与首屏内容分层，背景更新失败时提供低动态 CSS fallback；`prefers-reduced-motion` 下停用持续动画但保留环形视觉。

## 组件边界

- `HeroPcPage.tsx`：首屏组合与 CTA 未配置下载地址时的提示状态。
- `HeroPcNavigation.tsx`：静态 680×60 顶部导航，品牌文字和 GitHub 外链。
- `HeroPcBackground.tsx`：第三方 Magic Rings 默认运行时背景及降级逻辑。
- `hero-pc.css`：只包含新首屏的布局、字体、颜色、玻璃效果和交互状态。

首屏不加入滚动展开导航、H5 缩放、后续页面占位和模块切换逻辑，避免把后续屏幕的视觉假设带入本轮。

## 验证标准

- `npm test` 全部通过。
- `npm run build` 成功。
- 1440×800 截图中首屏没有横向溢出，内容位置与 Figma 基准一致。
- 背景不拦截导航和 CTA 点击。
- CTA 在存在 `VITE_DOWNLOAD_URL` 时打开地址；未配置时显示“体验包暂未开放下载”。
- GitHub 图标链接使用现有站点配置，不伪造新地址。
- 新版不引用旧 Hero、旧导航或旧 MacBook 视觉组件。
