
import { useCallback } from 'react';
import { Company, Category } from '../types/database';
import { supabaseAPI } from '../lib/supabase';

export function useCompanyOperations(refreshCompanies: () => Promise<void>) {
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

  // Add a new company
  const addCompany = useCallback(async (company: Company) => {
    try {
      const newCompany = await supabaseAPI.companies.create(company);
      await refreshCompanies(); // Keep refresh after adding a company
      return newCompany;
    } catch (err) {
      console.error('Error adding company:', err);
      throw err;
    }
  }, [refreshCompanies]);

  // Update an existing company
  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    try {
      console.log(`Updating company ${id} with:`, updates);
      const success = await supabaseAPI.companies.update(id, updates);
      console.log('Company updated, refreshing data');
      await refreshCompanies(); // Keep refresh after updating a company
      return success;
    } catch (err) {
      console.error('Error updating company:', err);
      throw err;
    }
  }, [refreshCompanies]);

  // Delete a company
  const deleteCompany = useCallback(async (id: string) => {
    try {
      const success = await supabaseAPI.companies.delete(id);
      if (success) {
        console.log('Company deleted, refreshing data');
        await refreshCompanies(); // Keep refresh after deleting a company
      }
      return success;
    } catch (err) {
      console.error('Error deleting company:', err);
      return false;
    }
  }, [refreshCompanies]);

  return {
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
  };
}
