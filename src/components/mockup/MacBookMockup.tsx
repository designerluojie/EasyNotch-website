import { useState } from "react";
import pcBody from "../../assets/figma/pc-body.png";
import pcScreenBody from "../../assets/figma/pc-screen-body.png";
import pcWallpaper from "../../assets/figma/pc-wallpaper.png";
import { NotchChrome } from "./NotchChrome";
import { ModuleTabs } from "./ModuleTabs";
import type { ModuleId } from "../../types/modules";
import "./mockup.css";

export function MacBookMockup() {
  const [activeModule, setActiveModule] = useState<ModuleId>("music");

  return (
    <section className="showcase-section" aria-label="Notch 功能演示">
      <div className="macbook-mockup">
        <img className="macbook-mockup__screen-body" src={pcScreenBody} alt="" />
        <img className="macbook-mockup__wallpaper" src={pcWallpaper} alt="MacBook 屏幕" />
        <div className="macbook-mockup__notch">
          <NotchChrome activeModule={activeModule} />
        </div>
        <img className="macbook-mockup__body" src={pcBody} alt="" />
      </div>
      <ModuleTabs activeModule={activeModule} onSelectModule={setActiveModule} />
    </section>
  );
}
