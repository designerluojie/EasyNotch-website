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
import clipboardImage from "../../../assets/showcase/tabs/clipboard-image.png";
import tomatoRing from "../../../assets/showcase/tabs/tomato-ring.svg";
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
const NOTCH_BOTTOM_RADIUS = 27;

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

function notchPath(height: number) {
  const bottomY = Math.max(0, height - NOTCH_BOTTOM_RADIUS);
  return `M 0 0 H 435 C 429.15 0 426 5.0625 426 9 V ${bottomY} Q 426 ${height} 399 ${height} H 36 Q 9 ${height} 9 ${bottomY} V 9 C 9 5.0625 5.85 0 0 0 Z`;
}

function NotchShape({ height, shadow = false }: { height: number; shadow?: boolean }) {
  return (
    <svg
      className={shadow ? "showcase-notch__shape showcase-notch__shape--shadow" : "showcase-notch__shape"}
      data-testid={shadow ? undefined : "notch-shape"}
      viewBox={`0 0 435 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={notchPath(height)} />
    </svg>
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
      <div className="showcase-notch__file-grid">
        {fileItems.map((item) => (
          <div className="showcase-notch__file-card" key={`${item.title}-${item.type}`}>
            <img src={item.image} alt="" aria-hidden="true" />
            <strong>{item.title}</strong>
            <span>{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiContent() {
  return (
    <div className="showcase-notch__ai">
      <div className="showcase-notch__ai-history">
        <div className="showcase-notch__ai-user">淘金小镇讲述的是哪里的故事</div>
        <div className="showcase-notch__ai-answer">
          <img src={aiDeepseek} alt="" aria-hidden="true" />
          <div>
            <p>“淘金小镇”并不是一个严格指代某一个具体地点的专有名称，它通常指的是围绕19世纪中期淘金热形成的一类城镇，最典型的背景来自：</p>
            <p><strong>加州淘金热</strong></p>
            <p><strong>核心来源</strong><br />- 时间：1848年开始<br />- 地点：加利福尼亚州<br />- 起因：在萨特磨坊附近发现黄金<br />- 结果：大量移民（包括中国劳工）涌入，迅速形成大量临时城镇（即“淘金小镇”）</p>
            <p>“淘金小镇”本质上不是一个具体地名，而是源自美国加州淘金热时期形成的一类矿业城镇类型。</p>
          </div>
        </div>
      </div>
      <div className="showcase-notch__ai-input"><span>请输入</span></div>
      <div className="showcase-notch__ai-toolbar">
        <div><img src={aiImage} alt="" aria-hidden="true" /><i /><img src={aiNew} alt="" aria-hidden="true" /><span>新对话</span><img src={aiHistory} alt="" aria-hidden="true" /><span>历史记录</span></div>
        <div><span>DeepSeek-V4-Flash</span><img src={aiSend} alt="" aria-hidden="true" /></div>
      </div>
    </div>
  );
}

const clipboardItems = [
  { time: "现在", text: "希望这封邮件能找到你。我冒昧地写这封信请求您的帮助，对于我的请求可能给您繁忙的日程带来的任何不便，我深表歉意。", image: clipboardSource1 },
  { time: "1分钟前", text: "luojie@163.com", image: clipboardSource2 },
  { time: "2分钟前", text: "#F5F5F5", image: clipboardSource3 },
  { time: "1天前", text: "", image: clipboardImage },
  { time: "1周前", text: "张晓新", image: clipboardSource2 },
];

function ClipboardContent() {
  return (
    <div className="showcase-notch__clipboard">
      <div className="showcase-notch__clipboard-grid">
        {clipboardItems.map((item) => (
          <div className="showcase-notch__clipboard-card" key={item.time}>
            <div className="showcase-notch__clipboard-meta"><span>{item.time}</span><b>•••</b></div>
            <img src={item.image} alt="" aria-hidden="true" />
            {item.text && <p>{item.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TomatoContent() {
  return (
    <div className="showcase-notch__tomato">
      <img className="showcase-notch__tomato-ring" src={tomatoRing} alt="" aria-hidden="true" />
      <strong>00:15</strong>
      <button type="button" className="showcase-notch__tomato-pause">暂停</button>
      <button type="button" className="showcase-notch__tomato-stop">停止专注</button>
      <span>今日已累计专注 24 分钟</span>
    </div>
  );
}

function NotchFeature({ activeTab, currentTime }: { activeTab: ShowcaseTabId; currentTime: string }) {
  switch (activeTab) {
    case "file": return <FileContent />;
    case "ai": return <AiContent />;
    case "clipboard": return <ClipboardContent />;
    case "tomato": return <TomatoContent />;
    case "more": return <FileContent />;
    case "music":
    default:
      return <MusicContent currentTime={currentTime} />;
  }
}

export function ShowcaseSection() {
  const { scale, shellRef } = useLaptopScaledNotch();
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>("music");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const activeConfig = showcaseTabs.find((tab) => tab.id === activeTab) ?? showcaseTabs[0];
  const currentTime = formatPlaybackTime(INITIAL_CURRENT_SECONDS + elapsedSeconds);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => advancePlaybackCycle(current));
    }, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

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
            data-active-tab={activeTab}
            data-top-inset="9"
            data-top-control-x="5.85"
            data-top-control-y="5.0625"
            data-bottom-radius="27"
            data-tab-left="16.5"
            data-settings-right="16.5"
            data-fill="#000"
            data-shadow="0 12px 40px rgba(0, 0, 0, 0.25)"
            style={{ "--notch-scale": scale, "--notch-height": `${activeConfig.height}px` } as CSSProperties}
          >
            <div className="showcase-notch__content" data-testid="notch-content">
              <div className="showcase-notch__shadow" aria-hidden="true"><NotchShape height={activeConfig.height} shadow /></div>
              <div className="showcase-notch__panel" data-testid="showcase-notch-panel" data-active-tab={activeTab} data-panel-height={activeConfig.height}>
                <NotchShape height={activeConfig.height} />
                <div className="showcase-notch__feature"><NotchFeature activeTab={activeTab} currentTime={currentTime} /></div>
              </div>

              <img className="showcase-notch__system" src={systemNotch} alt="" aria-hidden="true" />
              <div className="showcase-notch__tabs" aria-hidden="true">
                <span className="showcase-notch__tab showcase-notch__tab--active">音乐</span>
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
              onClick={() => setActiveTab(tab.id)}
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
