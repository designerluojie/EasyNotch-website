import { useState } from "react";
import { MagicRingsBackground } from "./MagicRingsBackground";
import { FloatingNav } from "./FloatingNav";
import { getDownloadUrl, SITE_COPY } from "../../config/site";
import productMark from "../../assets/figma/product-mark-h5.svg";
import "./hero.css";

export function HeroSection() {
  const [notice, setNotice] = useState<string | null>(null);

  const handleDemoClick = () => {
    const url = getDownloadUrl();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    setNotice("体验包暂未开放下载");
    window.setTimeout(() => setNotice(null), 2200);
  };

  return (
    <section className="hero-section site-section--hero">
      <MagicRingsBackground />
      <FloatingNav />
      <div className="hero-section__content">
        <img className="hero-section__mark" src={productMark} alt="" />
        <h1>{SITE_COPY.heroTitle}</h1>
        <p>
          {SITE_COPY.heroDescription[0]}
          <br />
          {SITE_COPY.heroDescription[1]}
        </p>
        <button className="hero-demo-button" type="button" onClick={handleDemoClick}>
          <span aria-hidden="true">↓</span>
          立即体验Demo
        </button>
      </div>
      {notice ? <div className="hero-notice" role="status">{notice}</div> : null}
    </section>
  );
}
