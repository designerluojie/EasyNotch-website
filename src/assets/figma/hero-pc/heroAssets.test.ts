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
