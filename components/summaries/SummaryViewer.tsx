"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { NavigationControls } from "./NavigationControls";
import ProgressBar from "./ProgressBar";
import { splitSummary } from "@/utils/summary-helpers";
import ContentSection from "./ContentSection";
import { MotionDiv } from "../common/MotionWrapper";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
      <h2 className="text-2xl lg:text-3xl font-bold text-center flex items-center justify-center gap-2">
        {title}
      </h2>
    </div>
  );
};

export function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);
  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  const sections = splitSummary(summary);

  if (sections.length === 0) {
    return <p>No summary data found.</p>;
  }

  return (
    <Card className="relative px-4 h-[480px] sm:h-[550px] md:h-[600px] lg:h-[640px] w-full max-w-md sm:max-w-lg md:max-w-xl overflow-hidden bg-gradient-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      <ProgressBar sections={sections} currentSection={currentSection} />
      <MotionDiv
        key={currentSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24"
      >
        <div className="px-sm sm:px-4">
          <SectionTitle title={sections[currentSection]?.title || ""} />
          <ContentSection
            title={sections[currentSection]?.title || ""}
            content={sections[currentSection]?.content || ""}
          />
        </div>
      </MotionDiv>

      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSectionSelect={setCurrentSection}
      />
    </Card>
  );
}
