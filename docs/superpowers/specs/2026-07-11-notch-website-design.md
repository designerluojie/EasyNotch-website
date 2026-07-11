# Notch 官网设计方案

## 1. 项目定位

这是一个独立的 Web 官网项目，不修改也不编译 macOS 原生 NotchToolbox 工程。

- Figma 官网稿是页面布局和视觉尺寸的最终依据。
- macOS SwiftUI 工程只作为刘海内容、文字、交互和动画逻辑的参考。
- 官网第二屏展示的是缩放后的刘海内容，不能直接把 macOS 工程中的 2 倍面板尺寸作为 Web CSS 尺寸。
- 首屏蓝色环形背景必须由运行时动画组件绘制，不能从 Figma 导出为背景图。

## 2. 技术方案

采用 React + Vite + TypeScript，配合 React Bits 和 Motion：

- React：管理页面和模块状态。
- Vite：适合当前纯展示型官网，启动和部署简单。
- TypeScript：为模块状态、尺寸表和动画配置提供约束。
- React Bits Magic Rings：实现首屏运行时环形背景。
- Motion：实现滚动导航、刘海容器 spring 形变和 FAQ 展开动画。
- CSS/DOM：实现刘海内部内容，避免把动态功能做成整张图片。

## 3. 页面结构

```text
App
├── HeroSection
│   ├── MagicRingsBackground
│   ├── FloatingNav
│   ├── ProductMark
│   ├── HeroCopy
│   └── DemoButton
├── ProductShowcaseSection
│   ├── MacBookMockup
│   │   ├── MacBookHardwareLayer
│   │   ├── ScreenWallpaperLayer
│   │   └── NotchLayer
│   │       ├── NotchChrome
│   │       └── NotchModuleContent
│   └── ModuleTabs
├── FAQSection
└── ContactSection
```

模块内容独立于 MacBook 外壳。切换 Tab 时只更新 `NotchModuleContent` 和容器目标尺寸，MacBook 外壳、屏幕壁纸和摄像头层保持稳定。

## 4. 尺寸与响应式规则

### PC

- 页面设计宽度固定为 1440px。
- 视口大于 600px 时使用 PC 布局。
- 小于视口宽度的部分由页面外层背景填充，不拉伸 1440px 内容。
- 首屏导航从初始约 680px 宽，在滚动 0～500px 内扩展到 1000px。

### H5

- 基准宽度为 375px。
- 375～420px 之间，页面内容按比例缩放。
- 超过 420px 后，内容缩放比例保持在 420px 对应比例，只拉伸背景。
- 超过 600px 后切换到 PC 布局。
- 移动端根节点通过 `ResizeObserver` 计算缩放比例，避免依赖浏览器对 CSS 除法计算的差异。
- 使用 safe-area inset 处理 iPhone 安全区域。

## 5. 首屏背景与交互

### 背景

首屏蓝色环形背景使用 React Bits Magic Rings 运行时绘制，并根据 Figma 调整：

- 环形中心位置。
- 环形半径和间距。
- 蓝色发光强度。
- 透明度和模糊程度。
- PC/H5 的响应式参数。

Figma 中的 Union、Rectangle 25、Rectangle 26 不进入官网静态资源清单。

背景层不接收鼠标事件，避免影响按钮和导航操作。组件离开视口时暂停或降低更新频率；用户开启 `prefers-reduced-motion` 时切换到低动态模式，仍保持 CSS/运行时绘制，不使用背景截图替代。

### 导航

- 初始状态显示 EasyNotch 和 GitHub。
- 监听页面滚动，在 0～500px 内插值计算宽度。
- Logo 与立即体验按钮从左右两侧进入。
- 玻璃效果使用半透明背景与 `backdrop-filter`，Safari 使用带前缀写法和纯色降级。
- Hover 叠加 10% 白色，Active 叠加 10% 黑色。

### 立即体验

按钮读取 `VITE_DOWNLOAD_URL` 配置：

- 有有效地址时打开下载地址。
- 未配置时显示“体验包暂未开放下载”，不发起无效请求。
- 下载服务端使用附件响应，避免 Safari 只打开新标签页而不下载。

## 6. 第二屏刘海内容

官网 Figma 节点使用缩放后的视觉尺寸，最终 Web 刘海尺寸如下：

