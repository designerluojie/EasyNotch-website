import { useEffect, useState } from "react";

const TRACK_DURATION = 4 * 60 + 12;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function MusicModule() {
  const [playing, setPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(35);

  useEffect(() => {
    if (!playing) return;

    const interval = window.setInterval(() => {
      setPlayedSeconds((current) => {
        if (current >= 59) {
          setElapsed(35);
          return 0;
        }
        setElapsed((currentElapsed) =>
          Math.min(TRACK_DURATION, currentElapsed + 1),
        );
        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [playing]);

  const progress = Math.min(100, (elapsed / TRACK_DURATION) * 100);

  return (
    <div className="module-panel module-panel--music">
      <div className="music-module__art" aria-hidden="true">
        <span>♫</span>
      </div>
      <div className="music-module__main">
        <div className="module-panel__eyebrow">正在播放</div>
        <strong className="music-module__title">Midnight City</strong>
        <span className="music-module__artist">M83</span>
        <div className="music-module__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="music-module__controls">
        <button type="button" aria-label="上一首">‹</button>
        <button
          type="button"
          aria-label={playing ? "暂停" : "播放"}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
        <button type="button" aria-label="下一首">›</button>
        <span>{formatTime(elapsed)}</span>
      </div>
    </div>
  );
}

