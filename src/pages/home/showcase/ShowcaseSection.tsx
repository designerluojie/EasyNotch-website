import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import macbook from "../../../assets/showcase/music/Macbook.png";
import cover from "../../../assets/showcase/music/cover.png";
import nextIcon from "../../../assets/showcase/music/next.svg";
import previousIcon from "../../../assets/showcase/music/previous.svg";
import settingsIcon from "../../../assets/showcase/music/settings.svg";
import systemNotch from "../../../assets/showcase/music/system-notch.svg";
import {
  advancePlaybackCycle,
  formatPlaybackTime,
  INITIAL_CURRENT_SECONDS,
} from "./musicPlayback";
import "./showcase.css";

const NOTCH_DESIGN_WIDTH = 435;

function useLaptopScaledNotch() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const updateScale = () => {
      const width = shell.getBoundingClientRect().width;
      if (width > 0) {
        setScale(width / NOTCH_DESIGN_WIDTH);
      }
    };

    updateScale();

    const ResizeObserverConstructor = window.ResizeObserver;
    if (!ResizeObserverConstructor) return;

    const observer = new ResizeObserverConstructor(updateScale);
    observer.observe(shell);

    return () => observer.disconnect();
  }, []);

  return { scale, shellRef };
}

function MusicNotch() {
  const { scale, shellRef } = useLaptopScaledNotch();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => advancePlaybackCycle(current));
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentTime = formatPlaybackTime(INITIAL_CURRENT_SECONDS + elapsedSeconds);

  return (
    <div
      ref={shellRef}
      className="showcase-notch showcase-notch--laptop-scaled"
      data-testid="notch-shell"
      data-width="435"
      data-height="90"
      data-top-inset="9"
      data-top-control-x="5.85"
      data-top-control-y="5.0625"
      data-bottom-radius="27"
      data-tab-left="16.5"
      data-settings-right="16.5"
      data-fill="#000"
      data-shadow="0 12px 40px rgba(0, 0, 0, 0.25)"
      style={{ "--notch-scale": scale } as CSSProperties}
    >
      <div className="showcase-notch__content" data-testid="notch-content">
        <svg
          className="showcase-notch__shape"
          data-testid="notch-shape"
          viewBox="0 0 435 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M 0 0 H 435 C 429.15 0 426 5.0625 426 9 V 63 Q 426 90 399 90 H 36 Q 9 90 9 63 V 9 C 9 5.0625 5.85 0 0 0 Z" />
        </svg>

        <img
          className="showcase-notch__system"
          src={systemNotch}
          alt=""
          aria-hidden="true"
        />

        <div className="showcase-notch__tabs" aria-hidden="true">
          <span className="showcase-notch__tab showcase-notch__tab--active">音乐</span>
          <span className="showcase-notch__tab">文件</span>
          <span className="showcase-notch__tab">更多</span>
        </div>

        <button
          className="showcase-notch__settings showcase-notch__settings--centered"
          type="button"
          aria-label="设置"
        >
          <img src={settingsIcon} alt="" aria-hidden="true" />
          <span>设置</span>
        </button>

        <div className="showcase-notch__music">
          <img
            className="showcase-notch__cover showcase-notch__cover--rounded"
            src={cover}
            alt="歌曲封面"
          />

          <div className="showcase-notch__track-info">
            <strong>淘金小镇</strong>
            <span>周杰伦</span>
          </div>

          <div className="showcase-notch__controls">
            <div className="showcase-notch__progress" aria-label="播放进度">
              <span className="showcase-notch__progress-line">
                <span className="showcase-notch__progress-fill" />
              </span>
              <span
                className="showcase-notch__time showcase-notch__time--current"
                data-testid="music-current-time"
              >
                {currentTime}
              </span>
              <span className="showcase-notch__time showcase-notch__time--total">4:12</span>
            </div>

            <div className="showcase-notch__transport">
              <button type="button" aria-label="上一首">
                <img src={previousIcon} alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="暂停"
                className="showcase-notch__pause showcase-notch__pause--compact"
              >
                <span />
                <span />
              </button>
              <button type="button" aria-label="下一首">
                <img src={nextIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  return (
    <section className="showcase-section" aria-label="Notch 功能展示">
      <div className="showcase-canvas">
        <div className="showcase-laptop" data-testid="second-screen-mockup">
          <img className="showcase-laptop__image" src={macbook} alt="MacBook Pro" />
          <MusicNotch />
        </div>

        <div className="showcase-tabs" role="tablist" aria-label="Notch 功能">
          <button
            className="showcase-tabs__item showcase-tabs__item--active"
            type="button"
            role="tab"
            aria-selected="true"
          >
            <span className="showcase-tabs__music-icon" aria-hidden="true" />
            <span>音乐</span>
          </button>
        </div>
      </div>
    </section>
  );
}
