
import { useCallback, useState } from 'react';
import { supabaseAPI } from '../lib/supabase';
import { Company } from '@/types/frontend.models';
import { useToast } from '@/hooks/use-toast';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, altText: string) => {
    // Set uploading state to prevent multiple uploads
    if (isUploading) return null;
    
    setIsUploading(true);
    let logoUrl = null;
    
    try {
      console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
      
      // Step 1: Just upload to storage using the function that doesn't update the database
      logoUrl = await supabaseAPI.storage.uploadLogoToStorage(id, file);
      console.log(`Logo uploaded successfully to storage, URL: ${logoUrl}`);
      
      if (!logoUrl) {
        throw new Error("Failed to upload logo to storage");
      }
      
      // Show success toast immediately after successful storage upload
      toast({
        title: "Logo uploaded",
        description: "Logo has been successfully uploaded.",
      });
      
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
          // The updateCompany function will handle the error toast if needed
          // We don't want to show another error toast here
        } else {
          // Only show a second success toast if both operations succeeded
          toast({
            title: "Company updated",
            description: "Company has been updated with the new logo.",
          });
        }
      } catch (updateErr) {
        console.error('Exception during company update:', updateErr);
        // Don't show error toast here since the logo upload itself succeeded
        // This prevents the error flash issue
      }
      
      // Return the URL regardless of whether the database update succeeded
      // The URL already includes a cache-busting parameter from uploadLogoToStorage
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      // Only show error toast if the storage upload failed
      if (!logoUrl) {
        toast({
          title: "Logo upload failed",
          description: err instanceof Error ? err.message : "An error occurred during logo upload",
          variant: "destructive",
        });
      }
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [updateCompany, toast, isUploading]);

  return {
    uploadLogo,
    isUploading
  };
}
