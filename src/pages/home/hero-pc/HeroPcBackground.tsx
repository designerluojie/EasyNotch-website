import { useEffect, useState } from "react";
import MagicRings from "./MagicRings";
import { HERO_RING_CONFIG } from "./hero-ring-config";

export function HeroPcBackground() {
  const [canRenderWebgl, setCanRenderWebgl] = useState(false);

  useEffect(() => {
    setCanRenderWebgl("WebGL2RenderingContext" in window);
  }, []);

  return (
    <div className="hero-pc__background" aria-hidden="true">
      {canRenderWebgl ? <MagicRings {...HERO_RING_CONFIG} /> : null}
    </div>
  );
}
