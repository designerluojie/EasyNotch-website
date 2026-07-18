import { HeroPcPage } from "./pages/home/hero-pc/HeroPcPage";
import { ShowcaseSection } from "./pages/home/showcase/ShowcaseSection";
import { FaqSection } from "./pages/home/faq/FaqSection";
import { ContactSection } from "./pages/home/contact/ContactSection";

export function App() {
  return (
    <main className="site-shell">
      <HeroPcPage />
      <ShowcaseSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
