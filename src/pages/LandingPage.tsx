import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Database, Lightbulb, CodeSquare, PieChart } from "lucide-react";
import { supabaseAPI } from '../lib/supabase';
import { Company } from '../types/database';
import CompanyCard from '@/components/ui/company-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const LandingPage = () => {
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCompanies = async () => {
      try {
        setIsLoading(true);
        const highlighted = await supabaseAPI.companies.getHighlighted();
        if (highlighted && highlighted.length > 0) {
          const shuffledHighlighted = [...highlighted].sort(() => 0.5 - Math.random());
          setFeaturedCompanies(shuffledHighlighted);
        } else {
          const allCompanies = await supabaseAPI.companies.getAll();
          const randomCompanies = [...allCompanies]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(6, allCompanies.length));
          setFeaturedCompanies(randomCompanies);
        }
      } catch (error) {
        console.error('Error fetching featured companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fa]">
      <section className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-[#1A1F2C] mb-6">
            Discover the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">AI Marketing Tools</span> for Your Business
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore our curated directory of AI-powered marketing solutions to transform your strategy, optimize campaigns, and drive better results.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/explore">
              <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6 py-6 rounded-lg text-lg">
                Explore Tools <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500">Loading featured tools...</div>
            </div>
          ) : featuredCompanies.length > 0 ? (
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredCompanies.map((company) => (
                  <CarouselItem key={company.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <CompanyCard company={company} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4 gap-2">
                <CarouselPrevious className="relative static mx-2" />
                <CarouselNext className="relative static mx-2" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center text-gray-500">
              No featured companies available at the moment.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1F2C] mb-4">Explore By Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive directory of AI marketing tools organized by function
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "SEO & Organic", icon: CodeSquare, path: "/seo-organic", color: "bg-[#E5DEFF]" },
              { title: "Content Creation", icon: Lightbulb, path: "/creative-content", color: "bg-[#FDE1D3]" },
              { title: "Social Media", icon: Search, path: "/social-media", color: "bg-[#D3E4FD]" },
              { title: "Analytics", icon: PieChart, path: "/data-analytics", color: "bg-[#F2FCE2]" },
              { title: "Web Development", icon: CodeSquare, path: "/web-app-development", color: "bg-[#FFDEE2]" },
              { title: "Strategy Planning", icon: Database, path: "/strategy-planning", color: "bg-[#FEF7CD]" }
            ].map((category, index) => (
              <Link to={category.path} key={index} className="group">
                <div className={`${category.color} rounded-lg p-8 transition-transform transform hover:scale-105`}>
                  <category.icon className="h-10 w-10 text-[#9b87f5] mb-4" />
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#9b87f5] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">Discover AI tools for {category.title.toLowerCase()}</p>
                  <span className="text-[#9b87f5] font-medium flex items-center">
                    Explore Category <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/explore">
              <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 px-6 py-3 rounded-lg">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#f8f9fa] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1F2C] mb-4">Why Use AI Marketing Tools?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI is transforming the marketing landscape, empowering teams to work smarter and achieve better results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-[#E5DEFF] p-3 inline-block mb-4">
                <Lightbulb className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Increased Efficiency</h3>
              <p className="text-gray-600">
                Automate repetitive tasks and streamline workflows to focus on strategic initiatives
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-[#FDE1D3] p-3 inline-block mb-4">
                <Search className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enhanced Personalization</h3>
              <p className="text-gray-600">
                Deliver tailored experiences to your audience at scale with AI-powered insights
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-[#F2FCE2] p-3 inline-block mb-4">
                <PieChart className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Make informed marketing decisions backed by advanced analytics and predictions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="rounded-full bg-[#D3E4FD] p-3 inline-block mb-4">
                <Database className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Edge</h3>
              <p className="text-gray-600">
                Stay ahead of competitors by leveraging cutting-edge AI technologies
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1A1F2C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Marketing with AI?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start exploring our directory of AI marketing tools today and find the perfect solutions for your business
            </p>
            <Link to="/explore">
              <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 py-6 rounded-lg text-lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
