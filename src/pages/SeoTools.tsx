
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const seoTools = [
  { name: "AI Rank", url: "https://dejan.ai", description: "AI-powered SEO optimization platform" },
  { name: "Am I on AI", url: "https://amionai.com", description: "AI-driven SEO analytics" },
  { name: "Athena HQ", url: "https://athenahq.ai", description: "AI SEO intelligence platform" },
  { name: "Bluefish AI", url: "https://bluefishai.com", description: "AI-powered SEO automation" },
  { name: "Brandlight", url: "https://brandlight.ai", description: "AI brand and SEO optimization" },
  { name: "Evertune", url: "https://evertune.ai", description: "AI SEO performance tuning" },
  { name: "Model Monitor", url: "https://modelmonitor.ai", description: "AI SEO monitoring solution" },
  { name: "Otterly", url: "https://otterly.ai", description: "AI-enhanced SEO tools" },
  { name: "Peec", url: "https://peec.ai", description: "AI SEO optimization platform" },
  { name: "Quno", url: "https://quno.ai", description: "AI-powered SEO automation" },
  { name: "RankScale", url: "https://rankscale.ai", description: "AI ranking optimization" },
  { name: "Share of Model", url: "https://shareofmodel.ai", description: "AI SEO market share analysis" },
  { name: "Try Profound", url: "https://tryprofound.com", description: "AI-driven SEO insights" },
  { name: "Waikay", url: "https://waikay.io", description: "AI SEO optimization tools" },
  { name: "X Funnel", url: "https://xfunnel.ai", description: "AI funnel optimization for SEO" }
];

const SeoTools = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          SEO & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Organic Growth</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools to enhance your organic visibility and SEO performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seoTools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform hover:-translate-y-1"
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <Search className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SeoTools;
