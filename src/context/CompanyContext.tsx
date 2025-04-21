
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Company, Category } from '@/types/frontend.models';
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
  addCompany: (company: Company) => Promise<Company | null>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  refreshCompanies: () => Promise<void>;
  uploadLogo: (id: string, file: File, altText: string) => Promise<string>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the useCompanies hook to manage company data
  const { 
    companies, 
    isLoading, 
    error, 
    refreshCompanies,
    optimisticAddCompany,
    optimisticUpdateCompany,
    optimisticDeleteCompany,
    loadCompanies
  } = useCompanies();
  
  // Load companies on mount, but only once
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  
  // Use the useCompanyOperations hook for CRUD operations
  const { 
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
  } = useCompanyOperations(
    refreshCompanies,
    optimisticUpdateCompany,
    optimisticAddCompany,
    optimisticDeleteCompany
  );
  
  // Use the useCompanyQueries hook for specialized queries
  const {
    getHighlightedCompanies,
    searchCompanies
  } = useCompanyQueries();
  
  // Use the useCompanyLogo hook for logo management
  const {
    uploadLogo
  } = useCompanyLogo(updateCompany);

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
