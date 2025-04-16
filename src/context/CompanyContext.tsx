
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company, Category } from '../types/database';
import { companyDatabase } from '../lib/database';
import { 
  strategyPlanningCompanies,
  creativeContentCompanies,
  performanceMediaCompanies,
  seoOrganicCompanies,
  dataAnalyticsCompanies
} from '../data/initialCompanies';

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
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load companies
  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      
      // Get all companies from the database
      let allCompanies = await companyDatabase.getAllCompanies();
      
      // If no companies exist, initialize with sample data
      if (allCompanies.length === 0) {
        const initialCompanies = [
          ...strategyPlanningCompanies,
          ...creativeContentCompanies,
          ...performanceMediaCompanies,
          ...seoOrganicCompanies,
          ...dataAnalyticsCompanies
        ];
        
        // Add each company to the database
        for (const company of initialCompanies) {
          await companyDatabase.addCompany(company);
        }
        
        // Get the updated list
        allCompanies = await companyDatabase.getAllCompanies();
      }
      
      setCompanies(allCompanies);
      setError(null);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please try again later.');
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

  // Database operations wrapped with state updates
  const getCompaniesByCategory = async (category: Category) => {
    try {
      const result = await companyDatabase.getCompaniesByCategory(category);
      return result;
    } catch (err) {
      console.error('Error getting companies by category:', err);
      setError('Failed to get companies by category.');
      return [];
    }
  };

  const getCompanyById = async (id: string) => {
    try {
      return await companyDatabase.getCompanyById(id);
    } catch (err) {
      console.error('Error getting company by ID:', err);
      setError('Failed to get company details.');
      return null;
    }
  };

  const addCompany = async (company: Company) => {
    try {
      const newCompany = await companyDatabase.addCompany(company);
      await refreshCompanies();
      return newCompany;
    } catch (err) {
      console.error('Error adding company:', err);
      setError('Failed to add company.');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const updatedCompany = await companyDatabase.updateCompany(id, updates);
      if (updatedCompany) {
        await refreshCompanies();
      }
      return updatedCompany;
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company.');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const success = await companyDatabase.deleteCompany(id);
      if (success) {
        await refreshCompanies();
      }
      return success;
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company.');
      return false;
    }
  };

  const getHighlightedCompanies = async () => {
    try {
      return await companyDatabase.getHighlightedCompanies();
    } catch (err) {
      console.error('Error getting highlighted companies:', err);
      setError('Failed to get highlighted companies.');
      return [];
    }
  };

  const searchCompanies = async (query: string) => {
    try {
      return await companyDatabase.searchCompanies(query);
    } catch (err) {
      console.error('Error searching companies:', err);
      setError('Failed to search companies.');
      return [];
    }
  };

  const uploadLogo = async (id: string, file: File, altText: string) => {
    try {
      const logoStorage = await companyDatabase.uploadLogo(id, file, altText);
      // Refresh companies to get updated logo paths
      await refreshCompanies();
      return logoStorage.path;
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo.');
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
    refreshCompanies
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
