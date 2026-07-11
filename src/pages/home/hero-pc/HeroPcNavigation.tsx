import githubIcon from "../../../assets/figma/hero-pc/github.svg";
import { SITE_COPY } from "../../../config/site";
import BorderGlow from "./BorderGlow";

export function HeroPcNavigation() {
  return (
    <BorderGlow
      backgroundColor="#141119"
      borderRadius={24}
      className="hero-pc__navigation"
    >
      <nav className="hero-pc__navigation-content" aria-label="主导航">
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
    </BorderGlow>
  );
}
