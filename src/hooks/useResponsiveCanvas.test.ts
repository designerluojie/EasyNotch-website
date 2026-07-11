import { mobileScaleForWidth } from "./useResponsiveCanvas";

describe("mobileScaleForWidth", () => {
  it("keeps the 375px base scale at the minimum width", () => {
    expect(mobileScaleForWidth(375)).toBe(1);
  });

  it("scales proportionally up to 420px and then clamps", () => {
    expect(mobileScaleForWidth(390)).toBeCloseTo(390 / 375);
    expect(mobileScaleForWidth(420)).toBeCloseTo(420 / 375);
    expect(mobileScaleForWidth(480)).toBeCloseTo(420 / 375);
  });
});
