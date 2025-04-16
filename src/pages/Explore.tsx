
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Category } from '@/types/database';
import { 
  StrategyPlanningPage, 
  CreativeContentPage, 
  PerformanceMediaPage,
  SeoOrganicPage,
  DataAnalyticsPage,
  WebAppDevelopmentPage,
  AccountManagementPage,
  SocialMediaPage,
  InfluencerMarketingPage,
  BrandManagementPage,
  AdFraudPage,
  AdNativePage
} from './CategoryPages';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Explore = () => {
  const { getCompaniesByCategory } = useCompanyDatabase();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch counts for each category when component mounts
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching category counts from Supabase...');
        const counts: Record<string, number> = {};
        for (const category of Object.values(Category)) {
          try {
            const companies = await getCompaniesByCategory(category);
            counts[category] = companies.length;
            console.log(`${category}: ${companies.length} tools`);
          } catch (err) {
            console.error(`Error fetching counts for ${category}:`, err);
            counts[category] = 0;
          }
        }
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch category data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryCounts();
  }, [getCompaniesByCategory]);

  // Create category cards with links to category pages
  const categoryCards = [
    { 
      title: Category.STRATEGY_PLANNING, 
      path: '/strategy-planning',
      component: StrategyPlanningPage,
      description: 'AI tools for strategic planning and decision-making',
      count: categoryCounts[Category.STRATEGY_PLANNING] || 0
    },
    { 
      title: Category.CREATIVE_CONTENT, 
      path: '/creative-content',
      component: CreativeContentPage,
      description: 'AI-powered content creation and creative tools',
      count: categoryCounts[Category.CREATIVE_CONTENT] || 0
    },
    { 
      title: Category.PERFORMANCE_MEDIA, 
      path: '/performance-media',
      component: PerformanceMediaPage,
      description: 'AI solutions for media buying and campaign optimization',
      count: categoryCounts[Category.PERFORMANCE_MEDIA] || 0
    },
    { 
      title: Category.SEO_ORGANIC, 
      path: '/seo-organic',
      component: SeoOrganicPage,
      description: 'AI tools for SEO and organic growth strategies',
      count: categoryCounts[Category.SEO_ORGANIC] || 0
    },
    { 
      title: Category.DATA_ANALYTICS, 
      path: '/data-analytics',
      component: DataAnalyticsPage,
      description: 'AI-powered data analysis and visualization tools',
      count: categoryCounts[Category.DATA_ANALYTICS] || 0
    },
    { 
      title: Category.WEB_APP_DEVELOPMENT, 
      path: '/web-app-development',
      component: WebAppDevelopmentPage,
      description: 'AI solutions for web and app development',
      count: categoryCounts[Category.WEB_APP_DEVELOPMENT] || 0
    },
    { 
      title: Category.ACCOUNT_MANAGEMENT, 
      path: '/account-management',
      component: AccountManagementPage,
      description: 'AI tools for client and account management',
      count: categoryCounts[Category.ACCOUNT_MANAGEMENT] || 0
    },
    { 
      title: Category.SOCIAL_MEDIA, 
      path: '/social-media',
      component: SocialMediaPage,
      description: 'AI solutions for social media and community management',
      count: categoryCounts[Category.SOCIAL_MEDIA] || 0
    },
    { 
      title: Category.INFLUENCER_MARKETING, 
      path: '/influencer-marketing',
      component: InfluencerMarketingPage,
      description: 'AI tools for influencer discovery and campaign management',
      count: categoryCounts[Category.INFLUENCER_MARKETING] || 0
    },
    { 
      title: Category.BRAND_MANAGEMENT, 
      path: '/brand-management',
      component: BrandManagementPage,
      description: 'AI solutions for brand management and asset organization',
      count: categoryCounts[Category.BRAND_MANAGEMENT] || 0
    },
    { 
      title: Category.AD_FRAUD, 
      path: '/ad-fraud',
      component: AdFraudPage,
      description: 'AI tools for ad fraud detection and prevention',
      count: categoryCounts[Category.AD_FRAUD] || 0
    },
    { 
      title: Category.AD_NATIVE, 
      path: '/ad-native',
      component: AdNativePage,
      description: 'AI-native agencies and consulting services',
      count: categoryCounts[Category.AD_NATIVE] || 0
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
          {categoryCards.map((category) => (
            <Link 
              key={category.title}
              to={category.path}
              className="block group"
            >
              <div className="h-full border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#9b87f5]">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#9b87f5]">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{category.count} tools</span>
                    <span className="text-[#9b87f5] text-sm font-medium">Explore →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
