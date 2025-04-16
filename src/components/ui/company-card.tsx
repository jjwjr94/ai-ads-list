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
import { ExternalLink, Star, Globe, DollarSign, Building2 } from 'lucide-react';
import Logo from '@/components/ui/logo';

interface CompanyCardProps {
  company: Company;
}

/**
 * Enhanced CompanyCard component with improved logo display and consistent styling
 * Now with automatic logo finding capabilities
 */
const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${company.details.highlighted ? 'border-[#9b87f5] border-2' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {company.details.highlighted && (
                <Badge variant="secondary" className="bg-[#9b87f5] text-white">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
            <CardDescription className="mt-1">{company.description}</CardDescription>
          </div>
          <Logo 
            src={company.logo} 
            alt={`${company.name} logo`}
            size="lg"
            className="ml-4"
            company={company} // Pass company for auto-finding logo
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
            <p className="text-sm text-gray-600">{company.details.summary}</p>
          </TabsContent>
          <TabsContent value="features" className="pt-4 min-h-[150px]">
            <ul className="list-disc pl-5 space-y-1">
              {company.details.features.map((feature, index) => (
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
                  <p className="text-sm text-gray-600">{company.details.pricing}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#9b87f5]" />
                <div>
                  <h4 className="text-sm font-medium">Best For</h4>
                  <p className="text-sm text-gray-600">{company.details.bestFor}</p>
                </div>
              </div>
              {company.foundedYear && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 flex items-center justify-center text-[#9b87f5] font-bold text-xs">Y</span>
                  <div>
                    <h4 className="text-sm font-medium">Founded</h4>
                    <p className="text-sm text-gray-600">{company.foundedYear}</p>
                  </div>
                </div>
              )}
              {company.headquarters && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 flex items-center justify-center text-[#9b87f5] font-bold text-xs">HQ</span>
                  <div>
                    <h4 className="text-sm font-medium">Headquarters</h4>
                    <p className="text-sm text-gray-600">{company.headquarters}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" asChild>
          <a href={company.url} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
        {company.linkedinUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-1 h-3 w-3" /> LinkedIn
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
