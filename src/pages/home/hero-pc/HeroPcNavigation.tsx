import githubIcon from "../../../assets/figma/hero-pc/github.svg";
import { SITE_COPY } from "../../../config/site";

export function HeroPcNavigation() {
  return (
    <nav className="hero-pc__navigation" aria-label="主导航">
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
    </nav>
  );
}
