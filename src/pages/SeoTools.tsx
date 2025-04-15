import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, DollarSign, Building2, Star } from "lucide-react";

const seoTools = [
  {
    name: "AI Rank",
    url: "https://dejan.ai",
    description: "AI-powered SEO optimization platform by Dan Petrovic",
    details: {
      summary: "Track entity associations with your brand using OpenAI models and monitor brand rankings in AI responses.",
      features: ["Entity association tracking", "Brand ranking monitoring", "Grounded AI responses", "10 queries per project limit in demo"],
      pricing: "Free in demo mode with limited queries",
      bestFor: "SEO freelancers, small agencies, and consultancies"
    }
  },
  {
    name: "Am I on AI",
    url: "https://amionai.com",
    description: "Brand monitoring solution for AI search",
    details: {
      summary: "Monitor brand presence across ChatGPT, Perplexity, and Gemini",
      features: ["Brand Monitoring", "Competitor Rank", "Prompt Tracking", "Source Analysis", "Sentiment Analysis"],
      pricing: "Contact for pricing",
      bestFor: "Early-stage companies interested in AI brand monitoring"
    }
  },
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
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          SEO & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Organic Growth</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools to enhance your organic visibility and SEO performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {seoTools.map((tool) => (
          <Card key={tool.name} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-600 transition-colors"
                  >
                    {tool.name}
                  </a>
                </CardTitle>
                <CardDescription className="text-sm mt-1">{tool.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {tool.details && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{tool.details.summary}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="w-4 h-4 text-purple-600" />
                      Key Features:
                    </div>
                    <ul className="pl-6 text-sm text-gray-600 list-disc">
                      {tool.details.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Pricing:</span>
                    <span className="text-gray-600">{tool.details.pricing}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Best For:</span>
                    <span className="text-gray-600">{tool.details.bestFor}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeoTools;
