import BgGradient from "@/components/common/BgGradient";
import HowItWorksSection from "@/components/common/HowItWorksSection";
import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
      </div>

      {/* CTA Section */}
      {/* <CTASection /> */}
    </div>
  );
}
