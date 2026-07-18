# Music Playback Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visual-only looping playback animation to the second-screen music Notch module.

**Architecture:** Keep playback constants and pure time helpers in a focused `musicPlayback.ts` module. The `MusicNotch` component owns only the elapsed cycle state and interval lifecycle; CSS owns continuous progress-bar movement through a 60-second linear animation. The existing static Notch layout and scaling canvas remain unchanged.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Playwright.

---

### Task 1: Add playback time helpers with tests

**Files:**
- Create: `src/pages/home/showcase/musicPlayback.ts`
- Create: `src/pages/home/showcase/musicPlayback.test.ts`

- [ ] **Step 1: Write the failing tests**

Create tests for the exported helpers:

```ts
import { describe, expect, it } from "vitest";
import {
  advancePlaybackCycle,
  formatPlaybackTime,
  INITIAL_CURRENT_SECONDS,
} from "./musicPlayback";

describe("music playback helpers", () => {
  it("formats playback time as minutes and zero-padded seconds", () => {
    expect(formatPlaybackTime(INITIAL_CURRENT_SECONDS)).toBe("0:35");
    expect(formatPlaybackTime(36)).toBe("0:36");
    expect(formatPlaybackTime(60)).toBe("1:00");
    expect(formatPlaybackTime(69)).toBe("1:09");
  });

  it("advances one cycle second and returns to zero after 60 ticks", () => {
    expect(advancePlaybackCycle(0)).toBe(1);
    expect(advancePlaybackCycle(58)).toBe(59);
    expect(advancePlaybackCycle(59)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the helper test to verify it fails**

Run:

```bash
npm test -- src/pages/home/showcase/musicPlayback.test.ts
```

Expected: FAIL because `musicPlayback.ts` and its exports do not exist yet.

- [ ] **Step 3: Implement the pure helpers**

Create `musicPlayback.ts` with the fixed playback contract:

```ts
export const INITIAL_CURRENT_SECONDS = 35;
export const CYCLE_SECONDS = 60;
export const INITIAL_PROGRESS_PERCENT = 25;

export function formatPlaybackTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function advancePlaybackCycle(elapsedSeconds: number) {
  return (elapsedSeconds + 1) % CYCLE_SECONDS;
}
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run the same command. Expected: 2 tests pass.

- [ ] **Step 5: Commit the isolated helper change**

```bash
git add src/pages/home/showcase/musicPlayback.ts src/pages/home/showcase/musicPlayback.test.ts
git commit -m "test: add music playback timing helpers"
```

### Task 2: Connect the playback clock to MusicNotch

**Files:**
- Modify: `src/pages/home/showcase/ShowcaseSection.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add the failing component timer assertion**

Update the test imports to include `act` and `vi`, then add a test that renders the app with fake timers and verifies the visible current-time label:

```ts
it("advances the music playback label once per second and resets after one minute", () => {
  vi.useFakeTimers();
  try {
    render(<App />);

    expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:35");

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:36");

    act(() => vi.advanceTimersByTime(59_000));
    expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:35");
  } finally {
    vi.useRealTimers();
  }
});
```

The existing static text assertion should target the same `data-testid` so it remains a stable contract.

- [ ] **Step 2: Run the component test to verify it fails**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the current label has no `data-testid` and does not update on timer ticks.

- [ ] **Step 3: Add the interval state and formatted label**

In `ShowcaseSection.tsx`:

1. Import `useEffect` and `useState` alongside the existing React imports.
2. Import `advancePlaybackCycle`, `formatPlaybackTime`, and `INITIAL_CURRENT_SECONDS` from `./musicPlayback`.
3. Inside `MusicNotch`, add:

```ts
const [elapsedSeconds, setElapsedSeconds] = useState(0);

useEffect(() => {
  const intervalId = window.setInterval(() => {
    setElapsedSeconds((current) => advancePlaybackCycle(current));
  }, 1_000);

  return () => window.clearInterval(intervalId);
}, []);

const currentTime = formatPlaybackTime(INITIAL_CURRENT_SECONDS + elapsedSeconds);
```

4. Add `data-testid="music-current-time"` to the current-time span and replace its hard-coded `0:35` text with `{currentTime}`.

- [ ] **Step 4: Run the component test to verify it passes**

Run `npm test -- src/App.test.tsx`. Expected: all App tests pass, including the one-minute reset assertion.

- [ ] **Step 5: Commit the timer integration**

```bash
git add src/pages/home/showcase/ShowcaseSection.tsx src/App.test.tsx
git commit -m "feat: animate music playback time"
```

### Task 3: Add the continuous progress-bar animation

**Files:**
- Modify: `src/pages/home/showcase/ShowcaseSection.tsx`
- Modify: `src/pages/home/showcase/showcase.css`

- [ ] **Step 1: Add a stable progress-fill hook in the markup**

Add `className="showcase-notch__progress-fill"` to the inner span that currently represents the white filled portion of the progress bar. Keep its initial CSS width at `25%` as the animation start state.

- [ ] **Step 2: Add the 60-second linear loop in CSS**

Add:

```css
.showcase-notch__progress-fill {
  display: block;
  width: 25%;
  height: 100%;
  border-radius: inherit;
  background: #fff;
  animation: showcase-playback-progress 60s linear infinite;
}

@keyframes showcase-playback-progress {
  from {
    width: 25%;
  }

  to {
    width: 100%;
  }
}
```

Replace the existing generic `.showcase-notch__progress-line span` selector with the new class selector so the animation is continuous rather than stepped by JavaScript.

- [ ] **Step 3: Run the focused and full checks**

Run:

```bash
npm test -- src/App.test.tsx src/pages/home/showcase/musicPlayback.test.ts
npm test
npm run build
npm run e2e
```

Expected: all unit tests pass, the production build succeeds, and both existing Playwright E2E checks pass.

- [ ] **Step 4: Commit the progress animation**

```bash
git add src/pages/home/showcase/ShowcaseSection.tsx src/pages/home/showcase/showcase.css
git commit -m "feat: animate music playback progress"
```

### Task 4: Final visual verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Open the local second screen and observe the playback module for at least five seconds**

Verify that the progress fill moves smoothly between observations, while the current-time label advances in one-second increments.

- [ ] **Step 2: Verify the 60-second reset behavior with fake timers or a focused browser observation**

Confirm the displayed label returns to `0:35` and the progress animation returns to `25%` after the cycle.

- [ ] **Step 3: Confirm no static visual regressions**

Check that the Notch position, cover radius, settings centering, shadow, and browser-zoom scaling remain unchanged.
