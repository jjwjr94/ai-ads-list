
import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowRight, Wand2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[#F1F0FB]/50" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 mb-6">
            <Wand2 className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">AI-Powered Marketing Tools</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1A1F2C] sm:text-5xl md:text-6xl">
            Find the Best AI Tools for Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
              Marketing Campaigns
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 sm:text-xl">
            Discover and compare the most powerful AI tools to enhance your marketing strategy, boost engagement, and drive better results.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <GradientButton className="w-full sm:w-auto">
              Explore AI Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
};
