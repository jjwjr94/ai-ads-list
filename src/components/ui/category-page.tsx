import React, { useEffect, useState, useCallback } from 'react';
import { Category } from '@/types/frontend.models';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, DollarSign, Building2, Star, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import Logo from '@/components/ui/logo';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface CategoryPageProps {
  category: Category;
}

const SkeletonCard: React.FC = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { getCompaniesByCategory, isLoading, refreshCompanies } = useCompanyDatabase();
  const [companies, setCompanies] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCompanies = await getCompaniesByCategory(category);
      
      console.log(`Found ${fetchedCompanies.length} ${category} companies`);
      setCompanies(fetchedCompanies);
    } catch (err) {
      console.error(`Error fetching ${category} companies:`, err);
      toast({
        title: 'Error',
        description: `Failed to fetch ${category} companies. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [category, getCompaniesByCategory, toast]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshCompanies();
      toast({
        title: 'Success',
        description: 'Companies list has been refreshed.',
      });
    } catch (err) {
      console.error('Error refreshing companies:', err);
      toast({
        title: 'Error',
        description: 'Failed to refresh companies. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();

    const intervalId = setInterval(() => {
      if (!loading && !isRefreshing) {
        console.log(`Auto-refreshing ${category} data`);
        fetchCompanies();
      }
    }, 300000); // every 5 minutes

    return () => clearInterval(intervalId);
  }, [category, fetchCompanies]);

  const filteredCompanies = companies.filter(company => {
    const matchesFilter = filter === "all" || (filter === "highlighted" && company.details?.highlighted);
    const matchesSearch = searchQuery.toLowerCase().trim() === "" || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.features?.some((feature: string) => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const categoryLinks = [
    { title: Category.STRATEGY_PLANNING, path: '/strategy-planning' },
    { title: Category.CREATIVE_CONTENT, path: '/creative-content' },
    { title: Category.PERFORMANCE_MEDIA, path: '/performance-media' },
    { title: Category.SEO_ORGANIC, path: '/seo-organic' },
    { title: Category.DATA_ANALYTICS, path: '/data-analytics' },
    { title: Category.WEB_APP_DEVELOPMENT, path: '/web-app-development' },
    { title: Category.ACCOUNT_MANAGEMENT, path: '/account-management' },
    { title: Category.SOCIAL_MEDIA, path: '/social-media' },
    { title: Category.INFLUENCER_MARKETING, path: '/influencer-marketing' },
    { title: Category.BRAND_MANAGEMENT, path: '/brand-management' },
    { title: Category.AD_FRAUD, path: '/ad-fraud' },
    { title: Category.AI_NATIVE, path: '/ai-native' }
  ];

  const formatCategoryTitle = (categoryString: string): string => {
    return categoryString.replace(/_/g, ' ');
  };

  const categoryTitle = formatCategoryTitle(category);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          {categoryTitle.split('&')[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            {categoryTitle.includes('&') ? `& ${categoryTitle.split('&')[1]}` : ''}
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools for {categoryTitle.toLowerCase()}
        </p>

        <div className="mt-6 flex max-w-md mx-auto gap-2">
          <Input
            type="text"
            placeholder="Search tools in this category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            disabled={loading}
          >
            All Tools
          </button>
          <button 
            onClick={() => setFilter("highlighted")}
            className={`px-4 py-2 rounded-md ${filter === "highlighted" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            disabled={loading}
          >
            Featured Tools
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tools found in this category. Please check back later or try another category.</p>
          <button 
            onClick={fetchCompanies}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured tools found in this category. Try viewing all tools instead.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className={`flex flex-col h-full hover:shadow-lg transition-shadow ${company.details?.highlighted ? 'border-purple-300 bg-purple-50/30' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Logo 
                  src={company.logoUrl || company.logo || ''} 
                  alt={`${company.name} logo`}
                  size="md"
                  className="bg-white"
                />
                <div>
                  <CardTitle className="text-xl">
                    <a
                      href={company.website || company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600 transition-colors"
                    >
                      {company.name}
                    </a>
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">{company.description}</CardDescription>
                </div>
                {company.details?.highlighted && (
                  <div className="ml-auto">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {company.details && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{company.details.summary}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Star className="w-4 h-4 text-purple-600" />
                        Key Features:
                      </div>
                      <ul className="pl-6 text-sm text-gray-600 list-disc">
                        {(company.details.features || company.features || []).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Pricing:</span>
                      <span className="text-gray-600">{company.details.pricing || company.pricing}</span>
                    </div>

                    {company.details.bestFor && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Best For:</span>
                        <span className="text-gray-600">{company.details.bestFor}</span>
                      </div>
                    )}
                    
                    {(company.linkedinUrl || company.website || company.url) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-purple-600" />
                        {company.linkedinUrl ? (
                          <a 
                            href={company.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        ) : (
                          <a 
                            href={company.website || company.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
