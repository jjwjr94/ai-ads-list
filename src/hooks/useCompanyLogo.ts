
import { useCallback, useState } from 'react';
import { supabaseAPI } from '../lib/supabase';
import { Company } from '@/types/frontend.models';
import { useToast } from '@/hooks/use-toast';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadLogo = useCallback(async (id: string, file: File, fileName: string) => {
    if (isUploading) return null;
    
    setIsUploading(true);
    let logoUrl = null;
    
    try {
      console.log(`Starting logo upload process for company ID: ${id} at ${new Date().toISOString()}`);
      console.log(`File type: ${file.type}, File size: ${file.size} bytes`);
      
      if (file.type.startsWith('image/')) {
        return new Promise<string>((resolve, reject) => {
          console.log('File is an image, beginning base64 conversion...');
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const base64String = e.target?.result as string;
              console.log('Base64 conversion successful. String length:', base64String.length);
              console.log('First 100 chars of base64:', base64String.substring(0, 100));
              
              console.log(`Attempting to update company ${id} with base64 logo...`);
              const updateResult = await updateCompany(id, { logoUrl: base64String });
              
              if (updateResult) {
                console.log(`Successfully updated company ${id} with base64 logo at ${new Date().toISOString()}`);
                toast({
                  title: "Logo uploaded",
                  description: "Logo has been successfully converted to base64 and saved to database.",
                });
                resolve(base64String);
              } else {
                const errorMsg = 'Failed to update company with base64 logo in database';
                console.error(errorMsg);
                toast({
                  title: "Logo upload failed",
                  description: "Failed to save the base64 logo to database. Please try again.",
                  variant: "destructive",
                });
                reject(new Error(errorMsg));
              }
            } catch (error) {
              console.error('Error in base64 conversion or database update:', error);
              reject(error);
            } finally {
              setIsUploading(false);
            }
          };
          
          reader.onerror = (error) => {
            console.error('Error reading file for base64 conversion:', error);
            setIsUploading(false);
            toast({
              title: "Logo upload failed",
              description: "Failed to read the image file for base64 conversion.",
              variant: "destructive",
            });
            reject(error);
          };
          
          reader.readAsDataURL(file);
        });
      }
      
      // Fallback to storage API if not handling as base64
      console.log('File not processed as base64, using storage API instead...');
      logoUrl = await supabaseAPI.storage.uploadLogoToStorage(id, file, fileName);
      console.log(`Logo uploaded to storage successfully, URL: ${logoUrl}`);
      
      if (!logoUrl) {
        throw new Error("Failed to upload logo to storage");
      }
      
      toast({
        title: "Logo uploaded",
        description: "Logo has been successfully uploaded to storage.",
      });
      
      try {
        console.log(`Updating company ${id} with storage URL: ${logoUrl}`);
        const updateResult = await updateCompany(id, { logoUrl });
        
        if (updateResult) {
          console.log(`Successfully updated company ${id} with storage URL at ${new Date().toISOString()}`);
        } else {
          console.warn(`Company ${id} logo URL update may have failed`);
        }
      } catch (updateError) {
        console.error('Error updating company with storage logo URL:', updateError);
      }
      
      return logoUrl;
    } catch (err) {
      console.error('Error in logo upload process:', err);
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
