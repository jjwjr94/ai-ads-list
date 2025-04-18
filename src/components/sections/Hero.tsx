
import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowRight, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCompanyDatabase } from "@/context/CompanyContext";
import { Company } from "@/types/frontend.models";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel";
import CompanyCard from "@/components/ui/company-card";
import { useCarouselAutoRotation } from "@/hooks/useCarouselAutoRotation";

export const Hero = () => {
  const navigate = useNavigate();
  const { companies, isLoading, getHighlightedCompanies } = useCompanyDatabase();
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const handleExploreClick = () => {
    navigate("/explore");
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log("Fetching companies for hero carousel");
        const highlighted = await getHighlightedCompanies();
        
        if (highlighted && highlighted.length >= 3) {
          console.log(`Found ${highlighted.length} highlighted companies for carousel`);
          setDisplayCompanies(highlighted as Company[]);
        } else if (companies.length > 0) {
          console.log("Not enough highlighted companies, selecting random ones");
          const shuffled = [...companies].sort(() => 0.5 - Math.random());
          setDisplayCompanies(shuffled.slice(0, Math.min(6, companies.length)) as Company[]);
        }
      } catch (error) {
        console.error("Error fetching companies for carousel:", error);
        if (companies.length > 0) {
          const shuffled = [...companies].sort(() => 0.5 - Math.random());
          setDisplayCompanies(shuffled.slice(0, Math.min(6, companies.length)) as Company[]);
        }
      }
    };

    if (!isLoading && companies.length > 0) {
      fetchCompanies();
    }
  }, [isLoading, companies, getHighlightedCompanies]);

  useCarouselAutoRotation(carouselApi);

  return (
    <section className="relative px-6 py-8 overflow-hidden bg-gradient-to-b from-[#F1F0FB] to-white">
      {/* Banner image - full width with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/lovable-uploads/ac9b3c33-296d-4d01-a43f-1efd008f9b6f.png" 
          alt="AI Marketing Banner" 
          className="w-full h-full object-cover rounded-xl opacity-90"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center">
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 mb-2">
              <Wand2 className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">AI-Powered Marketing Tools</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Discover the Best 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E5DEFF] to-white">
                AI Ads and AI Marketing Tools for Your Business
              </span>
            </h1>
            <p className="max-w-2xl mx-auto mb-3 text-lg text-gray-100 sm:text-xl">
              Explore cutting-edge solutions for AI ads and AI marketing to supercharge your team's efficiency, output and performance.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center mb-4">
              <GradientButton 
                onClick={handleExploreClick} 
                className="w-full sm:w-auto"
              >
                Explore AI Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </GradientButton>
            </div>
            
            {displayCompanies.length > 0 && (
              <div className="mt-2 px-4 md:px-10 bg-white/80 py-4 rounded-xl">
                <Carousel
                  opts={{
                    align: "center",
                    loop: true,
                  }}
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="-ml-1">
                    {displayCompanies.map((company) => (
                      <CarouselItem key={company.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <CompanyCard company={company} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            )}
            
            {displayCompanies.length === 0 && (
              <div className="mt-2 text-gray-100">
                {isLoading ? "Loading featured tools..." : "No featured tools available yet"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
