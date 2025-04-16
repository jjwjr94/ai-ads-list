import React, { useState, useEffect } from 'react';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Category, Company } from '@/types/database';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Filter } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CompanyCard from '@/components/ui/company-card';

const CompanyCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="w-16 h-16 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
};

interface CategoryPageProps {
  category: Category;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { getCompaniesByCategory, isLoading, error, refreshCompanies } = useCompanyDatabase();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showAiNativeOnly, setShowAiNativeOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log(`Fetching companies for category: ${category}`);
      const categoryCompanies = await getCompaniesByCategory(category);
      console.log(`Fetched ${categoryCompanies.length} companies for ${category}`);
      setCompanies(categoryCompanies);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    
    const handleFocus = () => {
      fetchCompanies();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [category]);

  const filteredCompanies = companies.filter(company => {
    const featuredCheck = showFeatured ? company.details?.highlighted : true;
    const aiNativeCheck = showAiNativeOnly ? 
      (company.aiNativeCriteria?.hasDotAiDomain || 
       company.aiNativeCriteria?.foundedAfter2020 || 
       company.aiNativeCriteria?.seriesAOrEarlier) : true;
    
    return featuredCheck && aiNativeCheck;
  });

  const categoryTitle = category.split(' & ');

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          {categoryTitle[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">& {categoryTitle[1]}</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools for {category.toLowerCase()}
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshCompanies().then(fetchCompanies)}
          className="mr-2"
        >
          Refresh Data
        </Button>
        
        <div className="flex gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">AI-Native Only:</span>
            <Button 
              variant={showAiNativeOnly ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowAiNativeOnly(!showAiNativeOnly)}
              disabled={loading}
              className={showAiNativeOnly ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {showAiNativeOnly ? (
                <>
                  <Filter className="h-4 w-4 mr-1" /> AI-Native
                </>
              ) : (
                "All Companies"
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Featured Only:</span>
            <Button 
              variant={showFeatured ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowFeatured(!showFeatured)}
              disabled={loading}
            >
              {showFeatured ? (
                <>
                  <Star className="h-4 w-4 mr-1 text-yellow-400" /> Featured
                </>
              ) : (
                "All Companies"
              )}
            </Button>
          </div>
        </div>
      </div>

      {loading || isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading companies. Please try again later.</p>
          {error && <p className="text-sm text-gray-500 mt-2">{error.toString()}</p>}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No companies found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export const StrategyPlanningPage = () => <CategoryPage category={Category.STRATEGY_PLANNING} />;
export const CreativeContentPage = () => <CategoryPage category={Category.CREATIVE_CONTENT} />;
export const PerformanceMediaPage = () => <CategoryPage category={Category.PERFORMANCE_MEDIA} />;
export const SeoOrganicPage = () => <CategoryPage category={Category.SEO_ORGANIC} />;
export const DataAnalyticsPage = () => <CategoryPage category={Category.DATA_ANALYTICS} />;
export const WebAppDevelopmentPage = () => <CategoryPage category={Category.WEB_APP_DEVELOPMENT} />;
export const AccountManagementPage = () => <CategoryPage category={Category.ACCOUNT_MANAGEMENT} />;
export const SocialMediaPage = () => <CategoryPage category={Category.SOCIAL_MEDIA} />;
export const InfluencerMarketingPage = () => <CategoryPage category={Category.INFLUENCER_MARKETING} />;
export const BrandManagementPage = () => <CategoryPage category={Category.BRAND_MANAGEMENT} />;
export const AdFraudPage = () => <CategoryPage category={Category.AD_FRAUD} />;
export const AdNativePage = () => <CategoryPage category={Category.AI_NATIVE} />;
export const CopywritingPage = () => <CategoryPage category={Category.COPYWRITING} />;
export const AnalyticsPage = () => <CategoryPage category={Category.ANALYTICS} />;
export const SeoPage = () => <CategoryPage category={Category.SEO} />;
