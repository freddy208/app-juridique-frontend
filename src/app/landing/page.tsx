import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ModulesSection from "./components/ModulesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-gray-900 overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ModulesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
