import { useCallback } from 'react';
import { Company, CompanyCreate } from '@/types/frontend.models';
import { supabaseAPI } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export function useCompanyOperations(
  refreshCompanies: () => Promise<void>,
  optimisticUpdateCompany: (id: string, updates: Partial<Company>) => void,
  optimisticAddCompany: (company: Company) => void,
  optimisticDeleteCompany: (id: string) => void
) {
  const { toast } = useToast();

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
      console.log(`Attempting to update company ${id} with updates:`, updates);
      
      // Apply optimistic update
      optimisticUpdateCompany(id, updates);
      
      // Perform actual API call
      const updatedCompany = await supabaseAPI.companies.update(id, updates);
      console.log('Update API response:', updatedCompany);
      
      if (!updatedCompany) {
        console.error('Failed to update company, API returned null');
        toast({
          title: "Update failed",
          description: "Failed to update company. The server returned no data.",
          variant: "destructive",
        });
        
        // Refresh to restore correct state
        await refreshCompanies();
        return false;
      }
      
      // No need to refresh all companies since we've already updated locally
      toast({
        title: "Company updated",
        description: "The company details have been successfully updated.",
      });
      return true;
    } catch (err) {
      console.error('Comprehensive error in updateCompany:', err);
      
      // More detailed error toast
      toast({
        title: "Update Error",
        description: err instanceof Error 
          ? `Update failed: ${err.message}` 
          : "An unexpected error occurred while updating the company.",
        variant: "destructive",
      });
      
      // Refresh to restore correct state
      await refreshCompanies();
      return false;
    }
  }, [refreshCompanies, optimisticUpdateCompany, toast]);

  // Delete a company with optimistic update
  const deleteCompany = useCallback(async (id: string) => {
    try {
      // Apply optimistic update
      optimisticDeleteCompany(id);
      
      // Perform actual API call
      const success = await supabaseAPI.companies.delete(id);
      
      if (!success) {
        toast({
          title: "Delete failed",
          description: "Failed to delete the company. Please try again later.",
          variant: "destructive",
        });
        await refreshCompanies();
        return false;
      }
      
      toast({
        title: "Company deleted",
        description: "The company has been successfully deleted.",
      });
      
      // No need to refresh all companies since we've already updated locally
      return success;
    } catch (err) {
      console.error('Error deleting company:', err);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting the company.",
        variant: "destructive",
      });
      // If there's an error, refresh to get the correct state
      await refreshCompanies();
      return false;
    }
  }, [refreshCompanies, optimisticDeleteCompany, toast]);

  return {
    getCompaniesByCategory,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
  };
}
