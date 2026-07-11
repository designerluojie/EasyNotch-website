import type { ModuleId } from "../../types/modules";
import { MODULE_LABELS } from "./moduleData";
import "./mockup.css";

const MODULE_ORDER: ModuleId[] = [
  "music",
  "fileStash",
  "aiChat",
  "clipboard",
  "pomodoro",
];

type Props = {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
};

export function ModuleTabs({ activeModule, onSelectModule }: Props) {
  return (
    <div className="module-tabs" role="tablist" aria-label="Notch 模块">
      {MODULE_ORDER.map((module) => (
        <button
          key={module}
          className={`module-tabs__item${activeModule === module ? " module-tabs__item--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeModule === module}
          aria-pressed={activeModule === module}
          onClick={() => onSelectModule(module)}
        >
          {MODULE_LABELS[module]}
        </button>
      ))}
    </div>
  );
}
