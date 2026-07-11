# Notch 官网 Web 项目交接文档

更新时间：2026-07-11

## 当前结论

本轮停止继续追求视觉还原。当前工程保留了 Web 项目的基础框架、响应式结构、交互状态和测试基础，但现有页面的视觉还原度不达标，不能作为最终设计实现继续微调。

下一轮应当以 Figma 截图和节点结构为唯一视觉依据，按屏幕逐块重新实现。建议先完成首屏，再完成 PC 第二屏，再补 H5，不要继续在当前近似样式上叠加修补。

## 工程位置

- Git 分支：`website`
- Worktree：`/Users/luojie/Documents/Notch官网/.worktrees/website`
- 主工程：`/Users/luojie/Documents/Notch官网`
- macOS 原生参考工程：`/Users/luojie/Documents/Codex/Notch/NotchToolbox/NotchToolbox.xcodeproj`

当前 Web 工程是独立项目，与 macOS 原生工程没有代码依赖。原生工程只用于参考模块行为和动效节奏。

## 可以保留的框架代码

### 基础工程

- Vite + React + TypeScript
- `src/App.tsx` 页面入口
- `src/config/site.ts` 文案和环境变量入口
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/responsive.css`
- `vite.config.ts` 中的 Three.js 分包配置
- `playwright.config.ts`

### 响应式和状态基础

- `src/types/modules.ts`
  - 模块类型
  - Web 端 Notch 尺寸契约
  - 移动端断点判断
- `src/hooks/useResponsiveCanvas.ts`
- `src/hooks/useScrollProgress.ts`
- `src/hooks/useCountdown.ts`
- `src/hooks/useTypewriter.ts`
- `src/hooks/useModuleReplay.ts`
- `src/components/mockup/notchState.ts`

当前 Web 端规格尺寸：

| 模块 | 宽度 | 高度 |
| --- | ---: | ---: |
| Music | 290 | 60 |
| File Stash | 290 | 60 |
| AI Chat | 290 | 200 |
| Clipboard | 290 | 90 |
| Pomodoro | 290 | 148 |

这些是设计稿缩放后的 Web 尺寸，不是原生 macOS 工程中的 2 倍尺寸。

### 组件外壳

以下组件可以保留为页面结构和交互骨架，但内部视觉需要重做：

- `src/components/hero/HeroSection.tsx`
- `src/components/hero/FloatingNav.tsx`
- `src/components/hero/MagicRingsBackground.tsx`
- `src/components/mockup/MacBookMockup.tsx`
- `src/components/mockup/NotchChrome.tsx`
- `src/components/mockup/ModuleTabs.tsx`
- `src/components/mockup/NotchModuleContent.tsx`
- `src/components/faq/FAQSection.tsx`
- `src/components/contact/ContactSection.tsx`
- `src/components/ui/Toast.tsx`

### 测试基础

当前测试覆盖了：

- 模块尺寸契约
- 响应式缩放
- 滚动导航插值
- Notch 状态切换
- 计时、打字机、左右回放动画
- FAQ 展开
- 邮箱复制和 fallback
- Chromium/WebKit 的 PC/H5 基础交互
- 图片格式签名

测试文件位于 `src/**/*.test.*` 和 `tests/e2e/home.spec.ts`。

## 当前实现不应直接作为最终视觉使用的部分

### 首屏

`MagicRingsBackground` 是根据 React Bits Magic Rings 思路改写的运行时背景，只能作为技术接入参考。当前颜色、密度、位置、动画和设计稿不一致，需要重新对照 Figma 调整。

首屏背景仍然不应该从 Figma 切图。设计要求是使用开源运行时效果实现。

### MacBook Mockup

`MacBookMockup` 当前主要使用 PC 图层，布局比例和层级只是框架实现。H5 图层尚未完成真正的响应式接入。

`pc-notch-bg.png`、`h5-notch-bg.png` 已经导出并修复为真正的 PNG，但当前 Notch 内容外壳没有完整使用这些图层。下一轮需要重新检查 Figma 中的层级关系：

1. MacBook 最底图
2. Notch 可变内容
3. 摄像头和刘海外壳

### 五种模块内容

当前五个模块是基于文字和 CSS 的近似 Demo：

- `src/modules/music/MusicModule.tsx`
- `src/modules/file-stash/FileStashModule.tsx`
- `src/modules/ai-chat/AIChatModule.tsx`
- `src/modules/clipboard/ClipboardModule.tsx`
- `src/modules/pomodoro/PomodoroModule.tsx`

它们的状态动画和尺寸可参考，但卡片、间距、字号、图标、阴影、渐变和真实内容都需要依据 Figma 重新实现。

### FAQ 和联系区

FAQ、联系区、复制 Toast 已有功能骨架，但不代表已完成设计稿还原。可以保留交互逻辑，重新替换布局和视觉样式。

## 素材注意事项

Figma MCP 返回的部分素材内容是 SVG，但原先被错误地保存成 `.png`。本轮已经将结构素材转换成真正的 PNG，并保持原文件名，当前素材可以直接预览和覆盖：

- `src/assets/figma/pc-body.png`
- `src/assets/figma/pc-screen-body.png`
- `src/assets/figma/pc-notch-bg.png`
- `src/assets/figma/h5-body.png`
- `src/assets/figma/h5-screen-body.png`
- `src/assets/figma/h5-notch-bg.png`
- `src/assets/figma/h5-product-mark.png`

真实 PNG 壁纸：

- `src/assets/figma/pc-wallpaper.png`
- `src/assets/figma/h5-wallpaper.png`

如果下一轮重新从 Figma 导出，请先执行：

```bash
file src/assets/figma/*
```

确认 `.png` 是 PNG，`.svg` 是 SVG，不要只根据下载链接名称判断格式。

## 设计参考

- 首屏和 PC 设计稿：<https://www.figma.com/design/sPAqmRh7r6Z8K2sXtQtjye/VibeCoding?node-id=635-6584>
- Tab 切换设计稿：<https://www.figma.com/design/sPAqmRh7r6Z8K2sXtQtjye/VibeCoding?node-id=635-6586>
- 需求文档：`/Users/luojie/Downloads/Notch官网.md`
- 过渡效果规格：`/Users/luojie/Desktop/Notch 功能切换过渡效果 — 实现规格.md`

## 已验证命令

在当前 worktree 中：

```bash
npm test
npm run build
npm run e2e
```

当前结果：16 个单元测试通过，Chromium/WebKit 10 个端到端场景通过，构建通过。需要注意：这些测试主要证明框架和交互工作，不证明视觉已经达到设计稿 1:1。

## 本地运行

```bash
cd /Users/luojie/Documents/Notch官网/.worktrees/website
npm install
npm run dev
```

然后打开 Vite 输出的本地地址，通常是：<http://127.0.0.1:5173/>。

不要双击 `index.html`，也不要使用其他项目的 `localhost:51600` 地址代替当前 Vite 地址。

## 下一轮建议顺序

1. 重新读取 Figma 首屏节点和截图，确认真实画布尺寸、导航尺寸、字体和间距。
2. 只实现首屏静态结构与运行时背景，先通过截图对齐。
3. 重新处理 PC Mockup 三层结构，确认外壳和 Notch 的实际边界。
4. 只实现 Music 一个模块，完成尺寸、字体、图标和动效后再复制模式到其他模块。
5. 再补 File、AI Chat、Clipboard、Pomodoro。
6. 最后实现 H5，并用 375、390、420 宽度逐一校准。

下一次对话可以直接说明：

> 继续 `/Users/luojie/Documents/Notch官网/.worktrees/website` 的 Notch 官网项目。请以 Figma 为唯一视觉依据，保留现有框架，但从首屏开始重新做 1:1 视觉还原，不要继续沿用当前近似样式。

