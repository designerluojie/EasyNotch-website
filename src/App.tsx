import { HeroSection } from "./components/hero/HeroSection";
import { MacBookMockup } from "./components/mockup/MacBookMockup";
import { ContactSection } from "./components/contact/ContactSection";
import { FAQSection } from "./components/faq/FAQSection";

export function App() {
  return (
    <main className="site-shell">
      <HeroSection />
      <MacBookMockup />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
