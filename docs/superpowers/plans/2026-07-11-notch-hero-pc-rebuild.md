# Notch Hero PC Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the copied project’s existing page visuals with a new 1440×800 PC hero that matches Figma node `640:6587`, including the top navigation, runtime ring background, and locally stored 2×-ready vector assets.

**Architecture:** Keep the existing Vite/React/TypeScript shell and site configuration, but replace the rendered page surface with a focused `src/pages/home/hero-pc/` feature. The hero background is an isolated Three.js runtime layer; content, navigation, and CTA are ordinary DOM so they remain accessible and clickable. Figma layers named `切图文件` are exported locally as SVG because all three inspected assets are vector artwork with transparent fills; the CSS renders them at the Figma dimensions while preserving vector resolution for 2× displays.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Three.js, Vitest, Testing Library, Playwright/browser visual checks.

---

### Task 1: Add the exact Figma hero assets and asset contract

**Files:**
- Create: `src/assets/figma/hero-pc/product-mark.svg`
- Create: `src/assets/figma/hero-pc/github.svg`
- Create: `src/assets/figma/hero-pc/cta-arrow.svg`
- Create: `src/assets/figma/hero-pc/manifest.json`
- Create: `src/assets/figma/hero-pc/heroAssets.test.ts`

- [ ] **Step 1: Write the failing asset test.**

Create `src/assets/figma/hero-pc/heroAssets.test.ts`:

```ts
import { readFileSync } from "node:fs";

const assets = [
  ["product-mark.svg", 'viewBox="0 0 128 128"'],
  ["github.svg", 'viewBox="0 0 32 32"'],
  ["cta-arrow.svg", 'viewBox="0 0 32 32"'],
] as const;

describe("hero Figma assets", () => {
  it("keeps the exported vector dimensions for the named Figma cut layers", () => {
    for (const [filename, viewBox] of assets) {
      const source = readFileSync(new URL(filename, import.meta.url), "utf8");
      expect(source).toContain("<svg");
      expect(source).toContain(viewBox);
    }
  });
});
```

- [ ] **Step 2: Run the test and verify it fails.**

Run `npm test -- src/assets/figma/hero-pc/heroAssets.test.ts`.

Expected: FAIL because the three local SVG files do not exist yet.

- [ ] **Step 3: Save the Figma exports locally.**

Copy the inspected Figma asset responses into the three files:

```bash
mkdir -p src/assets/figma/hero-pc
curl -L --fail --silent --show-error -o src/assets/figma/hero-pc/product-mark.svg "https://www.figma.com/api/mcp/asset/bb3d77b8-d2bb-496c-903e-fd48fa1060c1"
curl -L --fail --silent --show-error -o src/assets/figma/hero-pc/cta-arrow.svg "https://www.figma.com/api/mcp/asset/82769a38-6e6c-410c-8193-49fbc5f5300d"
curl -L --fail --silent --show-error -o src/assets/figma/hero-pc/github.svg "https://www.figma.com/api/mcp/asset/e5ba40c3-7c9f-4a86-868b-19b844cbc602"
```

The product mark comes from Figma layer `640:6595` named `切图文件`; the GitHub icon comes from layer `640:6616` named `切图文件`; the CTA arrow comes from child layer `640:6608`. Keep the original source reference in `manifest.json`:

```json
{
  "frame": { "fileKey": "sPAqmRh7r6Z8K2sXtQtjye", "nodeId": "640:6587" },
  "exports": {
    "productMark": { "nodeId": "640:6595", "name": "切图文件", "format": "svg", "renderWidth": 128, "renderHeight": 128, "source": "https://www.figma.com/api/mcp/asset/bb3d77b8-d2bb-496c-903e-fd48fa1060c1" },
    "github": { "nodeId": "640:6616", "name": "切图文件", "format": "svg", "renderWidth": 32, "renderHeight": 32, "source": "https://www.figma.com/api/mcp/asset/e5ba40c3-7c9f-4a86-868b-19b844cbc602" },
    "ctaArrow": { "nodeId": "640:6608", "name": "Frame", "format": "svg", "renderWidth": 32, "renderHeight": 32, "source": "https://www.figma.com/api/mcp/asset/82769a38-6e6c-410c-8193-49fbc5f5300d" }
  }
}
```

- [ ] **Step 4: Run the asset test and inspect the files.**

Run `npm test -- src/assets/figma/hero-pc/heroAssets.test.ts` and `file src/assets/figma/hero-pc/*.svg`.

