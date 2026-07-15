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
import fileCover from "../../../assets/showcase/tabs/file-cover.png";
import fileMarkdown from "../../../assets/showcase/tabs/file-markdown.png";
import filePdf from "../../../assets/showcase/tabs/file-pdf.png";
import folderIcon from "../../../assets/showcase/tabs/folder.png";
import aiDeepseek from "../../../assets/showcase/tabs/ai-deepseek.svg";
import aiImage from "../../../assets/showcase/tabs/ai-image.svg";
import aiNew from "../../../assets/showcase/tabs/ai-new.svg";
import aiHistory from "../../../assets/showcase/tabs/ai-history.svg";
import aiSend from "../../../assets/showcase/tabs/ai-send.svg";
import clipboardSource1 from "../../../assets/showcase/tabs/clipboard-source-1.png";
import clipboardSource2 from "../../../assets/showcase/tabs/clipboard-source-2.png";
import clipboardSource3 from "../../../assets/showcase/tabs/clipboard-source-3.png";
import clipboardChrome from "../../../assets/showcase/tabs/clipboard-chrome.svg";
import tabMusic from "../../../assets/showcase/tabs/tab-music.svg";
import tabFile from "../../../assets/showcase/tabs/tab-file.svg";
import tabAi from "../../../assets/showcase/tabs/tab-ai.svg";
import tabClipboard from "../../../assets/showcase/tabs/tab-clipboard.svg";
import tabTomato from "../../../assets/showcase/tabs/tab-tomato.svg";
import tabMore from "../../../assets/showcase/tabs/tab-more.svg";
import {
  advancePlaybackCycle,
  formatPlaybackTime,
  INITIAL_CURRENT_SECONDS,
} from "./musicPlayback";
import "./showcase.css";

const NOTCH_DESIGN_WIDTH = 435;

type ShowcaseTabId = "music" | "file" | "ai" | "clipboard" | "tomato" | "more";

type ShowcaseTab = {
  id: ShowcaseTabId;
  label: string;
  height: number;
  icon: string;
};

const showcaseTabs: ShowcaseTab[] = [
  { id: "music", label: "音乐", height: 90, icon: tabMusic },
  { id: "file", label: "文件暂存", height: 90, icon: tabFile },
  { id: "ai", label: "AI Chat", height: 300, icon: tabAi },
  { id: "clipboard", label: "剪贴板", height: 135, icon: tabClipboard },
  { id: "tomato", label: "番茄钟", height: 222, icon: tabTomato },
  { id: "more", label: "更多...", height: 90, icon: tabMore },
];

