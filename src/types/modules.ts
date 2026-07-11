export type ModuleId =
  | "music"
  | "fileStash"
  | "aiChat"
  | "clipboard"
  | "pomodoro";

export type LayoutMode = "mobile" | "desktop";

export type ModuleSize = {
  width: number;
  height: number;
};

export const MODULE_TARGETS: Record<ModuleId, ModuleSize> = {
  music: { width: 290, height: 60 },
  fileStash: { width: 290, height: 60 },
  aiChat: { width: 290, height: 200 },
  clipboard: { width: 290, height: 90 },
  pomodoro: { width: 290, height: 148 },
};

export function layoutModeForWidth(width: number): LayoutMode {
  return width > 600 ? "desktop" : "mobile";
}
