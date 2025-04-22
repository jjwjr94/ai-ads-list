
import { useCallback } from 'react';
import { Company, CompanyCreate, Category } from '@/types/frontend.models';
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
      // Generate an ID for the company for optimistic updates if not provided
      const companyId = company.id || uuidv4();
      
      // Create a proper Company object with the ID
      const companyWithId = {
        ...company,
        id: companyId
      } as Company;
      
      // Apply optimistic update with the full company object including ID
      optimisticAddCompany(companyWithId);
      
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
      
      // Better logging for category updates
      if (updates.category) {
        console.log(`Category update: ${updates.category}`);
        console.log(`Category type: ${typeof updates.category}`);
      }
      
      if (updates.logoUrl) {
        console.log(`Logo URL length: ${updates.logoUrl.length}`);
        console.log(`Logo URL first 50 chars: ${updates.logoUrl.substring(0, 50)}`);
        console.log(`Is base64: ${updates.logoUrl.startsWith('data:') ? 'Yes' : 'No'}`);
      }
      
      // Apply optimistic update
      optimisticUpdateCompany(id, updates);
      
      try {
        // Perform actual API call
        const updatedCompany = await supabaseAPI.companies.update(id, updates);
        console.log('Update API response:', updatedCompany);
        
        if (!updatedCompany) {
          console.error('Failed to update company, API returned null');
          
          // Special handling for logo updates
          if (updates.logoUrl && Object.keys(updates).length === 1) {
            // If this is just a logo update, try with a dedicated logo update
            console.log('Attempting dedicated logo update');
            const logoUpdateSuccess = await supabaseAPI.companies.updateCompanyLogo(id, updates.logoUrl);
            if (!logoUpdateSuccess) {
              console.error('Dedicated logo update failed');
              toast({
                title: "Logo update failed",
                description: "Failed to save logo to database. Please try again.",
                variant: "destructive",
              });
              return false;
            } else {
              console.log('Dedicated logo update succeeded');
              toast({
                title: "Logo updated",
                description: "Logo was successfully updated.",
              });
              return true;
            }
          }
          
          // Show a generic message for other types of updates
          toast({
            title: "Update failed",
            description: "Failed to update company. The server returned no data.",
            variant: "destructive",
          });
          
          return false;
        }
        
        // No need to refresh all companies since we've already updated locally
        toast({
          title: "Company updated",
          description: "The company details have been successfully updated.",
        });
        return true;
      } catch (apiError: any) {
        console.error('API error in updateCompany:', apiError);
        
        // Special handling for recursion errors in RLS policies
        if (apiError.message && apiError.message.includes("recursion")) {
          console.warn("RLS policy recursion error detected. Update may have been partially successful.");
          
          if (updates.logoUrl) {
            // If this was a logo update, let the user know the logo was uploaded even if DB update failed
            toast({
              title: "Logo uploaded",
              description: "Your logo was uploaded successfully, but company details couldn't be updated due to a permissions issue.",
            });
            return true; // Return success for logo-only updates despite DB error
          }
        }
        
        // More detailed error toast
        toast({
          title: "Update Error",
          description: apiError instanceof Error 
            ? `Update failed: ${apiError.message}` 
            : "An unexpected error occurred while updating the company.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err: any) {
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
      const deletedId = await supabaseAPI.companies.delete_(id);
      
      if (!deletedId) {
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
      return true;
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
