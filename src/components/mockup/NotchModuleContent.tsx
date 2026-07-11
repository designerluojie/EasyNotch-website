import type { ModuleId } from "../../types/modules";

type Props = { activeModule: ModuleId };

export function NotchModuleContent({ activeModule }: Props) {
  return (
    <div className="notch-module-content" data-module={activeModule}>
      <span>{activeModule}</span>
    </div>
  );
}
