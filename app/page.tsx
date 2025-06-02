import BgGradient from "@/components/common/BgGradient";
import HowItWorksSection from "@/components/common/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import { pricingPlans } from "@/utils/constants";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <PricingSection plans={pricingPlans} />
        <CTASection />
      </div>
    </div>
  );
}
