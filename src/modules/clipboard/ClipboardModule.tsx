import { useModuleReplay } from "../../hooks/useModuleReplay";

export function ClipboardModule() {
  const offset = useModuleReplay("clipboard");

  return (
    <div className="module-panel module-panel--clipboard">
      <div className="module-panel__topline">
        <span className="module-panel__eyebrow">剪贴板历史</span>
        <span className="module-panel__count">刚刚</span>
      </div>
      <div className="clipboard__viewport">
        <div
          className="clipboard__track"
          style={{ transform: `translateX(${offset}px)` }}
        >
          <div className="clipboard-card clipboard-card--active">设计稿中的一句重要文案</div>
          <div className="clipboard-card">https://easynotch.app</div>
          <div className="clipboard-card">⌘ ⇧ V  粘贴历史</div>
        </div>
      </div>
    </div>
  );
}

