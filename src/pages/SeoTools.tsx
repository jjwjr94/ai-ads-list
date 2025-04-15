import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, DollarSign, Building2, Star } from "lucide-react";
import { useState } from "react";

const seoTools = [
  {
    name: "Try Profound",
    url: "https://tryprofound.com",
    description: "AI-driven SEO insights for enterprise brands",
    logo: "/logos/profound_logo.png",
    details: {
      summary: "Enterprise platform for AI search visibility optimization that helps brands understand and improve how they appear in AI search results like ChatGPT and Claude.",
      features: ["Answer Engine Insights", "Conversation Explorer", "Agent Analytics", "Citation tracking", "Real-time brand visibility monitoring", "Competitive benchmarking"],
      pricing: "$3,000-$4,000+ per month per brand (annual contract)",
      bestFor: "Enterprise-level brands needing scale and comprehensive AI search optimization",
      highlighted: true
    }
  },
  {
    name: "Surfer SEO",
    url: "https://surferseo.com",
    description: "Complete SEO content optimization platform",
    logo: "/logos/surfer_logo.png",
    details: {
      summary: "Surfer offers a content optimization workflow that boosts organic traffic, improves search rankings, and helps grow your business through data-driven content creation.",
      features: ["Content Editor with real-time optimization", "SERP Analyzer", "Content Planner", "AI content generation", "Keyword research", "Internal linking automation"],
      pricing: "Essential: $89/month, Advanced: $179/month, Max: $299/month",
      bestFor: "Content creators, SEO professionals, and marketing teams of all sizes",
      highlighted: true
    }
  },
  {
    name: "Clearscope",
    url: "https://clearscope.io",
    description: "Content-first SEO optimization platform",
    logo: "/logos/clearscope_logo.png",
    details: {
      summary: "Clearscope is the #1 content-first SEO platform that makes it ridiculously easy to get more out of your content through AI-powered optimization.",
      features: ["Content optimization", "Keyword research", "Content inventory", "Competitive analysis", "Content briefs", "Performance tracking"],
      pricing: "Essentials: $170/month, Professional: $350/month, Enterprise: Custom pricing",
      bestFor: "Content marketing teams, agencies, and enterprise brands focused on content quality",
      highlighted: true
    }
  },
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
  {
    name: "Athena HQ",
    url: "https://athenahq.ai",
    description: "AI SEO intelligence platform",
    details: {
      summary: "AI-powered platform with prompt generator and comprehensive tracking capabilities",
      features: ["Prompt generator", "Source analytics", "Prompt brainstormer", "Brand monitoring", "Competitor analysis"],
      pricing: "Starts from $300/month (Lite plan) to $900/month (Growth plan)",
      bestFor: "Marketing teams needing comprehensive AI tracking solutions"
    }
  },
  {
    name: "Bluefish AI",
    url: "https://bluefishai.com",
    description: "AI-powered SEO automation",
    details: {
      summary: "Enterprise AI Marketing Suite focused on brand safety and LLM data usage",
      features: ["Brand safety monitoring", "LLM influence", "Sentiment analysis", "Data syndication", "Chatbot platform"],
      pricing: "Enterprise pricing starting at $4,000",
      bestFor: "Large enterprises requiring comprehensive brand protection"
    }
  },
  {
    name: "Brandlight",
    url: "https://brandlight.ai",
    description: "AI brand and SEO optimization",
    details: {
      summary: "Comprehensive brand monitoring and optimization across AI platforms",
      features: ["AI platform monitoring", "Sentiment tracking", "Real-time alerts", "Content optimization", "Reputation management"],
      pricing: "$4,000 to $15,000 monthly",
      bestFor: "Enterprise brands requiring active AI narrative management"
    }
  },
  {
    name: "Evertune",
    url: "https://evertune.ai",
    description: "AI SEO performance tuning",
    details: {
      summary: "Specialized marketing and brand analytics platform for AI systems",
      features: ["AI Brand Index", "Feature analysis", "Content gap identification", "Progress tracking", "Model integration"],
      pricing: "Starting at $5,000 monthly (annual contract)",
      bestFor: "Enterprise brands in competitive markets"
    }
  },
  {
    name: "Model Monitor",
    url: "https://modelmonitor.ai",
    description: "AI SEO monitoring solution",
    details: {
      summary: "Real-time analysis across 50+ AI models with comprehensive tracking",
      features: ["Prompt Radar", "Prompt Vault", "Competitor Analysis", "Sentiment Analysis", "Custom tracking"],
      pricing: "Pro Plan: $49/month (annual) or $99/month (monthly)",
      bestFor: "SMBs wanting cost-effective AI monitoring"
    }
  },
  {
    name: "Otterly",
    url: "https://otterly.ai",
    description: "AI-enhanced SEO tools",
    details: {
      summary: "AI search monitoring platform with multi-country support",
      features: ["Brand monitoring", "Search prompt performance", "Link citation analysis", "Weekly reports", "AI prompt generator"],
      pricing: "Lite: $29/month, Standard: $189/month, Pro: $989/month",
      bestFor: "Small brands tracking limited keywords"
    }
  },
  {
    name: "Peec",
    url: "https://peec.ai",
    description: "AI SEO optimization platform",
    details: {
      summary: "AI search analytics for marketing teams with strong UI/UX",
      features: ["Brand visibility tracking", "Competitor benchmarking", "Source identification", "Trend monitoring"],
      pricing: "Starting at €120/month for in-house teams",
      bestFor: "Marketing teams needing intuitive AI tracking"
    }
  },
  {
    name: "Quno",
    url: "https://quno.ai",
    description: "AI-powered SEO automation",
    details: {
      summary: "Brand intelligence platform with synthetic persona capabilities",
      features: ["AI Visibility Monitoring", "Custom metrics", "Longitudinal studies", "Buyer journey simulation"],
      pricing: "Enterprise pricing (contact sales)",
      bestFor: "Enterprise brands needing deep AI insights"
    }
  },
  {
    name: "RankScale",
    url: "https://rankscale.ai",
    description: "AI ranking optimization",
    details: {
      summary: "Generative Engine Optimization (GEO) platform in beta",
      features: ["Website audits", "Performance tracking", "Competitor benchmarking", "Content recommendations"],
      pricing: "Beta pricing - contact for details",
      bestFor: "Early adopters interested in GEO optimization"
    }
  },
  {
    name: "Share of Model",
    url: "https://shareofmodel.ai",
    description: "AI SEO market share analysis",
    details: {
      summary: "Unified brand perception tracking across AI models by Jellyfish",
      features: ["Cross-model tracking", "Perception analysis", "Sentiment analysis", "Strategy optimization"],
      pricing: "Enterprise pricing (contact sales)",
      bestFor: "Large brands requiring comprehensive AI tracking"
    }
  },
  {
    name: "Waikay",
    url: "https://waikay.io",
    description: "AI SEO optimization tools",
    details: {
      summary: "Brand monitoring tool with unique fact-checking capabilities",
      features: ["AI Brand Score", "Fact checking", "Knowledge graph", "Multi-language support"],
      pricing: "Starting at $19.95/month for single brand",
      bestFor: "Companies concerned about AI factual accuracy"
    }
  },
  {
    name: "X Funnel",
    url: "https://xfunnel.ai",
    description: "AI funnel optimization for SEO",
    details: {
      summary: "AI search engine monitoring with focus on user journeys",
      features: ["ICP analysis", "Market segmentation", "Competitive tracking", "Journey optimization"],
      pricing: "Pro: $199/month (unlimited queries)",
      bestFor: "Brands focused on customer journey optimization"
    }
  }
];

const SeoTools = () => {
  const [filter, setFilter] = useState("all");
  
  const filteredTools = filter === "highlighted" 
    ? seoTools.filter(tool => tool.details?.highlighted) 
    : seoTools;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          SEO & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Organic Growth</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools to enhance your organic visibility and SEO performance
        </p>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            All Tools
          </button>
          <button 
            onClick={() => setFilter("highlighted")}
            className={`px-4 py-2 rounded-md ${filter === "highlighted" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Featured Tools
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredTools.map((tool) => (
          <Card key={tool.name} className={`flex flex-col h-full hover:shadow-lg transition-shadow ${tool.details?.highlighted ? 'border-purple-300 bg-purple-50/30' : ''}`}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                {tool.logo ? (
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`} 
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Search className="w-6 h-6 text-purple-600" />
                )}
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
              {tool.details?.highlighted && (
                <div className="ml-auto">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Featured</span>
                </div>
              )}
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
