import { readFileSync } from "node:fs";

const exportedPngs = [
  "pc-body.png",
  "pc-screen-body.png",
  "pc-notch-bg.png",
  "h5-body.png",
  "h5-screen-body.png",
  "h5-notch-bg.png",
  "h5-product-mark.png",
];

describe("exported image assets", () => {
  it("uses a real PNG signature for every .png structural asset", () => {
    for (const filename of exportedPngs) {
      const file = readFileSync(new URL(filename, import.meta.url));
      expect(file.subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
    }
  });
});
