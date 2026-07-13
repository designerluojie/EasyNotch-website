export const INITIAL_CURRENT_SECONDS = 35;
export const CYCLE_SECONDS = 60;
export const INITIAL_PROGRESS_PERCENT = 25;

export function formatPlaybackTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function advancePlaybackCycle(elapsedSeconds: number) {
  return (elapsedSeconds + 1) % CYCLE_SECONDS;
}
