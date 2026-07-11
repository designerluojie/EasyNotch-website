import { useEffect, useState } from "react";

export function scrollProgress(scrollY: number): number {
  return Math.min(Math.max(scrollY / 500, 0), 1);
}

export function interpolate(from: number, to: number, progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return from + (to - from) * clamped;
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(() =>
    typeof window === "undefined" ? 0 : scrollProgress(window.scrollY),
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setProgress(scrollProgress(window.scrollY));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
