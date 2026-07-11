import { useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PomodoroModule({ demoMultiplier = 1 }: { demoMultiplier?: number }) {
  const [running, setRunning] = useState(true);
  const { remainingSeconds } = useCountdown({
    initialSeconds: 25 * 60,
    running,
    multiplier: demoMultiplier,
  });
  const progress = remainingSeconds / (25 * 60);
  const dashOffset = 220 * (1 - progress);

  return (
    <div className="module-panel module-panel--pomodoro">
      <div className="pomodoro__ring" aria-hidden="true">
        <svg viewBox="0 0 80 80">
          <circle className="pomodoro__ring-track" cx="40" cy="40" r="35" />
          <circle
            className="pomodoro__ring-progress"
            cx="40"
            cy="40"
            r="35"
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <strong>{formatTime(remainingSeconds)}</strong>
      </div>
      <div className="pomodoro__copy">
        <span className="module-panel__eyebrow">专注中</span>
        <strong>深度工作</strong>
        <span>今日已专注 1h 20m</span>
      </div>
      <div className="pomodoro__controls">
        <button type="button" onClick={() => setRunning((current) => !current)}>
          {running ? "暂停" : "继续"}
        </button>
        <button type="button" onClick={() => setRunning(false)}>结束</button>
      </div>
    </div>
  );
}