Expected: the test passes and all three files are SVG documents. SVG is the correct format because each source is vector artwork; it preserves the requested 2× sharpness without adding raster blur.

- [ ] **Step 5: Commit the asset slice.**

```bash
git add src/assets/figma/hero-pc
git commit -m "feat: add hero pc figma assets"
```

### Task 2: Remove the copied page visuals and create the new hero test surface

**Files:**
- Delete: `src/components/hero/FloatingNav.tsx`
- Delete: `src/components/hero/HeroSection.tsx`
- Delete: `src/components/hero/MagicRingsBackground.tsx`
- Delete: `src/components/hero/hero.css`
- Delete: `src/components/mockup/`
- Delete: `src/components/faq/`
- Delete: `src/components/contact/`
- Delete: `src/components/ui/`
- Delete: `src/modules/`
- Delete: `src/styles/modules.css`
- Delete: `src/hooks/useCountdown.ts`
- Delete: `src/hooks/useModuleReplay.ts`
- Delete: `src/hooks/useScrollProgress.ts`
- Delete: `src/hooks/useTypewriter.ts`
- Delete: `src/types/modules.ts`
- Delete: `src/types/modules.test.ts`
- Delete: `src/hooks/useResponsiveCanvas.ts`
- Delete: `src/hooks/useResponsiveCanvas.test.ts`
- Delete: `src/hooks/useScrollProgress.test.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/responsive.css`

- [ ] **Step 1: Replace the app test with the new surface contract.**

