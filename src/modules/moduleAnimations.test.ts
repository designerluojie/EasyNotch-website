import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "../hooks/useCountdown";
import { useModuleReplay } from "../hooks/useModuleReplay";
import { useTypewriter } from "../hooks/useTypewriter";

describe("module animation hooks", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("advances a countdown once per second", () => {
    vi.useFakeTimers();
    const timer = renderHook(() =>
      useCountdown({ initialSeconds: 1500, running: true }),
    );

    act(() => vi.advanceTimersByTime(2000));

    expect(timer.result.current.remainingSeconds).toBe(1498);
  });

  it("reveals one more typewriter character per tick", () => {
    vi.useFakeTimers();
    const typewriter = renderHook(() =>
      useTypewriter({ text: "你好 Notch", intervalMs: 100 }),
    );

    expect(typewriter.result.current).toBe("");
    act(() => vi.advanceTimersByTime(300));
    expect(typewriter.result.current).toBe("你好 ");
  });

  it("replays a clipped row and returns to the resting position", () => {
    vi.useFakeTimers();
    const replay = renderHook(() => useModuleReplay("file-stash"));

    expect(replay.result.current).toBe(-80);
    act(() => vi.advanceTimersByTime(360));
    expect(replay.result.current).toBe(0);
  });
});
