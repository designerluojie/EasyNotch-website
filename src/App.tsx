import { HeroPcPage } from "./pages/home/hero-pc/HeroPcPage";
import { ShowcaseSection } from "./pages/home/showcase/ShowcaseSection";

export function App() {
  return (
    <main className="site-shell">
      <HeroPcPage />
      <ShowcaseSection />
    </main>
  );
}
