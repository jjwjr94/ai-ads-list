
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Database, Lightbulb, CodeSquare, PieChart } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fa]">
      {/* Hero Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold tracking-tight text-[#1A1F2C] mb-6">
              Discover the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">AI Marketing Tools</span> for Your Business
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore our curated directory of AI-powered marketing solutions to transform your strategy, optimize campaigns, and drive better results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/explore">
                <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6 py-6 rounded-lg text-lg">
                  Explore Tools <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/seo-tools">
                <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 px-6 py-6 rounded-lg text-lg">
                  SEO Tools
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f8f9fa] p-6 rounded-lg">
                  <Search className="h-8 w-8 text-[#9b87f5] mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Find Tools</h3>
                  <p className="text-gray-600">Discover AI tools for every marketing need</p>
                </div>
                <div className="bg-[#f8f9fa] p-6 rounded-lg">
                  <Database className="h-8 w-8 text-[#9b87f5] mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Compare Options</h3>
                  <p className="text-gray-600">Compare features and pricing across tools</p>
                </div>
                <div className="bg-[#f8f9fa] p-6 rounded-lg">
                  <Lightbulb className="h-8 w-8 text-[#9b87f5] mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Get Insights</h3>
                  <p className="text-gray-600">Learn industry best practices</p>
                </div>
                <div className="bg-[#f8f9fa] p-6 rounded-lg">
                  <PieChart className="h-8 w-8 text-[#9b87f5] mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Track Results</h3>
                  <p className="text-gray-600">Measure the impact of AI on your marketing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Why Use AI Section */}
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

      {/* CTA Section */}
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