| 模块 | Web 宽度 | Web 高度 | macOS 参考来源 |
|---|---:|---:|---|
| 音乐 | 290 | 60 | MusicPlaybackContentView、MusicPlaybackControlsView |
| 文件暂存 | 290 | 60 | FileStashModuleView |
| AI Chat | 290 | 200 | AIChatModuleView、AIChatConversationView |
| 剪贴板 | 290 | 90 | ClipboardModuleView、ClipboardLayout |
| 番茄钟 | 290 | 148 | PomodoroModuleView、PomodoroPresentation |

原生工程中的 `580px` 左右尺寸是 2 倍参考值，官网不直接使用。

### 通用容器

- 黑色圆角容器固定宽度 290px。
- 高度根据当前模块状态改变。
- 内容顶部对齐。
- `overflow: hidden` 和圆角裁剪内容。
- 内容直接替换，不使用新旧内容交叉淡入。
- 切换动画时长默认 0.2s，spring bounce 默认 0.42；收缩时使用较弱回弹。
- 连续快速点击时，动画目标更新为最新 Tab，不排队播放旧动画。

### 音乐

- 展示封面、歌名、歌手、进度条和控制按钮。
- 进度条平滑移动，时间文本按秒更新。
- 演示状态 60 秒后回到初始进度。
- 内容和控制按钮均使用 DOM/CSS，图标使用可复用资源。

### 文件暂存

- 展示文件缩略图、名称和类型。
- 切换到文件时，内容整体向左移动约 80px，再回到初始位置。
- 不接入本地文件系统，仅模拟展示。

### AI Chat

- 保持内容高度 200px。
- 先显示右侧用户气泡。
- 再逐字显示左侧 AI 回复。
- 输入框和模型操作栏按 Figma 的缩放尺寸模拟。
- 不接入真实模型 API。

### 剪贴板

- 展示多张横向剪贴板卡片。
- 切换时模拟内容向左移动约 80px，再回到初始位置。
- 不读取浏览器真实剪贴板，只展示演示数据。

### 番茄钟

- 展示进度环、倒计时和操作按钮。
- 默认模拟 25 分钟专注状态。
- 页面演示可使用加速计时，但视觉状态保持与真实倒计时一致。

## 7. 第三屏和第四屏

### FAQ

- 五个模块均可点击展开。
- 默认展开“关于音乐”，其余折叠。
- 展开和收起使用高度 spring 动画。
- 同一时间允许多个条目展开，避免强制改变用户阅读状态。

### 联系方式

- 点击邮箱使用 Clipboard API 复制文本。
- 成功后从顶部显示 Toast。
- Clipboard API 失败时使用隐藏文本框选中复制的降级方式，并显示相同成功提示。

## 8. 浏览器兼容策略

兼容基线：

- Chrome 当前版本及前两个大版本。
- Safari macOS 当前版本及前两个大版本。
- Safari iOS/iPadOS 当前版本及前两个大版本。
- IE11 及以下不纳入支持范围。

降级规则：

- 不支持 `backdrop-filter` 时，使用半透明纯色背景。
- 用户开启减少动态时，暂停或降低 Magic Rings 动画和模块演示动画。
- Safari 移动端使用 `svh`/`dvh`，同时保留 `vh` 回退值。
- 复制操作必须由点击触发，并捕获权限失败。
- 避免使用复杂 CSS mask 和 `clip-path:path()`，刘海外壳用资源图，内部用普通圆角裁剪。

## 9. 验证方案

### 视觉验证

- PC：1440px 宽度下与 Figma 页面节点对比。
- H5：375px、390px、420px 三个宽度对比。
- 第二屏分别验证音乐、文件、AI Chat、剪贴板、番茄钟五个状态。
- 重点检查刘海外壳、内容裁剪、MacBook 屏幕和 Tab 对齐关系。

### 交互验证

- 滚动导航在 0px、250px、500px 三个位置。
- 五个 Tab 连续快速切换。
- AI Chat 逐字动画中途切换 Tab。
- FAQ 展开、收起和连续点击。
- Chrome/Safari 下下载、复制和 Toast。

### 性能验证

- Magic Rings 不遮挡交互层。
- 页面离开首屏后降低背景动画开销。
- 低动态模式下无持续高频动画。
- Safari iPhone 滚动时不出现明显掉帧或页面横向溢出。

## 10. 实施边界

本项目只实现官网演示，不实现以下 macOS 原生能力：

- 真实系统播放器控制。
- 真实文件拖拽和文件暂存。
- 真实系统剪贴板历史。
- 真实 AI 模型调用。
- 真实番茄钟后台计时。

这些能力只通过演示状态和动画表现出来。
