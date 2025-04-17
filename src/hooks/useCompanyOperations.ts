import { useCallback } from 'react';
import { Company } from '../types/frontend.models'; 
import { supabaseAPI } from '../lib/supabase';
import { Category } from '../types/frontend.models';

export function useCompanyOperations(
  refreshCompanies: () => Promise<void>,
  optimisticUpdateCompany: (id: string, updates: Partial<Company>) => void,
  optimisticAddCompany: (company: Company) => void,
  optimisticDeleteCompany: (id: string) => void
) {
  // Get companies by category
  const getCompaniesByCategory = useCallback(async (category: Category) => {
    try {
      return await supabaseAPI.companies.getByCategory(category);
    } catch (err) {
      console.error('Error getting companies by category:', err);
      return [];
    }
  }, []);

  // Get a single company by ID
  const getCompanyById = useCallback(async (id: string) => {
    try {
      return await supabaseAPI.companies.getById(id);
    } catch (err) {
      console.error('Error getting company by ID:', err);
      return null;
    }
  }, []);

  // Add a new company with optimistic update
  const addCompany = useCallback(async (company: Company) => {
    try {
      // Apply optimistic update
      optimisticAddCompany(company);
      
      // Keep the pre-assigned ID when creating a new company
      const companyCreate: Company = {
        ...company,
        // Ensure complete company details structure
        details: {
          summary: company.details.summary || '',
          highlighted: company.details.highlighted || false,
          features: company.details.features || [],
          pricing: company.details.pricing || '',
          bestFor: company.details.bestFor || ''
        }
      };
      
      // Perform actual API call
      const newCompany = await supabaseAPI.companies.create(companyCreate);
      
      // No need to refresh all companies since we've already updated locally
      return newCompany;
    } catch (err) {
      console.error('Error adding company:', err);
      // If there's an error, refresh to get the correct state
      await refreshCompanies();
      throw err;
    }
  }, [refreshCompanies, optimisticAddCompany]);

  // Update an existing company with optimistic update
  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    try {
      console.log(`Updating company ${id} with:`, updates);
      
      // Apply optimistic update
      optimisticUpdateCompany(id, updates);
      
      // Perform actual API call
      const success = await supabaseAPI.companies.update(id, updates);
      
      // No need to refresh all companies since we've already updated locally
      return success;
    } catch (err) {
      console.error('Error updating company:', err);
      // If there's an error, refresh to get the correct state
      await refreshCompanies();
      throw err;
    }
  }, [refreshCompanies, optimisticUpdateCompany]);

  // Delete a company with optimistic update
  const deleteCompany = useCallback(async (id: string) => {
    try {
      // Apply optimistic update
      optimisticDeleteCompany(id);
      
      // Perform actual API call
      const success = await supabaseAPI.companies.delete(id);
      
      // No need to refresh all companies since we've already updated locally
      return success;
    } catch (err) {
      console.error('Error deleting company:', err);
      // If there's an error, refresh to get the correct state
      await refreshCompanies();
      return false;
    }
  }, [refreshCompanies, optimisticDeleteCompany]);

  return {
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
  };
}
