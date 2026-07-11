import { useEffect, useState } from "react";
import ctaArrow from "../../../assets/figma/hero-pc/cta-arrow.svg";
import githubIcon from "../../../assets/figma/hero-pc/github.svg";
import productMark from "../../../assets/figma/hero-pc/product-mark.svg";
import { SITE_COPY } from "../../../config/site";
import BorderGlow from "./BorderGlow";
import { HERO_BORDER_GLOW_COLORS } from "./hero-border-glow-config";

interface HeroPcNavigationProps {
  onDemoClick: () => void;
}

export function HeroPcNavigation({ onDemoClick }: HeroPcNavigationProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateScrollProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  const width = 680 + (Math.min(scrollY, 500) / 500) * 320;
  const revealProgress = Math.min(scrollY, 300) / 300;
  const navigationPadding = 32 * revealProgress;

  return (
    <BorderGlow
      backgroundColor="#141119"
      borderRadius={24}
      colors={[...HERO_BORDER_GLOW_COLORS]}
      className="hero-pc__navigation"
      style={{ width: `${width}px` }}
    >
      <nav
        className="hero-pc__navigation-content"
        aria-label="主导航"
        style={{ paddingLeft: `${navigationPadding}px`, paddingRight: `${navigationPadding}px` }}
      >
        <div className="hero-pc__navigation-left">
          <span className="hero-pc__nav-logo-shell" style={{ width: `${40 * revealProgress}px`, opacity: revealProgress }}>
            <img className="hero-pc__nav-logo" src={productMark} alt="" style={{ transform: `translateX(${-40 * (1 - revealProgress)}px)` }} />
          </span>
          <span className="hero-pc__brand">{SITE_COPY.productName}</span>
        </div>
        <div className="hero-pc__navigation-right">
          <a
            className="hero-pc__github"
            href={SITE_COPY.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <img src={githubIcon} alt="" />
          </a>
          <span className="hero-pc__nav-cta-shell" style={{ width: `${160 * revealProgress}px`, opacity: revealProgress }}>
            <button
              className="hero-pc__nav-cta"
              type="button"
              onClick={onDemoClick}
              style={{ transform: `translateX(${160 * (1 - revealProgress)}px)` }}
            >
              <img src={ctaArrow} alt="" />
              <span>立即体验Demo</span>
            </button>
          </span>
        </div>
      </nav>
    </BorderGlow>
  );
}