function useLaptopScaledNotch() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const updateScale = () => {
      const width = shell.getBoundingClientRect().width;
      if (width > 0) setScale(width / NOTCH_DESIGN_WIDTH);
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

function NotchShape({ height, shadow = false }: { height: number; shadow?: boolean }) {
  if (shadow) {
    return (
      <svg
        className="showcase-notch__shape showcase-notch__shape--shadow"
        viewBox="0 0 435 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="showcase-notch__shadow-group">
          <path className="showcase-notch__shadow-top" d="M 0 0 H 435 C 429.15 0 426 5.0625 426 9 H 9 C 9 5.0625 5.85 0 0 0 Z" />
          <rect className="showcase-notch__shadow-body" x="9" y="9" width="417" style={{ height: `${Math.max(0, height - 36)}px` }} />
          <path
            className="showcase-notch__shadow-bottom"
            d="M 9 0 H 426 Q 426 27 399 27 H 36 Q 9 27 9 0 Z"
            style={{ transform: `translate(0px, ${Math.max(0, height - 27)}px)` }}
          />
        </g>
      </svg>
    );
  }

  return (
    <div
      className="showcase-notch__shape"
      style={{ "--shape-height": `${height}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg className="showcase-notch__shape-top" viewBox="0 0 435 9" preserveAspectRatio="none">
        <path d="M 0 0 H 435 C 429.15 0 426 5.0625 426 9 H 9 C 9 5.0625 5.85 0 0 0 Z" />
      </svg>
      <div className="showcase-notch__shape-body" />
      <svg className="showcase-notch__shape-bottom" viewBox="0 0 435 27" preserveAspectRatio="none">
        <path d="M 9 0 H 426 Q 426 27 399 27 H 36 Q 9 27 9 0 Z" />
      </svg>
      {!shadow && <svg className="showcase-notch__shape-metadata" data-testid="notch-shape" viewBox={`0 0 435 ${height}`} />}
    </div>
  );
}

function MusicContent({ currentTime }: { currentTime: string }) {
  return (
    <div className="showcase-notch__music">
      <img className="showcase-notch__cover showcase-notch__cover--rounded" src={cover} alt="歌曲封面" />
      <div className="showcase-notch__track-info">
        <strong>淘金小镇</strong>
        <span>周杰伦</span>
      </div>
      <div className="showcase-notch__controls">
        <div className="showcase-notch__progress" aria-label="播放进度">
          <span className="showcase-notch__progress-line"><span className="showcase-notch__progress-fill" /></span>
          <span className="showcase-notch__time showcase-notch__time--current" data-testid="music-current-time">{currentTime}</span>
          <span className="showcase-notch__time showcase-notch__time--total">4:12</span>
        </div>
        <div className="showcase-notch__transport">
          <button type="button" aria-label="上一首"><img src={previousIcon} alt="" aria-hidden="true" /></button>
          <button type="button" aria-label="暂停" className="showcase-notch__pause showcase-notch__pause--compact"><span /><span /></button>
          <button type="button" aria-label="下一首"><img src={nextIcon} alt="" aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}

const fileItems = [
  { title: "周杰伦-太阳之子", type: "JPG", image: fileCover },
  { title: "项目技术文档", type: "Markdown", image: fileMarkdown },
  { title: "项目文件", type: "文件夹", image: folderIcon },
  { title: "发票", type: "PDF", image: filePdf },
  { title: "项目", type: "文件夹", image: folderIcon },
];

function FileContent() {
  return (
    <div className="showcase-notch__file">
      <div className="showcase-notch__file-grid showcase-notch__file-grid--swipe-hint" data-testid="file-swipe-hint">
        {fileItems.map((item) => (
          <div className="showcase-notch__file-card" key={`${item.title}-${item.type}`}>
            <img src={item.image} alt="" aria-hidden="true" />
            <div className="showcase-notch__file-info">
              <strong>{item.title}</strong>
              <span>{item.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoreContent() {
  return <div className="showcase-notch__more">更多功能开发中</div>;
}

const AI_TYPING_DELAY_MS = 1_000;
const AI_TYPING_INTERVAL_MS = 16;

const aiAnswerParagraphs = [
  "“淘金小镇”并不是一个严格指代某一个具体地点的专有名称，它通常指的是围绕19世纪中期淘金热形成的一类城镇，最典型的背景来自：",
  "加州淘金热",
  "核心来源",
  "“淘金小镇”本质上不是一个具体地名，而是源自美国加州淘金热时期形成的一类矿业城镇类型，后来被广泛用于文化叙事和隐喻表达。",
] as const;

const aiAnswerListItems = [
  "时间：1848年开始",
  "地点：加利福尼亚州",
  "起因：在萨特磨坊附近发现黄金",
  "结果：大量移民（包括中国劳工）涌入，迅速形成大量临时城镇（即“淘金小镇”）",
] as const;

const AI_ANSWER_TOTAL_CHARACTERS = [
  ...aiAnswerParagraphs,
  ...aiAnswerListItems,
].reduce((total, text) => total + text.length, 0);

function AiContent() {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    let intervalId: number | null = null;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setVisibleCharacters((current) =>
          current >= AI_ANSWER_TOTAL_CHARACTERS
            ? current
            : Math.min(current + 1, AI_ANSWER_TOTAL_CHARACTERS),
        );
      }, AI_TYPING_INTERVAL_MS);
    }, AI_TYPING_DELAY_MS);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, []);

  let characterOffset = 0;
  const revealText = (text: string) => {
    const start = characterOffset;
    characterOffset += text.length;
    const visibleLength = Math.max(
      0,
      Math.min(text.length, visibleCharacters - start),
    );
    return text.slice(0, visibleLength);
  };

  const intro = revealText(aiAnswerParagraphs[0]);
  const sourceTitle = revealText(aiAnswerParagraphs[1]);
  const sourceHeading = revealText(aiAnswerParagraphs[2]);
  const listItems = aiAnswerListItems.map((item) => revealText(item));
  const conclusion = revealText(aiAnswerParagraphs[3]);

  return (
    <div className="showcase-notch__ai" data-testid="showcase-ai-content">
      <div className="showcase-notch__ai-history">
        <div className="showcase-notch__ai-conversation" data-testid="ai-conversation">
          <div className="showcase-notch__ai-user-row" data-testid="ai-user-row">
            <div className="showcase-notch__ai-user" data-testid="ai-user-bubble">
              淘金小镇讲述的是哪里的故事
            </div>
          </div>
          <div className="showcase-notch__ai-answer">
            <div className="showcase-notch__ai-answer-body">
              <div className="showcase-notch__ai-answer-text" data-testid="ai-answer-text">
                {intro && <p>{intro}</p>}
                {sourceTitle && <p>{sourceTitle}</p>}
                {sourceHeading && <p>{sourceHeading}</p>}
                <ul aria-label="核心来源">
                  {listItems.map((item, index) => item && <li key={aiAnswerListItems[index]}>{item}</li>)}
                </ul>
                {conclusion && <p>{conclusion}</p>}
              </div>
            </div>
          </div>
        </div>
        {visibleCharacters >= AI_ANSWER_TOTAL_CHARACTERS && (
          <div
            className="showcase-notch__ai-scroll-indicator showcase-notch__ai-scroll-indicator--fade-in"
            data-testid="ai-scroll-indicator"
          />
        )}
      </div>
      <div className="showcase-notch__ai-input-area">
        <div className="showcase-notch__ai-input" data-testid="ai-input-box">
          <span className="showcase-notch__ai-placeholder">请输入</span>
          <div className="showcase-notch__ai-toolbar">
            <div className="showcase-notch__ai-toolbar-left">
              <span className="showcase-notch__ai-icon-chip"><img src={aiImage} alt="" aria-hidden="true" /></span>
              <i className="showcase-notch__ai-separator" />
              <span className="showcase-notch__ai-action-group">
                <span className="showcase-notch__ai-action"><img src={aiNew} alt="" aria-hidden="true" /><span>新对话</span></span>
                <span className="showcase-notch__ai-action"><img src={aiHistory} alt="" aria-hidden="true" /><span>历史记录</span></span>
              </span>
            </div>
            <div className="showcase-notch__ai-toolbar-right">
              <span className="showcase-notch__ai-model"><img src={aiDeepseek} alt="" aria-hidden="true" /><span>DeepSeek-V4-Flash</span></span>
              <img className="showcase-notch__ai-send" src={aiSend} alt="发送" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ClipboardItem = {
  time: string;
  text: string;
  image: string;
  sourceClass?: string;
  contentImage?: string;
  contentClass?: string;
};

const clipboardItems: ClipboardItem[] = [
  { time: "现在", text: "希望这封邮件能找到你。我冒昧地写这封信请求您的帮助，对于我的请求可能给您繁忙的日程带来的任何不便，我深表歉意。\n最近，我接受了一项兼职翻译任务，我需要将几篇中国短篇小说翻译成英语。", image: clipboardChrome, sourceClass: "showcase-notch__clipboard-source--chrome" },
  { time: "1分钟前", text: "luojie@163.com", image: clipboardSource1, sourceClass: "showcase-notch__clipboard-source--wide" },
  { time: "2分钟前", text: "#F5F5F5", image: clipboardSource2 },
  { time: "1天前", text: "", image: clipboardSource3, contentImage: cover, contentClass: "showcase-notch__clipboard-content--image" },
  { time: "1周前", text: "诚邀您参加 Notch 产品体验会，期待与您见面！", image: clipboardSource1, sourceClass: "showcase-notch__clipboard-source--wide" },
  { time: "1周前", text: "感谢您的关注，期待与您进一步沟通。", image: clipboardSource1, sourceClass: "showcase-notch__clipboard-source--wide" },
];

function ClipboardContent() {
  return (
    <div className="showcase-notch__clipboard">
      <div className="showcase-notch__clipboard-grid showcase-notch__clipboard-grid--swipe-hint" data-testid="clipboard-grid">
        {clipboardItems.map((item) => (
          <div className="showcase-notch__clipboard-card" data-testid="clipboard-card" key={`${item.time}-${item.text}`}>
            <div className="showcase-notch__clipboard-meta">
              <span className="showcase-notch__clipboard-source">
                <img className={item.sourceClass ?? ""} src={item.image} alt="" aria-hidden="true" />
              </span>
              <span>{item.time}</span>
            </div>
            <div className={`showcase-notch__clipboard-content ${item.contentClass ?? ""}`}>
              {item.text && <p>{item.text}</p>}
              {item.contentClass === "showcase-notch__clipboard-content--image" && <img src={item.contentImage ?? item.image} alt="" aria-hidden="true" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOMATO_TOTAL_DURATION_SECONDS = 25 * 60;
const TOMATO_DEMO_DURATION_SECONDS = 60;

function tomatoProgress(totalDuration: number, remainingSeconds: number) {
  return Math.max(0, Math.min(1, (totalDuration - remainingSeconds) / totalDuration));
}

function formatTomatoTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function TomatoRing({ progress }: { progress: number }) {
  return (
    <svg
      className="showcase-notch__tomato-ring"
      viewBox="0 0 90 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-testid="tomato-ring"
      style={{ "--tomato-ring-progress": progress } as CSSProperties}
    >
      <circle className="showcase-notch__tomato-ring-track" cx="45" cy="45" r="43.125" />
      <circle className="showcase-notch__tomato-ring-progress" cx="45" cy="45" r="43.125" pathLength="1" />
    </svg>
  );
}

function TomatoContent() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => (current + 1) % TOMATO_DEMO_DURATION_SECONDS);
    }, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const remainingSeconds = TOMATO_TOTAL_DURATION_SECONDS - elapsedSeconds;

  return (
    <div className="showcase-notch__tomato" data-testid="tomato-content">
      <div className="showcase-notch__tomato-timer" data-testid="tomato-timer">
        <strong data-testid="tomato-time">{formatTomatoTime(remainingSeconds)}</strong>
        <button type="button" className="showcase-notch__tomato-pause">暂停</button>
        <TomatoRing progress={tomatoProgress(TOMATO_TOTAL_DURATION_SECONDS, remainingSeconds)} />
      </div>
      <button type="button" className="showcase-notch__tomato-stop">停止专注</button>
      <span>今日已累计专注 25 分钟</span>
    </div>
  );
}

function NotchFeature({ activeTab, currentTime }: { activeTab: ShowcaseTabId; currentTime: string }) {
  switch (activeTab) {
    case "file": return <FileContent />;
    case "ai": return <AiContent />;
    case "clipboard": return <ClipboardContent />;
    case "tomato": return <TomatoContent />;
    case "more": return <MoreContent />;
    case "music":
    default:
      return <MusicContent currentTime={currentTime} />;
  }
}

export function ShowcaseSection() {
  const { scale, shellRef } = useLaptopScaledNotch();
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>("music");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [visualHeight, setVisualHeight] = useState(90);
  const activeConfig = showcaseTabs.find((tab) => tab.id === activeTab) ?? showcaseTabs[0];
  const activeTopTab = activeTab === "music" ? "music" : activeTab === "file" ? "file" : "more";
  const activeTopTabIndex = activeTopTab === "music" ? 0 : activeTopTab === "file" ? 1 : 2;
  const currentTime = formatPlaybackTime(INITIAL_CURRENT_SECONDS + elapsedSeconds);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => advancePlaybackCycle(current));
    }, 1_000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleTabChange = (nextTab: ShowcaseTabId) => {
    const nextConfig = showcaseTabs.find((tab) => tab.id === nextTab) ?? showcaseTabs[0];
    const isSameHeight = activeConfig.height === nextConfig.height;

    setActiveTab(nextTab);
    if (!isSameHeight) setVisualHeight(nextConfig.height);
  };

  return (
    <section className="showcase-section" aria-label="Notch 功能展示">
      <div className="showcase-canvas">
        <div className="showcase-laptop" data-testid="second-screen-mockup">
          <img className="showcase-laptop__image" src={macbook} alt="MacBook Pro" />
          <div
            ref={shellRef}
            className="showcase-notch showcase-notch--laptop-scaled showcase-notch--screen-aligned"
            data-testid="notch-shell"
            data-width="435"
            data-height={activeConfig.height}
            data-visual-height={visualHeight}
            data-active-tab={activeTab}
            data-top-inset="9"
            data-top-control-x="5.85"
            data-top-control-y="5.0625"
            data-bottom-radius="27"
            data-tab-left="16.5"
            data-settings-right="16.5"
            data-fill="#000"
            data-shadow="0 12px 40px rgba(0, 0, 0, 0.25)"
            style={{ "--notch-scale": scale, "--notch-height": `${visualHeight}px` } as CSSProperties}
          >
            <div className="showcase-notch__content" data-testid="notch-content">
              <div className="showcase-notch__shadow" aria-hidden="true"><NotchShape height={visualHeight} shadow /></div>
              <div className="showcase-notch__panel" data-testid="showcase-notch-panel" data-active-tab={activeTab} data-panel-height={activeConfig.height}>
                <NotchShape height={visualHeight} />
                <div className="showcase-notch__feature"><NotchFeature activeTab={activeTab} currentTime={currentTime} /></div>
              </div>

              <img className="showcase-notch__system" src={systemNotch} alt="" aria-hidden="true" />
              <div className="showcase-notch__tabs" data-testid="notch-top-tabs" data-active-top-tab={activeTopTab} aria-hidden="true">
                <span
                  className="showcase-notch__tab-indicator"
                  data-testid="notch-top-tab-indicator"
                  style={{ transform: `translateX(${activeTopTabIndex * 41}px)` }}
                />
                <span className="showcase-notch__tab">音乐</span>
                <span className="showcase-notch__tab">文件</span>
                <span className="showcase-notch__tab">更多</span>
              </div>
              <button className="showcase-notch__settings showcase-notch__settings--centered" type="button" aria-label="设置">
                <img src={settingsIcon} alt="" aria-hidden="true" /><span>设置</span>
              </button>
            </div>
          </div>
        </div>

        <div className="showcase-tabs" role="tablist" aria-label="Notch 功能">
          {showcaseTabs.map((tab) => (
            <button
              className={`showcase-tabs__item ${activeTab === tab.id ? "showcase-tabs__item--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              <img src={tab.icon} alt="" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
