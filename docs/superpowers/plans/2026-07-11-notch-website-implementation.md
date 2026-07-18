# Notch 官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React/Vite/TypeScript Notch showcase website that matches the supplied Figma PC/H5 layouts and simulates the five Notch module transitions in Chrome and Safari.

**Architecture:** The page is split into four long-form sections. The hero uses a runtime React Bits Magic Rings background behind DOM content. The MacBook mockup uses static Figma-exported hardware/wallpaper layers, while the 290px-wide notch content is DOM/CSS driven by a typed module state machine. Motion handles spring layout changes and FAQ expansion; module-specific timers and replay animations are isolated from the shared shell.

**Tech Stack:** React, Vite, TypeScript, Motion for React, React Bits Magic Rings source, CSS modules or colocated CSS, Vitest, React Testing Library, Playwright for Chromium/WebKit screenshots.

---

## File Map

Create the following files in `/Users/luojie/Documents/Notch官网/.worktrees/website`:

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html` — Vite project and test/build configuration.
- `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx` — application entry, page composition, and initial render smoke test.
- `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/responsive.css` — shared colors, typography, reset, PC/H5 canvas rules, and browser fallbacks.
- `src/types/modules.ts` — module identifiers, dimensions, animation phases, and demo data types.
- `src/config/site.ts` — product copy, contact copy, and `VITE_DOWNLOAD_URL` handling.
- `src/components/hero/MagicRingsBackground.tsx`, `src/components/hero/FloatingNav.tsx`, `src/components/hero/HeroSection.tsx` — runtime hero background, scroll-aware navigation, and first section.
- `src/components/mockup/MacBookMockup.tsx`, `src/components/mockup/NotchChrome.tsx`, `src/components/mockup/NotchModuleContent.tsx`, `src/components/mockup/ModuleTabs.tsx` — second-section visual shell and module switching.
- `src/components/mockup/notchState.ts` — pure module switch reducer and target-size state.
- `src/components/mockup/moduleData.ts` — static demo data and per-module target sizes.
- `src/modules/music/MusicModule.tsx`, `src/modules/file-stash/FileStashModule.tsx`, `src/modules/ai-chat/AIChatModule.tsx`, `src/modules/clipboard/ClipboardModule.tsx`, `src/modules/pomodoro/PomodoroModule.tsx` — five independent notch content renderers.
- `src/hooks/useScrollProgress.ts`, `src/hooks/useModuleReplay.ts`, `src/hooks/useTypewriter.ts`, `src/hooks/useCountdown.ts`, `src/hooks/useResponsiveCanvas.ts` — reusable browser state and timing hooks.
- `src/components/faq/FAQSection.tsx`, `src/components/contact/ContactSection.tsx`, `src/components/ui/Toast.tsx` — third and fourth sections plus reusable toast.
- `src/assets/figma/` — only approved hardware, wallpaper, logo, notch-shell, and icon assets. Do not put the hero Union/Rectangle background assets here.
- `src/test/setup.ts`, `src/**/*.test.ts`, `src/**/*.test.tsx` — unit and component tests.
- `tests/e2e/home.spec.ts`, `playwright.config.ts` — Chromium/WebKit visual and interaction checks.

Do not modify `/Users/luojie/Documents/Codex/Notch/NotchToolbox`.

## Task 1: Scaffold the Web Project and Test Harness

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `src/config/site.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/responsive.css`
- Modify: `.gitignore`

- [ ] **Step 1: Add the dependency and script contract.**

Use React 18+, `react-dom`, `motion`, `vite`, `typescript`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `playwright`. Define scripts named `dev`, `build`, `preview`, `test`, `test:watch`, and `e2e`.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Configure Vite, TypeScript, and the test environment.**

Use a React Vite plugin, strict TypeScript, DOM libraries, and Vitest globals with `jsdom`. Import `src/test/setup.ts` so every test gets `@testing-library/jest-dom` and deterministic animation mocks.

- [ ] **Step 3: Add the minimal app shell and verify the empty baseline.**

Render `<App />` from `src/main.tsx`. Make `App` return a root element with the four section placeholders and no external data dependency. Add `src/App.test.tsx` with a smoke assertion that the root page renders. Add `test-results/` to `.gitignore`. Run:

```bash
npm install
npm test
npm run build
```

Expected: Vitest exits successfully with the smoke test passing, and Vite produces `dist/` successfully.

- [ ] **Step 4: Commit the scaffold.**

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.node.json index.html src
git commit -m "chore: scaffold notch website"
```

