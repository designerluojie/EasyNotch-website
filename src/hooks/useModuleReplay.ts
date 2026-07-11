import { useEffect, useState } from "react";

export function useModuleReplay(replayKey: string, durationMs = 360) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(-80);
    const timeout = window.setTimeout(() => setOffset(0), durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, replayKey]);

  return offset;
}

