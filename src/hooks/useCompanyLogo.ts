import { useCallback, useState } from 'react';
import { Company } from '@/types/frontend.models';
import { useToast } from '@/hooks/use-toast';

// GitHub repository information
const GITHUB_REPO_OWNER = 'jjwjr94';
const GITHUB_REPO_NAME = 'ai-ads-zen-garden';
const GITHUB_BRANCH = 'main';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Generate GitHub CDN URL for a logo
  const getGitHubLogoUrl = useCallback((companyId: string, fileExt: string) => {
    // Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/public/logos/{companyId}.{ext}
    return `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/public/logos/${companyId}.${fileExt}`;
  }, []) ;
  
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, fileName: string) => {
    // Set uploading state to prevent multiple uploads
    if (isUploading) return null;
    
    setIsUploading(true);
    let logoUrl = null;
    
    try {
      console.log(`Processing logo for company ID: ${id} at ${new Date().toISOString()}`);
      
      // Get file extension
      const fileExt = fileName.split('.').pop() || 'png';
      
      // Generate GitHub CDN URL for the logo
      logoUrl = getGitHubLogoUrl(id, fileExt);
      console.log(`Generated GitHub CDN URL for logo: ${logoUrl}`);
      
      // Show information toast about GitHub storage
      toast({
        title: "Logo processed",
        description: "Logo will be saved to GitHub repository. Please commit the image file to the public/logos directory.",
      });
      
      // Create a preview URL for immediate display
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      // Update the company record with the GitHub CDN URL
      try {
        console.log(`Updating company ${id} with GitHub logo URL: ${logoUrl}`);
        const updateResult = await updateCompany(id, { logoUrl });
        
        if (updateResult) {
          console.log(`Company ${id} successfully updated with GitHub logo URL`);
          
          // Show additional instructions for saving the file
          toast({
            title: "Next steps",
            description: `Please save the logo as 'public/logos/${id}.${fileExt}' in your GitHub repository.`,
          });
        } else {
          console.warn(`Company ${id} logo URL update may not have been saved to database`);
        }
      } catch (updateError) {
        console.error('Error updating company with logo URL:', updateError);
      }
      
      return logoUrl;
    } catch (err) {
      console.error('Error processing logo:', err);
      toast({
        title: "Logo processing failed",
        description: err instanceof Error ? err.message : "An error occurred during logo processing",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [toast, isUploading, updateCompany, getGitHubLogoUrl]);

  return {
    uploadLogo,
    isUploading,
    getGitHubLogoUrl
  };
}
