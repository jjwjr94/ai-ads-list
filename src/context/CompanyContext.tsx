
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { Company, Category } from '../types/database';
import { useCompanies } from '../hooks/useCompanies';
import { useCompanyOperations } from '../hooks/useCompanyOperations';
import { useCompanyQueries } from '../hooks/useCompanyQueries';
import { useCompanyLogo } from '../hooks/useCompanyLogo';

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
  // Use our custom hooks
  const { 
    companies, 
    isLoading, 
    error, 
    loadCompanies,
    refreshCompanies 
  } = useCompanies();
  
  const {
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
  } = useCompanyOperations(refreshCompanies);
  
  const {
    getHighlightedCompanies,
    searchCompanies
  } = useCompanyQueries();
  
  const {
    uploadLogo
  } = useCompanyLogo(refreshCompanies);

  // Load companies on initial render only
  useEffect(() => {
    loadCompanies();
    // No automatic refresh on window focus or interval refresh
  }, []);

  // Combine all the values from our hooks
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
