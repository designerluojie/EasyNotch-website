import { useMemo } from "react";
import "./GradualBlur.css";

type GradualBlurProps = {
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  target?: "parent" | "page";
  zIndex?: number;
  className?: string;
};

const curveFunctions = {
  linear: (progress: number) => progress,
  bezier: (progress: number) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress: number) => progress * progress,
  "ease-out": (progress: number) => 1 - Math.pow(1 - progress, 2),
  "ease-in-out": (progress: number) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2,
};

function getDirection(position: NonNullable<GradualBlurProps["position"]>) {
  return {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  }[position];
}

export default function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width = "100%",
  divCount = 5,
  exponential = false,
  opacity = 1,
  curve = "linear",
  target = "parent",
  zIndex = 1000,
  className = "",
}: GradualBlurProps) {
  const blurLayers = useMemo(() => {
    const direction = getDirection(position);
    const layers = [];
    const layerIncrement = 100 / divCount;
    const curveFunction = curveFunctions[curve];

    for (let index = 1; index <= divCount; index += 1) {
      const progress = curveFunction(index / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;
      const start = Math.round((layerIncrement * index - layerIncrement) * 10) / 10;
      const end = Math.round(layerIncrement * index * 10) / 10;
      const next = Math.round((layerIncrement * index + layerIncrement) * 10) / 10;
      const final = Math.round((layerIncrement * index + layerIncrement * 2) * 10) / 10;
      let gradient = `transparent ${start}%, black ${end}%`;
      if (next <= 100) gradient += `, black ${next}%`;
      if (final <= 100) gradient += `, transparent ${final}%`;

      layers.push(
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            opacity,
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          }}
        />,
      );
    }

    return layers;
  }, [curve, divCount, exponential, opacity, position, strength]);

  const isPageTarget = target === "page";
  const isVertical = position === "top" || position === "bottom";

  return (
    <div
      className={`gradual-blur ${isPageTarget ? "gradual-blur-page" : "gradual-blur-parent"} ${className}`}
      style={{
        position: isPageTarget ? "fixed" : "absolute",
        zIndex: isPageTarget ? zIndex + 100 : zIndex,
        pointerEvents: "none",
        height: isVertical ? height : "100%",
        width: isVertical ? width : height,
        [position]: 0,
        ...(isVertical ? { left: 0, right: 0 } : { top: 0, bottom: 0 }),
      }}
      aria-hidden="true"
    >
      <div className="gradual-blur-inner">{blurLayers}</div>
    </div>
  );
}
