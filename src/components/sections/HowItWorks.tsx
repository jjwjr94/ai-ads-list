
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Browse AI Tools",
    description: "Explore our curated collection of marketing AI tools",
  },
  {
    title: "Compare Features",
    description: "Find the perfect tools that match your needs",
  },
  {
    title: "Implement & Scale",
    description: "Easily integrate AI tools into your marketing strategy",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#F1F0FB]/50">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1F2C] sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">Get started with AI-powered marketing in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
                <span className="ml-2 text-sm font-medium text-purple-600">Step {index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1F2C]">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
