import { useEffect, useRef, useState } from "react";
import productMark from "../../../assets/figma/hero-pc/product-mark.svg";
import ctaArrow from "../../../assets/figma/hero-pc/cta-arrow.svg";
import { getDownloadUrl, SITE_COPY } from "../../../config/site";
import { HeroPcBackground } from "./HeroPcBackground";
import { HeroPcNavigation } from "./HeroPcNavigation";
import "./hero-pc.css";

export function HeroPcPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const handleDemoClick = () => {
    const downloadUrl = getDownloadUrl();
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setNotice("体验包暂未开放下载");
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 2200);
  };

  return (
    <section className="hero-pc" aria-labelledby="hero-pc-title">
      <HeroPcBackground />
      <HeroPcNavigation />
      <div className="hero-pc__content">
        <img className="hero-pc__product-mark" src={productMark} alt="" />
        <h1 id="hero-pc-title">{SITE_COPY.heroTitle}</h1>
        <p>
          {SITE_COPY.heroDescription[0]}
          <br />
          {SITE_COPY.heroDescription[1]}
        </p>
        <button className="hero-pc__cta" type="button" onClick={handleDemoClick}>
          <img src={ctaArrow} alt="" />
          <span>立即体验Demo</span>
        </button>
      </div>
      {notice ? <div className="hero-pc__notice" role="status">{notice}</div> : null}
    </section>
  );
}
