import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company, Category } from '../types/database';
import { supabaseAPI } from '../lib/supabase';
import { initialCompanies } from '../data/initialCompanies';

// Create context for the database
interface CompanyContextType {
  companies: Company[];
  getCompaniesByCategory: (category: Category) => Promise<Company[]>;
  getCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Company) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  searchCompanies: (query: string) => Promise<Company[]>;
  uploadLogo: (id: string, file: File, altText: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  refreshCompanies: () => Promise<void>;
  mockMode: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState<boolean>(false);

  // Function to load companies from Supabase
  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      
      // Check if Supabase environment variables are missing
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn("Missing Supabase credentials. Running in mock mode with sample data.");
        setMockMode(true);
      }
      
      // Get all companies from Supabase (or mock data if in mock mode)
      let allCompanies = await supabaseAPI.companies.getAll();
      
      // If no companies exist in Supabase but we have the credentials, initialize with sample data
      if (allCompanies.length === 0 && supabaseUrl && supabaseKey) {
        console.log('No companies found in Supabase, initializing with sample data');
        
        // Add each company to the database
        for (const company of initialCompanies) {
          await supabaseAPI.companies.add(company);
        }
        
        // Get the updated list
        allCompanies = await supabaseAPI.companies.getAll();
      }
      
      setCompanies(allCompanies);
      setError(null);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please check your connection or Supabase credentials.');
      // Fallback to initial companies data
      setCompanies(initialCompanies);
      setMockMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh companies
  const refreshCompanies = async () => {
    await loadCompanies();
  };
  
  // Load companies on initial render
  useEffect(() => {
    loadCompanies();
    
    // Add event listener for window focus to refresh companies
    const handleFocus = () => {
      loadCompanies();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Database operations using Supabase
  const getCompaniesByCategory = async (category: Category) => {
    try {
      return await supabaseAPI.companies.getByCategory(category);
    } catch (err) {
      console.error('Error getting companies by category:', err);
      setError('Failed to get companies by category from Supabase.');
      return [];
    }
  };

  const getCompanyById = async (id: string) => {
    try {
      return await supabaseAPI.companies.getById(id);
    } catch (err) {
      console.error('Error getting company by ID:', err);
      setError('Failed to get company details from Supabase.');
      return null;
    }
  };

  const addCompany = async (company: Company) => {
    try {
      const newCompany = await supabaseAPI.companies.add(company);
      await refreshCompanies();
      return newCompany;
    } catch (err) {
      console.error('Error adding company:', err);
      setError('Failed to add company to Supabase.');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const updatedCompany = await supabaseAPI.companies.update(id, updates);
      if (updatedCompany) {
        await refreshCompanies();
      }
      return updatedCompany;
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company in Supabase.');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const success = await supabaseAPI.companies.delete(id);
      if (success) {
        await refreshCompanies();
      }
      return success;
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company from Supabase.');
      return false;
    }
  };

  const getHighlightedCompanies = async () => {
    try {
      return await supabaseAPI.companies.getHighlighted();
    } catch (err) {
      console.error('Error getting highlighted companies:', err);
      setError('Failed to get highlighted companies from Supabase.');
      return [];
    }
  };

  const searchCompanies = async (query: string) => {
    try {
      return await supabaseAPI.companies.search(query);
    } catch (err) {
      console.error('Error searching companies:', err);
      setError('Failed to search companies in Supabase.');
      return [];
    }
  };

  const uploadLogo = async (id: string, file: File, altText: string) => {
    try {
      const logoUrl = await supabaseAPI.storage.uploadLogo(id, file, altText);
      // Refresh companies to get updated logo paths
      await refreshCompanies();
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo to Supabase storage.');
      throw err;
    }
  };

  const value = {
    companies,
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany,
    getHighlightedCompanies,
    searchCompanies,
    uploadLogo,
    isLoading,
    error,
    refreshCompanies,
    mockMode
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the company database
export const useCompanyDatabase = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyDatabase must be used within a CompanyProvider');
  }
  return context;
};
