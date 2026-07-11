export const HERO_RING_CONFIG = {
  color: "#a855f7",
  colorTwo: "#6366f1",
  ringCount: 6,
  speed: 1,
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
} as const;

export function ringRadiusAt({ elapsedMs, index }: { elapsedMs: number; index: number }) {
  const elapsedSeconds = elapsedMs / 1000;
  const baseRadius =
    HERO_RING_CONFIG.baseRadius +
    index * HERO_RING_CONFIG.radiusStep * HERO_RING_CONFIG.ringGap * 0.55;
  return (
    baseRadius +
    Math.sin(elapsedSeconds * HERO_RING_CONFIG.speed + index * 0.46) *
      HERO_RING_CONFIG.scaleRate *
      0.03
  );
}
