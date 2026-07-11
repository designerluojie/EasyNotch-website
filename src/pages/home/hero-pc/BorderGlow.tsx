// Directly reused from React Bits Border Glow.
// Source: https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/BorderGlow

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import "./BorderGlow.css";

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(value: string) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  return Object.fromEntries(opacities.map((opacity, index) => [
    `--glow-color${keys[index]}`,
    `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`,
  ]));
}

const gradientPositions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const gradientKeys = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]): Record<string, string> {
  const vars: Record<string, string> = {};
  for (let index = 0; index < 7; index += 1) {
    const color = colors[Math.min(colorMap[index], colors.length - 1)];
    vars[gradientKeys[index]] = `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(value: number) { return 1 - (1 - value) ** 3; }
function easeInCubic(value: number) { return value ** 3; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: {
  start?: number; end?: number; duration?: number; delay?: number; ease?: (value: number) => number;
  onUpdate: (value: number) => void; onEnd?: () => void;
}) {
  const startTime = performance.now() + delay;
  function tick() {
    const progress = Math.min((performance.now() - startTime) / duration, 1);
    onUpdate(start + (end - start) * ease(progress));
    if (progress < 1) requestAnimationFrame(tick);
    else onEnd?.();
  }
  window.setTimeout(() => requestAnimationFrame(tick), delay);
}

export default function BorderGlow({
  children, className = "", edgeSensitivity = 30, glowColor = "40 80 80",
  backgroundColor = "#120F17", borderRadius = 28, glowRadius = 40,
  glowIntensity = 1, coneSpread = 25, animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"], fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const getCenter = useCallback((element: HTMLElement) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);
  const getEdgeProximity = useCallback((element: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenter(element);
    const dx = x - cx; const dy = y - cy;
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenter]);
  const getCursorAngle = useCallback((element: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenter(element);
    if (x === cx && y === cy) return 0;
    let degrees = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenter]);
  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left; const y = event.clientY - rect.top;
    card.style.setProperty("--edge-proximity", `${(getEdgeProximity(card, x, y) * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${getCursorAngle(card, x, y).toFixed(3)}deg`);
  }, [getCursorAngle, getEdgeProximity]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    card.classList.add("sweep-active");
    const start = 110; const end = 465;
    card.style.setProperty("--cursor-angle", `${start}deg`);
    animateValue({ duration: 500, onUpdate: value => card.style.setProperty("--edge-proximity", `${value}`) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: value => card.style.setProperty("--cursor-angle", `${(end - start) * (value / 100) + start}deg`) });
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: value => card.style.setProperty("--cursor-angle", `${(end - start) * (value / 100) + start}deg`) });
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0, onUpdate: value => card.style.setProperty("--edge-proximity", `${value}`), onEnd: () => card.classList.remove("sweep-active") });
  }, [animated]);

  const style = {
    "--card-bg": backgroundColor, "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`, "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread, "--fill-opacity": fillOpacity,
    ...buildGlowVars(glowColor, glowIntensity), ...buildGradientVars(colors),
  } as CSSProperties;

  return <div ref={cardRef} onPointerMove={handlePointerMove} className={`border-glow-card ${className}`} style={style}>
    <span className="edge-light" />
    <div className="border-glow-inner">{children}</div>
  </div>;
}
