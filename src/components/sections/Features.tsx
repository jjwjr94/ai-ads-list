
import { 
  LineChart, 
  Paintbrush, 
  Target, 
  Search, 
  BarChart3, 
  Code2, 
  Users, 
  Share2, 
  Handshake 
} from "lucide-react";

const features = [
  {
    title: "Strategy & Planning",
    description: "AI-powered strategic planning and campaign optimization tools",
    icon: LineChart,
  },
  {
    title: "Creative & Content",
    description: "Generate compelling content and creative assets with AI ad generators and ad creative AI",
    icon: Paintbrush,
  },
  {
    title: "Performance & Media Buying",
    description: "Optimize media spend and campaign performance with AI",
    icon: Target,
  },
  {
    title: "SEO & Organic Growth",
    description: "Enhance organic visibility with AI-powered SEO tools",
    icon: Search,
    link: "/seo-tools"
  },
  {
    title: "Data & Analytics",
    description: "Advanced analytics and insights powered by AI",
    icon: BarChart3,
  },
  {
    title: "Web & App Development",
    description: "AI tools for efficient web and app development",
    icon: Code2,
  },
  {
    title: "Account Management & Client Services",
    description: "Streamline client relationships with AI assistance",
    icon: Users,
  },
  {
    title: "Social Media & Community Management",
    description: "AI-powered social media and community engagement tools",
    icon: Share2,
  },
  {
    title: "Influencer & Partnership Marketing",
    description: "Optimize influencer campaigns and partnerships, including UGC video ads AI.",
    icon: Handshake,
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1F2C] sm:text-4xl">
            Explore AI Tools by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"> Category</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="p-6 transition-all bg-white border rounded-xl hover:shadow-lg hover:border-purple-200 cursor-pointer"
              onClick={() => feature.link && (window.location.href = feature.link)}
            >
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
