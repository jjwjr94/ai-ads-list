
import { BarChart3, Target, Zap, TrendingUp, Users, Brain } from "lucide-react";

const features = [
  {
    title: "Smart Ad Creation",
    description: "Generate high-converting ad copy and visuals in seconds with AI",
    icon: Brain,
  },
  {
    title: "Performance Analytics",
    description: "Track and optimize your campaigns with AI-driven insights",
    icon: BarChart3,
  },
  {
    title: "Audience Targeting",
    description: "Reach the right audience with AI-powered targeting",
    icon: Target,
  },
  {
    title: "Quick Implementation",
    description: "Easy-to-use tools that integrate with your existing workflow",
    icon: Zap,
  },
  {
    title: "ROI Optimization",
    description: "Maximize your marketing budget with AI optimization",
    icon: TrendingUp,
  },
  {
    title: "Customer Insights",
    description: "Understand your audience better with AI analytics",
    icon: Users,
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1F2C] sm:text-4xl">
            Everything You Need for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"> AI-Powered Marketing</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 transition-all bg-white border rounded-xl hover:shadow-lg">
              <feature.icon className="w-10 h-10 p-2 text-purple-600 bg-purple-100 rounded-lg" />
              <h3 className="mt-4 text-xl font-semibold text-[#1A1F2C]">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
