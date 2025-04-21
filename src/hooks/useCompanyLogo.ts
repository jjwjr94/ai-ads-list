
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
      
      // Convert file to base64 if it's an image
      if (file.type.startsWith('image/')) {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const base64String = e.target?.result as string;
              console.log('Successfully converted image to base64');
              
              // Update the company with the base64 encoded logo
              const updateResult = await updateCompany(id, { logoUrl: base64String });
              
              if (updateResult) {
                console.log('Successfully updated company with base64 logo');
                toast({
                  title: "Logo uploaded",
                  description: "Logo has been successfully uploaded and saved.",
                });
                resolve(base64String);
              } else {
                console.error('Failed to update company with base64 logo');
                toast({
                  title: "Logo upload failed",
                  description: "Failed to save the logo. Please try again.",
                  variant: "destructive",
                });
                reject(new Error('Failed to update company with logo'));
              }
            } catch (error) {
              console.error('Error in base64 conversion or update:', error);
              reject(error);
            } finally {
              setIsUploading(false);
            }
          };
          
          reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setIsUploading(false);
            toast({
              title: "Logo upload failed",
              description: "Failed to read the image file.",
              variant: "destructive",
            });
            reject(error);
          };
          
          reader.readAsDataURL(file);
        });
      }
      
      // If not directly handling as base64, use the storage API
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
