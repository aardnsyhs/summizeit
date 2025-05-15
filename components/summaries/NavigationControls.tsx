import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSectionSelect,
}: {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSectionSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 sm:px-6 sm:py-4 bg-background/80 backdrop-blur-xs border-t border-rose-500/10">
      <div className="flex justify-between items-center gap-4 sm:gap-6">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentSection === 0}
          className={cn(
            "rounded-full w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 bg-gradient-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10",
            currentSection === 0 ? "opacity-50" : "hover:bg-rose-500/20"
          )}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Dots */}
        <div className="flex gap-1.5 sm:gap-2">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={`section-dot-${index}`}
              onClick={() => onSectionSelect(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                "w-2 h-2 sm:w-2.5 sm:h-2.5",
                currentSection === index
                  ? "bg-gradient-to-br from-rose-500 to-rose-600"
                  : "bg-rose-500/20 hover:bg-rose-500/30"
              )}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          className={cn(
            "rounded-full w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 bg-gradient-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10",
            currentSection === totalSections - 1
              ? "opacity-50"
              : "hover:bg-rose-500/20"
          )}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </div>
  );
}
