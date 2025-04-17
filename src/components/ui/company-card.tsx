
import React from 'react';
import { Company } from '@/types/frontend.models';
import {
  Card,
  CardContent,
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
import { ExternalLink, Star, Globe, DollarSign, Building2, Calendar } from 'lucide-react';
import Logo from '@/components/ui/logo';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
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
              {company.category && (
                <Badge variant="outline" className="border-purple-500 text-purple-600">
                  {company.category}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
          </div>
          <Logo 
            src={company.logoUrl} 
            alt={`${company.name} logo`}
            size="lg"
            className="ml-4"
            company={company}
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
              {company.foundedYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#9b87f5]" />
                  <div>
                    <h4 className="text-sm font-medium">Founded</h4>
                    <p className="text-sm text-gray-600">{company.foundedYear}</p>
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
