import type { ModuleId } from "../../types/modules";
import { AIChatModule } from "../../modules/ai-chat/AIChatModule";
import { ClipboardModule } from "../../modules/clipboard/ClipboardModule";
import { FileStashModule } from "../../modules/file-stash/FileStashModule";
import { MusicModule } from "../../modules/music/MusicModule";
import { PomodoroModule } from "../../modules/pomodoro/PomodoroModule";
import "../../styles/modules.css";

type Props = { activeModule: ModuleId };

export function NotchModuleContent({ activeModule }: Props) {
  return (
    <div className="notch-module-content" data-module={activeModule}>
      {activeModule === "music" && <MusicModule />}
      {activeModule === "fileStash" && <FileStashModule />}
      {activeModule === "aiChat" && <AIChatModule />}
      {activeModule === "clipboard" && <ClipboardModule />}
      {activeModule === "pomodoro" && <PomodoroModule demoMultiplier={60} />}
    </div>
  );
}
