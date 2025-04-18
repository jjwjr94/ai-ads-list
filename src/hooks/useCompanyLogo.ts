
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
      
      // First upload the file to storage
      const logoUrl = await supabaseAPI.storage.uploadLogo(id, file, altText);
      console.log(`Logo uploaded successfully to storage, URL: ${logoUrl}`);
      
      if (!logoUrl) {
        throw new Error("Failed to upload logo to storage");
      }
      
      // Then update company with new logo URL
      const updated = await updateCompany(id, {
        logoUrl
      });
      
      console.log('Company updated with new logo URL:', updated);
      
      if (!updated) {
        throw new Error("Failed to update company with new logo URL");
      }
      
      // Add cache-busting parameter
      return `${logoUrl}?t=${Date.now()}`;
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
