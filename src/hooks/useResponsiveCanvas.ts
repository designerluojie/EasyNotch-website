import { useEffect, useRef, useState } from "react";
import { layoutModeForWidth } from "../types/modules";

const MOBILE_BASE_WIDTH = 375;
const MOBILE_MAX_WIDTH = 420;

export function mobileScaleForWidth(width: number): number {
  const clampedWidth = Math.min(
    Math.max(width, MOBILE_BASE_WIDTH),
    MOBILE_MAX_WIDTH,
  );
  return clampedWidth / MOBILE_BASE_WIDTH;
}

export function useResponsiveCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(MOBILE_BASE_WIDTH);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => setWidth(element.clientWidth);
    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mode = layoutModeForWidth(width);
  const scale = mobileScaleForWidth(width);

  return {
    ref,
    width,
    scale,
    mode,
    isDesktop: mode === "desktop",
  };
}
