import { useEffect, useState } from "react";

type Options = {
  initialSeconds: number;
  running: boolean;
  multiplier?: number;
};

export function useCountdown({
  initialSeconds,
  running,
  multiplier = 1,
}: Options) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - multiplier));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [multiplier, remainingSeconds, running]);

  return {
    remainingSeconds,
    isComplete: remainingSeconds <= 0,
  };
}

