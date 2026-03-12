import { Navbar } from "../src/components/landing/Navbar";
import { HeroSection } from "../src/components/landing/HeroSection";
import { InfiniteResources } from "../src/components/landing/InfiniteResources";
import { FeaturesSection } from "../src/components/landing/FeaturesSection";
import { SocialProofSection } from "../src/components/landing/SocialProofSection";
import { CTASection } from "../src/components/landing/CTASection";
import { Footer } from "../src/components/landing/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="relative z-10 mx-auto w-full min-h-screen overflow-hidden flex flex-col scroll-smooth">
        {/* Full-width dark futuristic gradient background matching black, gray, and a slight blue tint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black opacity-100 pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col min-h-max max-w-7xl mx-auto w-full">
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <InfiniteResources />
          <SocialProofSection />
          <CTASection />
        </div>
      </div>
      {/* Footer spans full width at the bottom naturally */}
      <Footer />
    </main>
  );
}