Update `src/App.test.tsx` so it asserts only the new PC hero contract:

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("Hero PC surface", () => {
  it("renders the Figma hero content and navigation", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "随手可用的效率入口" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "立即体验Demo" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused test and verify the old surface fails the new contract.**

Run `npm test -- src/App.test.tsx`.

Expected: FAIL because the old page still uses the previous component tree and the new hero test expects the replacement surface.

- [ ] **Step 3: Remove the old visual feature directories and update global styles.**

Delete the listed visual components, modules, and old feature-specific hooks/types. Keep `src/config/site.ts`, `src/main.tsx`, `src/test/setup.ts`, `src/styles/tokens.css`, and the Vite/test configuration. Replace `src/App.tsx` with:

```tsx
import { HeroPcPage } from "./pages/home/hero-pc/HeroPcPage";

export function App() {
  return (
    <main className="site-shell">
      <HeroPcPage />
    </main>
  );
}
```

Keep `body` overflow-x hidden and set the desktop shell to a minimum height of 800px with the Figma background. Do not keep old feature selectors in the global stylesheet.

- [ ] **Step 4: Run TypeScript to expose the replacement component gap.**

Run `npm test -- src/App.test.tsx`.

Expected: the test still fails with a missing `HeroPcPage` module; Task 3 supplies that module.

### Task 3: Implement the new Figma-based hero PC components

**Files:**
- Create: `src/pages/home/hero-pc/HeroPcPage.tsx`
- Create: `src/pages/home/hero-pc/HeroPcNavigation.tsx`
- Create: `src/pages/home/hero-pc/HeroPcBackground.tsx`
- Create: `src/pages/home/hero-pc/hero-pc.css`
- Modify: `src/config/site.ts`

- [ ] **Step 1: Add the new component implementations.**

`HeroPcNavigation.tsx` must render a 680×60 navigation with `EasyNotch` at 32px from the left and the local GitHub SVG at 616px from the left. `HeroPcPage.tsx` must render the local product mark, exact Figma text, the 320×70 CTA with the local arrow SVG, and a polite status message when no download URL is configured. `HeroPcBackground.tsx` must own the Three.js canvas, run only while visible, keep `pointer-events: none`, and provide a CSS ring fallback when WebGL is unavailable or reduced motion is requested.

The page composition must have this shape:

```tsx
<section className="hero-pc" aria-labelledby="hero-pc-title">
  <HeroPcBackground />
  <HeroPcNavigation />
  <div className="hero-pc__content">
    <img className="hero-pc__product-mark" src={productMark} alt="" />
    <h1 id="hero-pc-title">{SITE_COPY.heroTitle}</h1>
    <p>{SITE_COPY.heroDescription[0]}<br />{SITE_COPY.heroDescription[1]}</p>
    <button type="button" onClick={handleDemoClick}>...</button>
  </div>
</section>
```

- [ ] **Step 2: Add the exact layout and interaction CSS.**

Use a 1441px reference canvas centered in the viewport, with these declarations as the desktop source of truth:

```css
.hero-pc { position: relative; width: 100%; min-height: 800px; overflow: hidden; background: #060508; isolation: isolate; }
.hero-pc__content { position: relative; z-index: 1; display: flex; min-height: 800px; flex-direction: column; align-items: center; padding-top: 240px; text-align: center; }
.hero-pc__product-mark { width: 128px; height: 128px; display: block; }
.hero-pc h1 { margin: 32px 0 0; font-size: 70px; line-height: 98px; font-weight: 600; color: #fff; }
.hero-pc p { width: 806px; margin: 16px 0 44px; color: #fff; font-size: 24px; line-height: 40px; font-weight: 400; }
.hero-pc__cta { width: 320px; height: 70px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; border-radius: 24px; background: rgba(255,255,255,.1); color: #fff; font-size: 24px; line-height: 40px; font-weight: 500; }
.hero-pc__navigation { position: absolute; z-index: 3; top: 29px; left: 50%; width: 680px; height: 60px; transform: translateX(-50%); }
```

The navigation uses `rgba(255,255,255,.05)`, 24px radius, 20px Medium brand text, and the local 32px GitHub SVG. Hover adds 10% white; active adds 10% black. Do not add the old scroll-width interpolation.

- [ ] **Step 3: Implement the runtime background with conservative defaults.**

Use the existing `three` dependency only inside `HeroPcBackground.tsx`. Render six evenly spaced blue rings centered around the Figma hero’s visual center, with low-opacity glow and a slow time uniform. The canvas must be behind DOM content, `aria-hidden="true"`, and `pointer-events: none`. On cleanup dispose the renderer, geometry, and material. When the browser lacks WebGL, render `.hero-pc__rings-fallback` using concentric CSS rings.

- [ ] **Step 4: Wire the site configuration.**

Keep `SITE_COPY` values unchanged. Read `VITE_DOWNLOAD_URL` via `getDownloadUrl()`. If absent, set a `role="status"` message to `体验包暂未开放下载` for 2200ms; if present, call `window.open(url, "_blank", "noopener,noreferrer")`. Preserve the existing configured `VITE_GITHUB_URL` behavior.

- [ ] **Step 5: Run focused tests and build.**

Run `npm test -- src/App.test.tsx src/assets/figma/hero-pc/heroAssets.test.ts` and `npm run build`.

Expected: the new surface and asset tests pass, and Vite builds without references to deleted old visual modules.

- [ ] **Step 6: Commit the new hero implementation.**

```bash
git add src/App.tsx src/App.test.tsx src/config/site.ts src/pages src/styles src/assets/figma/hero-pc
git commit -m "feat: rebuild hero pc from figma"
```

### Task 4: Verify the 1440×800 render against the Figma screenshot

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Modify: `docs/NOTCH_WEBSITE_HANDOFF.md`

- [ ] **Step 1: Replace the old multi-screen E2E assumptions.**

Change the desktop browser test to assert the new hero only: viewport 1440×800, heading visible, navigation visible, no horizontal overflow, and the CTA fallback status after clicking when no download URL is configured. Remove assertions for old Notch tabs and deleted FAQ/contact features.

- [ ] **Step 2: Run the browser verification.**

Start the new worktree with `npm run dev -- --host 0.0.0.0 --port 5174`, open `http://localhost:5174/` at 1440×800, and capture a screenshot. Compare it with the Figma screenshot for node `640:6587`, checking the navigation rectangle, product mark, title baseline, subtitle line spacing, CTA position, background ring center, and absence of horizontal overflow.

- [ ] **Step 3: Make only measured visual adjustments.**

Adjust only the new `hero-pc.css` and `HeroPcBackground.tsx` parameters. Keep the Figma anchor coordinates unchanged unless the screenshot comparison shows a measurable browser-font difference. Do not reintroduce any old component or CSS selector.

- [ ] **Step 4: Run the complete verification suite.**

Run:

```bash
npm test
npm run build
npm run e2e
```

Expected: all unit tests pass, the production build succeeds, and the desktop hero E2E passes.

- [ ] **Step 5: Update the handoff and commit verification.**

Document the new worktree, the exact Figma node, the two `切图文件` layer IDs, the SVG choice, and the current scope in `docs/NOTCH_WEBSITE_HANDOFF.md`, then commit:

```bash
git add tests/e2e/home.spec.ts docs/NOTCH_WEBSITE_HANDOFF.md
git commit -m "test: verify rebuilt hero pc"
```
