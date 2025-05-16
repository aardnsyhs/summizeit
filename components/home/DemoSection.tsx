import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/MotionWrapper";
import { SummaryViewer } from "../summaries/SummaryViewer";

const DEMO_SUMMARY = `
# Quick Overview
•🎯Comprehensive Next.js 15 course covering everything from fundamentals to advanced deployment strategies.

# Document Details
•📑Type: Technical Course
•👥For: Web Developers & React Engineers

# Key Highlights
•🚀Complete guide to Next.js 15's App Router
•⭐Server Components & Server Actions deep dive
•💫Full-stack application development with Next.js

# Why It Matters
•💡Next.js is becoming the industry standard for React applications, offering superior performance, SEO, and developer experience. This course provides the essential knowledge needed to build modern web applications.

# 📄 Main Points
•🎨Modern application architecture with App Router
•💻Server and Client Components best practices
•🔄Data fetching patterns and caching strategies
•🛠️Authentication and API route implementation
•📱Responsive design and component libraries

# Pro Tips
•⭐Always consider server components as your default choice
•💎Implement route groups for better code organization
•🌟Use loading.tsx and error.tsx for better UX

# Key Terms to Know
•📚Server Components: React components that render on the server for better performance
•🔍Route Groups: Next.js feature for organizing routes without affecting URL structure
•🎯Streaming: Technique for progressively rendering UI components
•🔄Suspense: React feature for handling loading states

# Bottom Line
•💫Master Next.js 15 to build fast, scalable, and SEO-friendly web applications with the latest React features and best practices.

# 🔥 Final Thoughts
This course transforms developers into Next.js experts, enabling them to build production-ready applications with confidence and efficiency.
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
