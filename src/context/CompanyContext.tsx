import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Category } from '@/types/database';
import { supabaseAPI } from '@/lib/supabase';

export interface CompanyContextType {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  getCompaniesByCategory: (category: Category) => Promise<Company[]>;
  getCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Company) => Promise<boolean>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Implement your data fetching logic here, e.g., using useEffect
  useEffect(() => {
    const fetchCompanies = async () => {
      setisLoading(true);
      try {
        // Fetch companies from your data source (e.g., Supabase)
        const fetchedCompanies = await supabaseAPI.companies.getAll();
        setCompanies(fetchedCompanies);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch companies');
      } finally {
        setisLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const getCompaniesByCategory = async (category: Category): Promise<Company[]> => {
    try {
      return await supabaseAPI.companies.getByCategory(category);
    } catch (err) {
      console.error('Error getting companies by category:', err);
      return [];
    }
  };

  const getCompanyById = async (id: string): Promise<Company | null> => {
    try {
      return await supabaseAPI.companies.getById(id);
    } catch (err) {
      console.error('Error getting company by ID:', err);
      return null;
    }
  };

  const addCompany = async (company: Company): Promise<boolean> => {
    try {
      return await supabaseAPI.companies.create(company);
    } catch (err) {
      console.error('Error adding company:', err);
      return false;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>): Promise<boolean> => {
    try {
      return await supabaseAPI.companies.update(id, updates);
    } catch (err) {
      console.error('Error updating company:', err);
      return false;
    }
  };

  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      return await supabaseAPI.companies.delete(id);
    } catch (err) {
      console.error('Error deleting company:', err);
      return false;
    }
  };

  const getHighlightedCompanies = async (): Promise<Company[]> => {
    try {
      return await supabaseAPI.companies.getHighlighted();
    } catch (err) {
      console.error('Error getting highlighted companies:', err);
      return [];
    }
  };

  const refreshCompanies = async (): Promise<void> => {
    setisLoading(true);
    try {
      const fetchedCompanies = await supabaseAPI.companies.getAll();
      setCompanies(fetchedCompanies);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh companies');
    } finally {
      setisLoading(false);
    }
  };

  const value: CompanyContextType = {
    companies,
    isLoading,
    error,
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany,
    getHighlightedCompanies,
    refreshCompanies,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyDatabase = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyDatabase must be used within a CompanyProvider');
  }
  return context;
};
