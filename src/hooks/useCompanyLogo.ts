
import { useCallback } from 'react';
import { supabaseAPI } from '../lib/supabase';
import { Company } from '@/types/frontend.models';
import { useToast } from '@/hooks/use-toast';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  const { toast } = useToast();
  
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, altText: string) => {
    try {
      console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
      
      // Step 1: Just upload to storage using the new function that doesn't update the database
      const logoUrl = await supabaseAPI.storage.uploadLogoToStorage(id, file);
      console.log(`Logo uploaded successfully to storage, URL: ${logoUrl}`);
      
      if (!logoUrl) {
        throw new Error("Failed to upload logo to storage");
      }
      
      // Step 2: Update company with new logo URL in a separate operation
      try {
        // The field is named logoUrl in the frontend model but logo_url in the database
        // The mapping from logoUrl to logo_url happens in the companiesAPI.update function
        const updated = await updateCompany(id, {
          logoUrl
        });
        
        console.log('Company updated with new logo URL:', updated);
        
        if (!updated) {
          console.warn("Failed to update company with new logo URL, but storage upload succeeded");
          // Continue even if the database update fails
        }
      } catch (updateErr) {
        console.error('Exception during company update:', updateErr);
        // Continue even if the database update fails - we still want to return the logo URL
        // This prevents the infinite recursion issue
      }
      
      // Return the URL regardless of whether the database update succeeded
      // The URL already includes a cache-busting parameter from uploadLogoToStorage
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      toast({
        title: "Logo upload failed",
        description: err instanceof Error ? err.message : "An error occurred during logo upload",
        variant: "destructive",
      });
      throw err;
    }
  }, [updateCompany, toast]);

  return {
    uploadLogo
  };
}
