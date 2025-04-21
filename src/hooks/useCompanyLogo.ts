import { useCallback, useState } from 'react';
import { supabaseAPI } from '../lib/supabase';
import { Company } from '@/types/frontend.models';
import { useToast } from '@/hooks/use-toast';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, fileName: string) => {
    // Set uploading state to prevent multiple uploads
    if (isUploading) return null;
    
    setIsUploading(true);
    let logoUrl = null;
    
    try {
      console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
      
      // Upload to storage using the function that doesn't update the database
      logoUrl = await supabaseAPI.storage.uploadLogoToStorage(id, file, fileName);
      console.log(`Logo uploaded successfully to storage, URL: ${logoUrl}`);
      
      if (!logoUrl) {
        throw new Error("Failed to upload logo to storage");
      }
      
      // Show success toast for storage upload
      toast({
        title: "Logo uploaded",
        description: "Logo has been successfully uploaded to storage.",
      });
      
      // Immediately update the company record with the new logo URL
      // This ensures the logo URL is saved to the database even if the form isn't submitted
      try {
        console.log(`Updating company ${id} with new logo URL: ${logoUrl}`);
        const updateResult = await updateCompany(id, { logoUrl });
        
        if (updateResult) {
          console.log(`Company ${id} successfully updated with new logo URL`);
        } else {
          console.warn(`Company ${id} logo URL update may not have been saved to database`);
        }
      } catch (updateError) {
        console.error('Error updating company with logo URL:', updateError);
        // Don't throw here, as we still want to return the logo URL for the form
      }
      
      // Return the URL with cache-busting parameter
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      toast({
        title: "Logo upload failed",
        description: err instanceof Error ? err.message : "An error occurred during logo upload",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [toast, isUploading, updateCompany]);

  return {
    uploadLogo,
    isUploading
  };
}
