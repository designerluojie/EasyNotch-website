import type { ModuleId } from "../../types/modules";
import { MODULE_TARGETS } from "../../types/modules";

export const MODULE_LABELS: Record<ModuleId, string> = {
  music: "音乐",
  fileStash: "文件暂存",
  aiChat: "AI Chat",
  clipboard: "剪贴板",
  pomodoro: "番茄钟",
};

export { MODULE_TARGETS };
