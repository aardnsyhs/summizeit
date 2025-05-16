import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/MotionWrapper";
import { SummaryViewer } from "../summaries/SummaryViewer";

const DEMO_SUMMARY = `
# Quick Overview
•📝 This document provides a concise overview of the main ideas, key insights, and actionable takeaways to help readers quickly grasp the content.

# Document Details
•📄 Type: Informational Summary
•👥 Intended For: Professionals, Teams, and Decision Makers

# Key Highlights
•✅ Core concepts are broken down into digestible points
•🚀 Practical applications and examples included
•📌 Important facts and data emphasized for clarity

# Why It Matters
•💡 Helps you understand essential information without reading the full document
•⏱️ Saves time and improves decision-making with summarized insights
•📊 Makes complex ideas easier to communicate and share

# Main Takeaways
•🧠 Focused understanding of key sections
•🔍 Clear distinctions between major themes
•📘 Summary encourages further exploration if needed

# Pro Tips
•⭐ Use this summary as a reference before meetings or discussions
•📌 Highlight specific sections that align with your goals
•📤 Share the summary to improve team alignment

# Key Terms to Know
•📚 Executive Summary – A brief section that outlines the main points
•🗂️ Key Findings – Most impactful or surprising insights from the document
•📎 Action Items – Next steps or recommended actions based on the content

# Final Thoughts
•✨ A well-crafted summary helps turn dense content into clarity—empowering better decisions and smarter communication.
`;

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-center mb-16">
            <MotionH3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-4"
            >
              Discover how <strong>SummizeIt</strong> turns your{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                long and complex PDFs
              </span>{" "}
              into clear, concise summaries!
            </MotionH3>
          </div>
        </div>
        <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6">
          {/* Summary Viewer */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryViewer summary={DEMO_SUMMARY} />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
