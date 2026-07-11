import { HeroSection } from "./components/hero/HeroSection";
import { MacBookMockup } from "./components/mockup/MacBookMockup";

export function App() {
  return (
    <main className="site-shell">
      <HeroSection />
      <MacBookMockup />
      <section aria-label="Frequently asked questions" className="site-section" />
      <section aria-label="Contact" className="site-section" />
    </main>
  );
}
