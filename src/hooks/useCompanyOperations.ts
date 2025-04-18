
import { useCallback } from 'react';
import { Company, Category, CompanyCreate } from '@/types/frontend.models';
import { supabaseAPI } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
  const addCompany = useCallback(async (company: CompanyCreate) => {
    try {
      // Generate an ID for the company for optimistic updates
      const generatedId = uuidv4();
      const companyWithId = {
        ...company,
        id: company.id || generatedId
      };
      
      // Apply optimistic update with the full company object including ID
      optimisticAddCompany(companyWithId as Company);
      
      // Perform actual API call
      const newCompany = await supabaseAPI.companies.add(companyWithId);
      
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
      const updatedCompany = await supabaseAPI.companies.update(id, updates);
      console.log('Update API response:', updatedCompany);
      
      if (!updatedCompany) {
        console.error('Failed to update company, API returned null');
        throw new Error('Failed to update company');
      }
      
      // No need to refresh all companies since we've already updated locally
      return true;
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
