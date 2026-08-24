import HeroSection from "../../components/landing/HeroSection";
import StatsSection from "../../components/landing/StatsSection";
import CategoriesSection from "../../components/landing/CategoriesSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import RolesSection from "../../components/landing/RolesSection";
import CTASection from "../../components/landing/CTASection";
import PlatformVisionSection from "../../components/landing/PlatformVisionSection";
import MarketplacePreview from "../../components/landing/MarketplacePreview";

function Home() {
  return (
    <>
      <HeroSection />
      <PlatformVisionSection />
      <StatsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <RolesSection />
      <MarketplacePreview />
      <CTASection />
    </>
  );
}

export default Home;
