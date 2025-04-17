import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Category } from '@/types/frontend.models';
import { Loader2, Database, BarChart, PenTool, LineChart, Globe, Code, Users, MessageSquare } from 'lucide-react';

export const Explore = () => {
  const { companies, isLoading } = useCompanies();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (companies.length > 0) {
      const counts: Record<string, number> = {};
      companies.forEach(company => {
        counts[company.category] = (counts[company.category] || 0) + 1;
      });
      setCategoryCounts(counts);
    }
  }, [companies]);

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
      case Category.SOCIAL_MEDIA:
        return MessageSquare;
      default:
        return Database;
    }
  };

  const categoryCards = [
    { 
      title: Category.STRATEGY_PLANNING, 
      path: '/strategy-planning',
      description: 'AI tools for strategic planning and decision-making',
      count: categoryCounts[Category.STRATEGY_PLANNING] || 0
    },
    { 
      title: Category.CREATIVE_CONTENT, 
      path: '/creative-content',
      description: 'AI-powered content creation and creative tools',
      count: categoryCounts[Category.CREATIVE_CONTENT] || 0
    },
    { 
      title: Category.PERFORMANCE_MEDIA, 
      path: '/performance-media',
      description: 'AI solutions for media buying and campaign optimization',
      count: categoryCounts[Category.PERFORMANCE_MEDIA] || 0
    },
    { 
      title: Category.SEO_ORGANIC, 
      path: '/seo-organic',
      description: 'AI tools for SEO and organic growth strategies',
      count: categoryCounts[Category.SEO_ORGANIC] || 0
    },
    { 
      title: Category.DATA_ANALYTICS, 
      path: '/data-analytics',
      description: 'AI-powered data analysis and visualization tools',
      count: categoryCounts[Category.DATA_ANALYTICS] || 0
    },
    { 
      title: Category.WEB_APP_DEVELOPMENT, 
      path: '/web-app-development',
      description: 'AI solutions for web and app development',
      count: categoryCounts[Category.WEB_APP_DEVELOPMENT] || 0
    },
    { 
      title: Category.SOCIAL_MEDIA, 
      path: '/social-media',
      description: 'AI solutions for social media and community management',
      count: categoryCounts[Category.SOCIAL_MEDIA] || 0
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">AI Marketing Tools</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools across all marketing functions
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-[#9b87f5] animate-spin" />
          <p className="ml-2 text-gray-600">Loading category data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((category) => {
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