## Task 2: Lock Site Tokens, Assets, and Responsive Canvas

**Files:**
- Create: `src/types/modules.ts`
- Create: `src/config/site.ts`
- Create: `src/hooks/useResponsiveCanvas.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/responsive.css`
- Create: `src/components/mockup/moduleData.ts`
- Create: `src/types/modules.test.ts`
- Create: `src/hooks/useResponsiveCanvas.test.ts`
- Create: `src/assets/figma/*`

- [ ] **Step 1: Write failing dimension and breakpoint tests.**

Define the website dimensions as the source of truth and test the exact values:

```ts
expect(MODULE_TARGETS.music).toEqual({ width: 290, height: 60 });
expect(MODULE_TARGETS.fileStash).toEqual({ width: 290, height: 60 });
expect(MODULE_TARGETS.aiChat).toEqual({ width: 290, height: 200 });
expect(MODULE_TARGETS.clipboard).toEqual({ width: 290, height: 90 });
expect(MODULE_TARGETS.pomodoro).toEqual({ width: 290, height: 148 });
expect(layoutModeForWidth(375)).toBe("mobile");
expect(layoutModeForWidth(420)).toBe("mobile");
expect(layoutModeForWidth(600)).toBe("mobile");
expect(layoutModeForWidth(601)).toBe("desktop");
```

- [ ] **Step 2: Run the tests and verify they fail.**

Run `npm test -- src/types/modules.test.ts src/hooks/useResponsiveCanvas.test.ts`. Expected: FAIL because the module types, dimension map, and layout helpers do not exist.

- [ ] **Step 3: Implement typed dimensions and responsive scaling.**

Create `ModuleId` as a union of `music`, `fileStash`, `aiChat`, `clipboard`, and `pomodoro`. Store dimensions in `MODULE_TARGETS`. Implement `layoutModeForWidth` with `width > 600` as desktop. `useResponsiveCanvas` observes the root element and writes a CSS variable `--mobile-scale` clamped to the 375px-to-420px range; it returns `isDesktop`, `scale`, and `ref`.

Use CSS fallbacks in this order:

```css
.mobile-canvas { width: 375px; transform: scale(1); transform-origin: top center; }
@media (min-width: 376px) and (max-width: 600px) {
  .mobile-canvas { transform: scale(var(--mobile-scale, 1)); }
}
@media (min-width: 601px) {
  .mobile-canvas { transform: none; }
}
```

- [ ] **Step 4: Fetch and approve Figma assets before implementation.**

Use the Figma MCP design context and screenshot flow for the exact nodes `635:6584`, `615:5974`, `615:6111`, `625:6232`, `625:6213`, and the named MacBook/Notch layers. Download only hardware, wallpaper, logo, camera/notch chrome, and approved icons. Exclude `Union`, `Rectangle 25`, and `Rectangle 26` from the asset set. Keep the original asset URLs in `src/assets/figma/manifest.json` for traceability.

- [ ] **Step 5: Add tokens and global browser-safe styles.**

Define the dark page background, white text levels, panel fills, border opacity, corner radii, and button interaction overlays. Include `-webkit-backdrop-filter` and `backdrop-filter` behind an `@supports` rule; outside it use a translucent solid background. Add `min-height: 100vh`, `min-height: 100svh`, and `min-height: 100dvh` in progressive declarations. Add `env(safe-area-inset-*)` fallbacks for mobile padding.

