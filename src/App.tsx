import { HeroSection } from "./components/hero/HeroSection";

export function App() {
  return (
    <main className="site-shell">
      <HeroSection />
      <section aria-label="Product showcase" className="site-section" />
      <section aria-label="Frequently asked questions" className="site-section" />
      <section aria-label="Contact" className="site-section" />
    </main>
  );
}
