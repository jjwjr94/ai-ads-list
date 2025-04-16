import { useState, useEffect } from "react";
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Category } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, DollarSign, Building2, Star, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from '@/components/ui/logo';

const SeoTools = () => {
  const { getCompaniesByCategory, isLoading, error } = useCompanyDatabase();
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const seoCompanies = await getCompaniesByCategory(Category.SEO_ORGANIC);
        setCompanies(seoCompanies);
      } catch (err) {
        console.error('Error fetching SEO companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [getCompaniesByCategory]);

  const filteredCompanies = filter === "highlighted" 
    ? companies.filter(company => company.details?.highlighted) 
    : companies;

  // Loading skeletons for the cards
  const SkeletonCard = () => (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            disabled={loading || isLoading}
          >
            All Tools
          </button>
          <button 
            onClick={() => setFilter("highlighted")}
            className={`px-4 py-2 rounded-md ${filter === "highlighted" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            disabled={loading || isLoading}
          >
            Featured Tools
          </button>
        </div>
      </div>

      {loading || isLoading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading SEO tools. Please try again later.</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No SEO tools found. Please add some companies to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className={`flex flex-col h-full hover:shadow-lg transition-shadow ${company.details?.highlighted ? 'border-purple-300 bg-purple-50/30' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Logo 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  size="md"
                  className="bg-white"
                />
                <div>
                  <CardTitle className="text-xl">
                    <a
                      href={company.url}
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
                        {company.details.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Pricing:</span>
                      <span className="text-gray-600">{company.details.pricing}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Best For:</span>
                      <span className="text-gray-600">{company.details.bestFor}</span>
                    </div>
                    
                    {company.linkedinUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <a 
                          href={company.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
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

export default SeoTools;
