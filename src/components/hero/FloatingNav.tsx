import type { CSSProperties } from "react";
import { interpolate, useScrollProgress } from "../../hooks/useScrollProgress";
import { SITE_COPY } from "../../config/site";
import "./hero.css";

export function FloatingNav() {
  const progress = useScrollProgress();
  const width = interpolate(680, 1000, progress);

  return (
    <nav
      className={`floating-nav${progress > 0.6 ? " floating-nav--expanded" : ""}`}
      style={{ "--nav-width": `${width}px` } as CSSProperties}
      aria-label="主导航"
    >
      <span className="floating-nav__brand">{SITE_COPY.productName}</span>
      <div className="floating-nav__actions">
        <a
          className="floating-nav__demo"
          href={SITE_COPY.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          立即体验
        </a>
        <a
          className="floating-nav__github"
          href={SITE_COPY.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          ◎
        </a>
      </div>
    </nav>
  );
}
