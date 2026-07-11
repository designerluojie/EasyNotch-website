import { useEffect, useState } from "react";

type Options = {
  text: string;
  intervalMs?: number;
  active?: boolean;
};

export function useTypewriter({ text, intervalMs = 32, active = true }: Options) {
  const [visibleLength, setVisibleLength] = useState(active ? 0 : text.length);

  useEffect(() => {
    setVisibleLength(active ? 0 : text.length);
    if (!active || text.length === 0) return;

    const interval = window.setInterval(() => {
      setVisibleLength((current) => {
        if (current >= text.length) {
          window.clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [active, intervalMs, text]);

  return text.slice(0, visibleLength);
}