- [ ] **Step 6: Run the tests and commit the foundation.**

Run `npm test -- src/types/modules.test.ts src/hooks/useResponsiveCanvas.test.ts`. Expected: all dimension and breakpoint tests pass.

```bash
git add src/types src/config src/hooks src/styles src/assets
git commit -m "feat: add responsive canvas and design tokens"
```

## Task 3: Build the Hero, Runtime Rings, and Scroll Navigation

**Files:**
- Create: `src/components/hero/MagicRingsBackground.tsx`
- Create: `src/components/hero/FloatingNav.tsx`
- Create: `src/components/hero/HeroSection.tsx`
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/hooks/useScrollProgress.test.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write scroll interpolation tests.**

Test clamping and interpolation independently of React:

```ts
expect(scrollProgress(0)).toBe(0);
expect(scrollProgress(250)).toBe(0.5);
expect(scrollProgress(500)).toBe(1);
expect(scrollProgress(900)).toBe(1);
expect(interpolate(680, 1000, 0.5)).toBe(840);
```

- [ ] **Step 2: Run the tests and verify they fail.**

Run `npm test -- src/hooks/useScrollProgress.test.ts`. Expected: FAIL because the helpers do not exist.

- [ ] **Step 3: Implement the runtime background.**

Adapt the React Bits Magic Rings source into `MagicRingsBackground`. Keep it behind all content, set `aria-hidden="true"`, and set `pointer-events: none`. Add an `IntersectionObserver`-controlled `isVisible` flag and a `prefers-reduced-motion` media query so the component pauses or simplifies when appropriate. Do not import the Figma ring assets.

- [ ] **Step 4: Implement the floating navigation.**

Use `useScrollProgress` to interpolate width from 680px to 1000px on desktop over 0～500px. Keep the initial state with EasyNotch and GitHub, then animate the left logo and right demo button into place. On mobile use the fixed 260px × 52px H5 frame. Use DOM buttons/links with the global 10% hover and active overlays.

- [ ] **Step 5: Implement HeroSection and wire the first section.**

Compose runtime rings, product mark, title, two-line subtitle, and demo button. The demo button calls `getDownloadAction()` from `site.ts`; it opens `VITE_DOWNLOAD_URL` when present and otherwise dispatches a visible “体验包暂未开放下载” toast event.

- [ ] **Step 6: Run unit tests and commit.**

Run `npm test -- src/hooks/useScrollProgress.test.ts` and `npm run build`. Expected: all tests pass and the production build succeeds.

```bash
git add src/App.tsx src/components/hero src/hooks/useScrollProgress*
git commit -m "feat: add animated hero and scroll navigation"
```

## Task 4: Build the MacBook Mockup and Shared Notch Shell

