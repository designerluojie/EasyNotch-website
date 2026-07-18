import { HERO_RING_CONFIG } from "./hero-ring-config";

describe("hero ring background configuration", () => {
  it("matches the Magic Rings URL preset and confirmed visual parameters", () => {
    expect(HERO_RING_CONFIG).toEqual({
      color: "#a855f7",
      colorTwo: "#6366f1",
      ringCount: 9,
      speed: 0.8,
      attenuation: 10,
      lineThickness: 2,
      baseRadius: 0.35,
      radiusStep: 0.1,
      scaleRate: 0.1,
      opacity: 1,
      blur: 0,
      noiseAmount: 0.1,
      rotation: 0,
      ringGap: 1.5,
      fadeIn: 0.7,
      fadeOut: 0.5,
      mouseInfluence: 0.2,
      hoverScale: 1.2,
      parallax: 0.05,
      followMouse: false,
      clickBurst: false,
    });
  });

});
