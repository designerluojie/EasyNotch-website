import { useEffect, useState } from "react";
import ctaArrow from "../../../assets/figma/hero-pc/cta-arrow.svg";
import githubIcon from "../../../assets/figma/hero-pc/github.svg";
import productMark from "../../../assets/figma/hero-pc/product-mark.svg";
import { SITE_COPY } from "../../../config/site";

interface HeroPcNavigationProps {
  onDemoClick: () => void;
}

const NAV_COLLAPSED_WIDTH = 678;
const NAV_EXPANDED_WIDTH = 1000;
const NAV_TRIGGER_SCROLL = 500;

export function HeroPcNavigation({ onDemoClick }: HeroPcNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateNavigationState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nextExpanded = window.scrollY >= NAV_TRIGGER_SCROLL;
        setIsExpanded(nextExpanded);
      });
    };

    updateNavigationState();
    window.addEventListener("scroll", updateNavigationState, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateNavigationState);
    };
  }, []);

  return (
    <nav
      className={`hero-pc__navigation${isExpanded ? " hero-pc__navigation--revealed" : ""}`}
      aria-label="主导航"
      data-expanded={isExpanded}
      data-revealed={isExpanded}
      style={{ width: `${isExpanded ? NAV_EXPANDED_WIDTH : NAV_COLLAPSED_WIDTH}px` }}
    >
      <div className="hero-pc__navigation-content">
        <img className="hero-pc__nav-logo" src={productMark} alt="" aria-hidden="true" />
        <span className="hero-pc__brand">{SITE_COPY.productName}</span>

        <a
          className="hero-pc__github"
          href={SITE_COPY.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <img src={githubIcon} alt="" />
        </a>

        <button className="hero-pc__nav-cta" type="button" onClick={onDemoClick}>
          <img src={ctaArrow} alt="" />
          <span>立即体验Demo</span>
        </button>
      </div>
    </nav>
  );
}
