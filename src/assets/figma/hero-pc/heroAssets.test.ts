import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const assetDirectory = dirname(fileURLToPath(import.meta.url));

const vectorAssets = [
  ["github.svg", 'viewBox="0 0 32 32"'],
  ["cta-arrow.svg", 'viewBox="0 0 32 32"'],
] as const;

describe("hero Figma assets", () => {
  it("keeps the exported vector dimensions for the named Figma cut layers", () => {
    for (const [filename, viewBox] of vectorAssets) {
      const source = readFileSync(new URL(filename, import.meta.url), "utf8");
      expect(source).toContain("<svg");
      expect(source).toContain(viewBox);
    }
  });

  it("uses the PNG logo asset for the product mark", () => {
    const source = readFileSync(resolve(assetDirectory, "product-mark.png"));
    expect(source.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
  });
});
