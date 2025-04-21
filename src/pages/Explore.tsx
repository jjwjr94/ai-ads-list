import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Category } from '@/types/frontend.models';
import { SearchBar } from '@/components/SearchBar';
import { SearchDropdown } from '@/components/SearchDropdown';
import { 
  Loader2, Database, BarChart, PenTool, LineChart, Globe, Code, 
  Users, MessageSquare, Briefcase, Users2, Shield, Layout 
} from 'lucide-react';

export const Explore = () => {
  const { companies, isLoading, loadCompanies } = useCompanies();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized) {
        await loadCompanies();
        setIsInitialized(true);
      }
    };

    initializeData();
  }, [isInitialized, loadCompanies]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    
    if (companies && companies.length > 0) {
      companies.forEach(company => {
        const category = company.category || '';
        counts[category] = (counts[category] || 0) + 1;
      });
    }
    
    setCategoryCounts(counts);
  }, [companies]);
  
  const categoryCards = [
    { 
      title: Category.STRATEGY_PLANNING, 
      path: '/strategy-planning',
      description: 'AI marketing strategy, planning and decision-making',
      count: categoryCounts[Category.STRATEGY_PLANNING] || 0
    },
    { 
      title: Category.CREATIVE_CONTENT, 
      path: '/creative-content',
      description: 'AI ad generators, ad creative AI, AI content creation and similar tools',
      count: categoryCounts[Category.CREATIVE_CONTENT] || 0
    },
    { 
      title: Category.PERFORMANCE_MEDIA, 
      path: '/performance-media',
      description: 'AI media buying and campaign optimization',
      count: categoryCounts[Category.PERFORMANCE_MEDIA] || 0
    },
    { 
      title: Category.SEO_ORGANIC, 
      path: '/seo-organic',
      description: 'Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), AI SEO tools',
      count: categoryCounts[Category.SEO_ORGANIC] || 0
    },
    { 
      title: Category.DATA_ANALYTICS, 
      path: '/data-analytics',
      description: 'AI data analysis and visualization tools',
      count: categoryCounts[Category.DATA_ANALYTICS] || 0
    },
    { 
      title: Category.WEB_APP_DEVELOPMENT, 
      path: '/web-app-development',
      description: 'AI website builders, AI website generators',
      count: categoryCounts[Category.WEB_APP_DEVELOPMENT] || 0
    },
    { 
      title: Category.ACCOUNT_MANAGEMENT, 
      path: '/account-management',
      description: 'AI tools for client and account management',
      count: categoryCounts[Category.ACCOUNT_MANAGEMENT] || 0
    },
    { 
      title: Category.SOCIAL_MEDIA, 
      path: '/social-media',
      description: 'AI-powered social media and community management',
      count: categoryCounts[Category.SOCIAL_MEDIA] || 0
    },
    { 
      title: Category.INFLUENCER_MARKETING, 
      path: '/influencer-marketing',
      description: 'UGC video ads AI, AI influencers discovery and campaign management',
      count: categoryCounts[Category.INFLUENCER_MARKETING] || 0
    },
    { 
      title: Category.BRAND_MANAGEMENT, 
      path: '/brand-management',
      description: 'AI-powered brand management and asset organization',
      count: categoryCounts[Category.BRAND_MANAGEMENT] || 0
    },
    { 
      title: Category.AD_FRAUD, 
      path: '/ad-fraud',
      description: 'AI-powered ad fraud detection and prevention',
      count: categoryCounts[Category.AD_FRAUD] || 0
    },
    { 
      title: Category.AI_NATIVE, 
      path: '/ai-native',
      description: 'AI-native agencies and consulting services',
      count: categoryCounts[Category.AI_NATIVE] || 0
    },
    { 
      title: Category.B2B_LEAD_GEN, 
      path: '/b2b-lead-gen',
      description: 'AI tools for B2B lead generation and sales',
      count: categoryCounts[Category.B2B_LEAD_GEN] || 0
    },
    { 
      title: Category.CAMPAIGN_OPERATIONS, 
      path: '/campaign-operations',
      description: 'AI-powered campaign management and optimization',
      count: categoryCounts[Category.CAMPAIGN_OPERATIONS] || 0
    },
    { 
      title: Category.ECOMMERCE, 
      path: '/ecommerce',
      description: 'AI solutions for ecommerce marketing and sales',
      count: categoryCounts[Category.ECOMMERCE] || 0
    },
    { 
      title: Category.SIMULATION_FORECASTING, 
      path: '/simulation-forecasting',
      description: 'AI-powered simulation and forecasting tools for marketing and business planning',
      count: categoryCounts[Category.SIMULATION_FORECASTING] || 0
    },
    { 
      title: Category.AFFILIATE, 
      path: '/affiliate',
      description: 'AI tools for affiliate marketing and performance tracking',
      count: categoryCounts[Category.AFFILIATE] || 0
    }
  ];
  
  const [filteredCards, setFilteredCards] = useState(categoryCards);

  useEffect(() => {
    if (searchQuery) {
      const filtered = categoryCards.filter(card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(categoryCards);
    }
  }, [categoryCards, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.STRATEGY_PLANNING:
        return BarChart;
      case Category.CREATIVE_CONTENT:
        return PenTool;
      case Category.PERFORMANCE_MEDIA:
        return LineChart;
      case Category.SEO_ORGANIC:
        return Globe;
      case Category.DATA_ANALYTICS:
        return LineChart;
      case Category.WEB_APP_DEVELOPMENT:
        return Code;
      case Category.ACCOUNT_MANAGEMENT:
        return Briefcase;
      case Category.SOCIAL_MEDIA:
        return MessageSquare;
      case Category.INFLUENCER_MARKETING:
        return Users2;
      case Category.BRAND_MANAGEMENT:
        return Users;
      case Category.AD_FRAUD:
        return Shield;
      case Category.AI_NATIVE:
        return Layout;
      case Category.B2B_LEAD_GEN:
        return BarChart;
      case Category.CAMPAIGN_OPERATIONS:
        return LineChart;
      case Category.ECOMMERCE:
        return Code;
      case Category.SIMULATION_FORECASTING:
        return BarChart;
      case Category.AFFILIATE:
        return Code;
      default:
        return Database;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">AI Marketing Tools</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools across all marketing functions
        </p>
        <div className="mt-8 relative">
          <SearchBar onSearch={handleSearch} />
          <SearchDropdown 
            companies={companies}
            categoryCards={categoryCards}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      {isLoading && companies.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-[#9b87f5] animate-spin" />
          <p className="ml-2 text-gray-600">Loading category data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((category) => {
            const IconComponent = getCategoryIcon(category.title);
            return (
              <Link 
                key={category.title}
                to={category.path}
                className="block group"
              >
                <div className="h-full border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#9b87f5]">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="rounded-full bg-[#f8f9fa] p-2 mr-3">
                        <IconComponent className="h-6 w-6 text-[#9b87f5]" />
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-[#9b87f5]">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{category.count} tools</span>
                      <span className="text-[#9b87f5] text-sm font-medium">Explore →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Explore;
