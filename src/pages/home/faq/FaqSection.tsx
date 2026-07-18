import { useState } from "react";
import chevron from "../../../assets/faq/faq-chevron.svg";
import "./faq.css";

const faqItems = [
  {
    title: "关于音乐",
    content: "Notch 可以把音乐控制放在 Mac 顶部入口里，展开后查看当前播放来源、歌曲信息、封面和进度，并快速完成播放、暂停、上一首、下一首等操作。不同播放器的支持能力可能会有差异，具体以当前版本内展示为准。",
  },
  {
    title: "关于文件暂存",
    content: "你可以把文件、多个文件或文件夹临时拖进 Notch，先放在顶部面板里，需要时再拖出到聊天工具、浏览器、Finder 或其他应用。需注意：如果原文件被移动或删除，暂存项可能无法继续使用。",
  },
  {
    title: "关于 AIChat",
    content: "Notch 支持在顶部面板里快速发起 AI 对话，适合临时提问、整理内容或处理图片输入。AIChat 需要用户自行配置 DeepSeek、Qwen、ChatGPT、Gemini 等 API，Notch 不提供默认模型服务；",
  },
  {
    title: "关于剪贴板",
    content: "Notch 可以帮你回看最近复制过的内容，包括文字、富文本、图片、SVG、Figma 内容、文件和文件夹。点击历史项后会写回系统剪贴板，方便再次使用；",
  },
  {
    title: "关于番茄钟",
    content: "Notch 可以直接从 Mac 顶部开启一轮专注计时，支持 25、45、60 分钟，并显示当天累计专注时长。你可以中途暂停、停止，也可以在完成后进入 5 分钟休息，适合写作、设计、编程或任何需要保持专注的场景。",
  },
] as const;

export function FaqSection() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverSuppressedIndex, setHoverSuppressedIndex] = useState<number | null>(null);

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-section__inner">
        <h2 id="faq-title">功能问题解答</h2>
        <div className="faq-section__list">
          {faqItems.map((item, index) => {
            const expanded = expandedIndex === index;
            return (
              <article
                className={`faq-item ${expanded ? "faq-item--expanded" : ""} ${hoveredIndex === index ? "faq-item--hovered" : ""} ${activeIndex === index ? "faq-item--active" : ""}`}
                key={item.title}
                onMouseEnter={() => {
                  if (hoverSuppressedIndex !== index) setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  if (hoverSuppressedIndex === index) setHoverSuppressedIndex(null);
                }}
                onMouseDown={() => setActiveIndex(index)}
                onMouseUp={() => setActiveIndex(null)}
              >
                <button
                  className="faq-item__trigger"
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => {
                    setExpandedIndex(expanded ? -1 : index);
                    setHoveredIndex(null);
                    setHoverSuppressedIndex(index);
                  }}
                >
                  <span>{item.title}</span>
                  <img className="faq-item__chevron" src={chevron} alt="" aria-hidden="true" />
                </button>
                <div className="faq-item__body">
                  <p>{item.content}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
