import { useTypewriter } from "../../hooks/useTypewriter";

const REPLY = "可以，我来帮你整理成一份清晰的行动清单。";

export function AIChatModule() {
  const reply = useTypewriter({ text: REPLY, intervalMs: 34 });

  return (
    <div className="module-panel module-panel--ai">
      <div className="ai-chat__header">
        <span className="ai-chat__orb" aria-hidden="true">✦</span>
        <span>AI Chat</span>
        <span className="ai-chat__status">在线</span>
      </div>
      <div className="ai-chat__messages">
        <div className="ai-chat__bubble ai-chat__bubble--user">帮我规划今天的重点</div>
        <div className="ai-chat__bubble ai-chat__bubble--assistant">
          <span className="ai-chat__reply">{reply}</span>
          {reply.length < REPLY.length && <span className="ai-chat__caret" aria-hidden="true" />}
        </div>
      </div>
      <div className="ai-chat__input">输入消息 <span>↑</span></div>
    </div>
  );
}

