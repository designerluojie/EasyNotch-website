import { motion } from "motion/react";
import type { ModuleId } from "../../types/modules";
import { MODULE_TARGETS } from "./moduleData";
import { NotchModuleContent } from "./NotchModuleContent";
import "./mockup.css";

type Props = {
  activeModule: ModuleId;
};

export function NotchChrome({ activeModule }: Props) {
  const targetSize = MODULE_TARGETS[activeModule];

  return (
    <motion.div
      className="notch-chrome"
      animate={{ width: targetSize.width, height: targetSize.height }}
      transition={{ type: "spring", visualDuration: 0.2, bounce: 0.42 }}
      data-testid="notch-chrome"
    >
      <NotchModuleContent activeModule={activeModule} />
    </motion.div>
  );
}
