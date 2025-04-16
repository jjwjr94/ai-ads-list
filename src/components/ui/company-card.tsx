
import React from 'react';
import { Company } from '@/types/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ExternalLink, Star, Globe, DollarSign, Building2, Calendar, MapPin } from 'lucide-react';
import Logo from '@/components/ui/logo';

interface CompanyCardProps {
  company: Company;
}

/**
 * Enhanced CompanyCard component with improved logo display and consistent styling
 * Now with automatic logo finding capabilities and AI-native criteria badges
 */
const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  // Check if company meets AI-native criteria
  const isAiNative = company.aiNativeCriteria?.hasDotAiDomain || 
                     company.aiNativeCriteria?.foundedAfter2020 || 
                     company.aiNativeCriteria?.seriesAOrEarlier;
  
  // Get AI-native criteria details for display
  const aiNativeBadges = [];
  if (company.aiNativeCriteria?.hasDotAiDomain) {
    aiNativeBadges.push('.ai domain');
  }
  if (company.aiNativeCriteria?.foundedAfter2020) {
    aiNativeBadges.push('Founded after 2020');
  }
  if (company.aiNativeCriteria?.seriesAOrEarlier) {
    aiNativeBadges.push('Series A or earlier');
  }

  // Force logo refresh by adding company object, which includes lastUpdated timestamp
  const logoSrc = company.logoUrl || company.logo;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${company.details?.highlighted ? 'border-[#9b87f5] border-2' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {company.details?.highlighted && (
                <Badge variant="secondary" className="bg-[#9b87f5] text-white">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
              {isAiNative && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  AI-Native
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
            <CardDescription className="mt-1">{company.description}</CardDescription>
          </div>
          <Logo 
            src={logoSrc} 
            alt={`${company.name} logo`}
            size="lg"
            className="ml-4"
            company={company} // Pass company for auto-finding logo and cache busting
          />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 min-h-[150px]">
            <p className="text-sm text-gray-600">{company.description}</p>
            {aiNativeBadges.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">AI-Native Criteria:</p>
                <div className="flex flex-wrap gap-1">
                  {aiNativeBadges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="features" className="pt-4 min-h-[150px]">
            <ul className="list-disc pl-5 space-y-1">
              {company.features?.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600">{feature}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="details" className="pt-4 min-h-[150px]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#9b87f5]" />
                <div>
                  <h4 className="text-sm font-medium">Pricing</h4>
                  <p className="text-sm text-gray-600">{company.pricing || "Contact for pricing"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#9b87f5]" />
                <div>
                  <h4 className="text-sm font-medium">Best For</h4>
                  <p className="text-sm text-gray-600">{company.targetAudience || "Various business sizes"}</p>
                </div>
              </div>
              {company.aiNativeCriteria?.foundedAfter2020 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#9b87f5]" />
                  <div>
                    <h4 className="text-sm font-medium">Founded</h4>
                    <p className="text-sm text-gray-600">After 2020</p>
                  </div>
                </div>
              )}
              {company.aiNativeCriteria?.seriesAOrEarlier && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 flex items-center justify-center text-[#9b87f5] font-bold text-xs">$</span>
                  <div>
                    <h4 className="text-sm font-medium">Funding Stage</h4>
                    <p className="text-sm text-gray-600">Series A or earlier</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" asChild>
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
