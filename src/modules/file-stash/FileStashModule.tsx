import { useModuleReplay } from "../../hooks/useModuleReplay";

export function FileStashModule() {
  const offset = useModuleReplay("file-stash");

  return (
    <div className="module-panel module-panel--file">
      <div className="module-panel__topline">
        <span className="module-panel__eyebrow">文件暂存</span>
        <span className="module-panel__count">3 个文件</span>
      </div>
      <div className="file-stash__viewport">
        <div
          className="file-stash__track"
          style={{ transform: `translateX(${offset}px)` }}
        >
          <div className="stash-card stash-card--blue"><span>PDF</span><strong>项目方案.pdf</strong></div>
          <div className="stash-card stash-card--yellow"><span>IMG</span><strong>灵感参考.png</strong></div>
          <div className="stash-card stash-card--violet"><span>ZIP</span><strong>素材合集.zip</strong></div>
        </div>
      </div>
    </div>
  );
}

