import { MODULE_TARGETS, layoutModeForWidth } from "./modules";

describe("Notch module dimensions", () => {
  it("uses the Figma-scaled website dimensions", () => {
    expect(MODULE_TARGETS.music).toEqual({ width: 290, height: 60 });
    expect(MODULE_TARGETS.fileStash).toEqual({ width: 290, height: 60 });
    expect(MODULE_TARGETS.aiChat).toEqual({ width: 290, height: 200 });
    expect(MODULE_TARGETS.clipboard).toEqual({ width: 290, height: 90 });
    expect(MODULE_TARGETS.pomodoro).toEqual({ width: 290, height: 148 });
  });

  it("switches to desktop only above 600 pixels", () => {
    expect(layoutModeForWidth(375)).toBe("mobile");
    expect(layoutModeForWidth(420)).toBe("mobile");
    expect(layoutModeForWidth(600)).toBe("mobile");
    expect(layoutModeForWidth(601)).toBe("desktop");
  });
});
