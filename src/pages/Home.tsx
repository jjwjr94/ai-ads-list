
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { initialCompanies } from '@/data/initialCompanies';

const Home = () => {
  const { companies, addCompany } = useCompanyDatabase();

  // Initialize database with companies if empty
  useEffect(() => {
    if (companies.length === 0) {
      initialCompanies.forEach(company => {
        addCompany(company);
      });
    }
  }, [companies.length, addCompany]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Marketing Tools</span> Directory
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover AI-powered tools to transform your marketing strategy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Find the Right AI Tools</h2>
          <p className="text-gray-700 mb-4">
            Explore our comprehensive directory of AI marketing tools across 12 different categories, from creative content generation to data analytics and everything in between.
          </p>
          <Link 
            to="/explore" 
            className="inline-block px-6 py-3 bg-[#9b87f5] text-white font-medium rounded-md hover:bg-[#7E69AB] transition-colors"
          >
            Explore Categories
          </Link>
        </div>
        <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Featured Tools</h2>
          <p className="text-gray-700 mb-4">
            Discover our hand-picked selection of the most innovative AI marketing tools that are transforming how brands connect with their audiences.
          </p>
          <Link 
            to="/seo-organic" 
            className="inline-block px-6 py-3 bg-[#9b87f5] text-white font-medium rounded-md hover:bg-[#7E69AB] transition-colors"
          >
            View Featured Tools
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-8 rounded-lg shadow-sm mb-12">
        <h2 className="text-2xl font-bold mb-4">Why AI Marketing Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
            <p className="text-gray-700">
              Automate repetitive tasks and streamline workflows to focus on strategic initiatives.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Personalization</h3>
            <p className="text-gray-700">
              Deliver tailored experiences to your audience at scale with AI-powered insights.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-700">
              Optimize campaigns in real-time based on data-driven predictions and recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Explore our comprehensive directory of AI marketing tools and find the perfect solutions to enhance your marketing strategy.
        </p>
        <Link 
          to="/explore" 
          className="inline-block px-8 py-4 bg-[#9b87f5] text-white font-medium rounded-md hover:bg-[#7E69AB] transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
