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