**Files:**
- Create: `src/components/mockup/MacBookMockup.tsx`
- Create: `src/components/mockup/NotchChrome.tsx`
- Create: `src/components/mockup/NotchModuleContent.tsx`
- Create: `src/components/mockup/ModuleTabs.tsx`
- Create: `src/components/mockup/notchState.ts`
- Create: `src/components/mockup/notchShell.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the state-machine tests.**

Test that a module switch immediately replaces the content key and targets the new height without queueing old transitions:

```ts
const state = switchModule({ active: "music", pending: null }, "aiChat");
expect(state.active).toBe("aiChat");
expect(state.targetSize).toEqual({ width: 290, height: 200 });
expect(state.pending).toBeNull();
```

Test `ModuleTabs` clicks update the active module and mark the selected button.

- [ ] **Step 2: Run the tests and verify they fail.**

Run `npm test -- src/components/mockup/notchShell.test.tsx`. Expected: FAIL because the shared shell and switch reducer do not exist.

- [ ] **Step 3: Implement the MacBook layers.**

Render hardware, screen wallpaper, and notch layers as separate elements. The hardware and wallpaper use the approved Figma assets; the notch content sits above the wallpaper and below the camera/notch chrome layer. Keep the mockup centered in the PC section and inside the responsive mobile canvas on H5.

- [ ] **Step 4: Implement the springing NotchChrome container.**

Use a `motion.div` with fixed width 290px, animated height from `MODULE_TARGETS`, `overflow: hidden`, and the exact Figma rounded corners. Do not use `AnimatePresence` for the module body; render the new module immediately and let the container reveal it through the height change. Use a dedicated layout transition with approximately 0.2s duration and bounce 0.42 when growing. Keep the pure `switchModule` reducer in `notchState.ts` so it can be tested without Motion.

- [ ] **Step 5: Implement ModuleTabs.**

Render five buttons under the MacBook with active state, hover state, and keyboard focus. Keep the tab bar at the Figma 780px PC width and scale it inside the H5 canvas. Each tab calls the shared switch handler; rapid clicks update the latest target.

- [ ] **Step 6: Run tests and commit the shared shell.**

Run `npm test -- src/components/mockup/notchShell.test.tsx` and `npm run build`. Expected: tests pass and the build succeeds.

```bash
git add src/components/mockup src/App.tsx
git commit -m "feat: add MacBook mockup and notch shell"
```

## Task 5: Implement the Five Notch Modules with Deterministic Demo Timers

**Files:**
- Create: `src/modules/music/MusicModule.tsx`
- Create: `src/modules/file-stash/FileStashModule.tsx`
- Create: `src/modules/ai-chat/AIChatModule.tsx`
- Create: `src/modules/clipboard/ClipboardModule.tsx`
- Create: `src/modules/pomodoro/PomodoroModule.tsx`
- Create: `src/hooks/useModuleReplay.ts`
- Create: `src/hooks/useTypewriter.ts`
- Create: `src/hooks/useCountdown.ts`
- Create: `src/modules/moduleAnimations.test.ts`

- [ ] **Step 1: Write deterministic timer and replay tests.**

Use Vitest fake timers. Test that music advances once per second, AI Chat reveals one additional character per tick, the file/clipboard replay returns to zero, and Pomodoro decrements from the configured demo duration.

```ts
vi.useFakeTimers();
const timer = renderHook(() => useCountdown({ initialSeconds: 1500, running: true }));
vi.advanceTimersByTime(2000);
expect(timer.result.current.remainingSeconds).toBe(1498);
```

- [ ] **Step 2: Run the tests and verify they fail.**

Run `npm test -- src/modules/moduleAnimations.test.ts`. Expected: FAIL because the hooks and module renderers do not exist.

- [ ] **Step 3: Implement MusicModule.**

Use a stable demo track, 0:35 initial elapsed time, 4:12 duration, and a monotonic elapsed clock. Update the text once per second and animate the progress bar smoothly between ticks. Reset after 60 seconds of demo playback. Keep all buttons visual-only except for their hover/active states.

- [ ] **Step 4: Implement FileStashModule and ClipboardModule.**

Create fixed demo cards matching the native app’s visual language. On mount after a module switch, use `useModuleReplay` to animate `translateX(0 → -80px → 0)` inside the clipped content area. Use real DOM text and CSS rounded cards, not screenshots.

- [ ] **Step 5: Implement AIChatModule.**

Render the user bubble immediately, then reveal the AI reply through `useTypewriter`. Keep the module’s outer height at 200px, clip the reply, and reset the typewriter whenever the module becomes active again. Do not call any model API.

- [ ] **Step 6: Implement PomodoroModule.**

Render a 120px progress ring, countdown text, pause/stop controls, and accumulated-focus copy. Use 25 minutes as the logical duration, but expose a demo speed multiplier so screenshot tests do not need to wait 25 real minutes.

- [ ] **Step 7: Run module tests and commit.**

Run `npm test -- src/modules/moduleAnimations.test.ts` and `npm run build`. Expected: all fake-timer tests pass and the production build succeeds.

```bash
git add src/modules src/hooks/useModuleReplay.ts src/hooks/useTypewriter.ts src/hooks/useCountdown.ts
git commit -m "feat: add animated notch module demos"
```

## Task 6: Add FAQ, Contact Copy Toast, and Download Fallback

**Files:**
- Create: `src/components/faq/FAQSection.tsx`
- Create: `src/components/faq/faqData.ts`
- Create: `src/components/contact/ContactSection.tsx`
- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/contact/contact.test.tsx`
- Modify: `src/config/site.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write interaction tests.**

Test that five FAQ rows render, music is initially open, clicking a row toggles its body, and clicking the email invokes the clipboard writer with `easynotch@163.com`. Mock `navigator.clipboard.writeText` and test the fallback path when it rejects.

- [ ] **Step 2: Run the tests and verify they fail.**

Run `npm test -- src/components/contact/contact.test.tsx`. Expected: FAIL because the sections and copy handler do not exist.

- [ ] **Step 3: Implement FAQ with spring height transitions.**

Use the five copy blocks from `Notch官网.md`. Keep multiple rows independently expandable. Use Motion height/layout animation without crossfading the whole page.

- [ ] **Step 4: Implement ContactSection and Toast.**

Render the contact copy and email card. Call `navigator.clipboard.writeText` only from the click handler. If it rejects or is unavailable, create a temporary readonly textarea, select its value, run the browser copy command as a fallback, then remove it. Always show a success or failure toast based on the result.

- [ ] **Step 5: Run tests and commit.**

Run `npm test -- src/components/contact/contact.test.tsx` and `npm run build`. Expected: tests pass and the build succeeds.

```bash
git add src/components/faq src/components/contact src/components/ui src/config/site.ts src/App.tsx
git commit -m "feat: add FAQ contact and copy interactions"
```

## Task 7: Browser QA, Responsive QA, and Performance Hardening

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Modify: `src/components/hero/MagicRingsBackground.tsx`
- Modify: `src/styles/responsive.css`
- Modify: `package.json`

- [ ] **Step 1: Add Playwright smoke and screenshot checks.**

Configure Chromium and WebKit projects. Test PC at 1440px and H5 at 375px, 390px, and 420px. Assert the page has no horizontal overflow, the five module buttons exist, switching to AI Chat changes the notch height to 200px, and copying the email shows a toast.

- [ ] **Step 2: Run the browser tests and capture the baseline.**

Run `npm run e2e`. Expected: Chromium and WebKit tests pass. Save screenshots under an ignored `test-results/` directory and compare them with the Figma screenshots for page structure and notch alignment.

- [ ] **Step 3: Add performance safeguards.**

Pause Magic Rings outside the hero viewport, cap device-pixel-ratio work at a reasonable maximum, remove unnecessary `will-change`, and avoid applying `backdrop-filter` to large nested areas. Ensure animations stop or simplify under `prefers-reduced-motion`.

- [ ] **Step 4: Run the full verification suite.**

Run:

```bash
npm test
npm run build
npm run e2e
git diff --check
git status --short
```

Expected: unit tests, production build, and Chromium/WebKit browser tests pass; `git diff --check` reports no whitespace errors; only intended source and test files are modified.

- [ ] **Step 5: Commit the verified implementation.**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src tests playwright.config.ts
git commit -m "feat: build notch showcase website"
```

## Coverage Checklist

- Hero uses runtime rings and does not export the Figma background.
- PC is fixed at 1440px; H5 uses the 375～420 scaling rule and switches to PC above 600px.
- Figma notch dimensions are 290×60, 290×60, 290×200, 290×90, and 290×148.
- MacBook hardware and wallpaper remain static while notch content changes.
- Tab transitions use immediate DOM replacement, clipping, and spring height morphing.
- Music, file, AI Chat, clipboard, and Pomodoro demos have deterministic behavior.
- FAQ, email copy, Toast, and download fallback are implemented.
- Chrome/Safari visual and interaction checks are included.
