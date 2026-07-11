import { describe, expect, it } from "vitest";
import { HERO_BORDER_GLOW_COLORS } from "./hero-border-glow-config";

describe("hero Border Glow colors", () => {
  it("matches the confirmed gradient colors", () => {
    expect(HERO_BORDER_GLOW_COLORS).toEqual(["#a855f7", "#6366f1", "#ffffff"]);
  });
});
