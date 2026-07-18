import { useEffect, useState } from "react";
import mobileRingCenter from "../../../assets/figma/hero-mobile/ring-center.svg";
import mobileRingLeft from "../../../assets/figma/hero-mobile/ring-left.svg";
import mobileRingRight from "../../../assets/figma/hero-mobile/ring-right.svg";
import MagicRings from "./MagicRings";
import { HERO_RING_CONFIG } from "./hero-ring-config";

export function HeroPcBackground() {
  const [canRenderWebgl, setCanRenderWebgl] = useState(false);

  useEffect(() => {
    setCanRenderWebgl("WebGL2RenderingContext" in window);
  }, []);

  return (
    <div className="hero-pc__background" aria-hidden="true">
      <div className="hero-pc__mobile-rings">
        <img className="hero-pc__mobile-ring hero-pc__mobile-ring--center" src={mobileRingCenter} alt="" />
        <img className="hero-pc__mobile-ring hero-pc__mobile-ring--left" src={mobileRingLeft} alt="" />
        <img className="hero-pc__mobile-ring hero-pc__mobile-ring--right" src={mobileRingRight} alt="" />
      </div>
      {canRenderWebgl ? <MagicRings {...HERO_RING_CONFIG} /> : null}
    </div>
  );
}
