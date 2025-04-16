
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Category } from '@/types/database';
import { supabaseAPI } from '@/lib/supabase';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompanyOperations } from '@/hooks/useCompanyOperations';
import { useCompanyQueries } from '@/hooks/useCompanyQueries';
import { useCompanyLogo } from '@/hooks/useCompanyLogo';

export interface CompanyContextType {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  getCompaniesByCategory: (category: Category) => Promise<Company[]>;
  getCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Company) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  refreshCompanies: () => Promise<void>;
  uploadLogo: (id: string, file: File, altText: string) => Promise<string>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    companies, 
    isLoading, 
    error, 
    refreshCompanies,
    setCompanies 
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

  // Load companies on mount
  useEffect(() => {
    refreshCompanies();
  }, [refreshCompanies]);

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
    uploadLogo
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
