import { interpolate, scrollProgress } from "./useScrollProgress";

describe("scroll progress helpers", () => {
  it("clamps the hero scroll range to zero through five hundred pixels", () => {
    expect(scrollProgress(0)).toBe(0);
    expect(scrollProgress(250)).toBe(0.5);
    expect(scrollProgress(500)).toBe(1);
    expect(scrollProgress(900)).toBe(1);
  });

  it("interpolates navigation values", () => {
    expect(interpolate(680, 1000, 0.5)).toBe(840);
  });
});
