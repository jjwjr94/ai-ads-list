import { supabase } from '../../integrations/supabase/client';

// GitHub repository information
const GITHUB_REPO_OWNER = 'jjwjr94';
const GITHUB_REPO_NAME = 'ai-ads-zen-garden';
const GITHUB_BRANCH = 'main';

// Storage operations for company logos
export const storageAPI = {
  // Generate GitHub CDN URL for a logo
  getGitHubLogoUrl(id: string, fileExt: string): string {
    // Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/public/logos/{companyId}.{ext}
    return `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/public/logos/${id}.${fileExt}`;
  },
  
  // This function is kept for backward compatibility but now returns a GitHub URL
  async uploadLogo(id: string, file: File, altText: string) : Promise<string> {
    console.log(`Processing logo file for company ${id}: ${file.name}`);
    const fileExt = file.name.split('.').pop() || 'png';
    
    // Return GitHub CDN URL instead of uploading to Supabase
    return this.getGitHubLogoUrl(id, fileExt);
  },
  
  // This function is kept for backward compatibility but now returns a GitHub URL
  async uploadLogoToStorage(id: string, file: File, fileName: string): Promise<string> {
    console.log(`Processing logo file for company ${id}: ${fileName}`);
    const fileExt = fileName.split('.').pop() || 'png';
    
    // Return GitHub CDN URL instead of uploading to Supabase
    return this.getGitHubLogoUrl(id, fileExt);
  },
  
  // This function is kept for backward compatibility but now returns a GitHub URL
  getPublicUrl(path: string): string {
    // Extract company ID from path (assuming format: logos/{id}.{ext})
    const matches = path.match(/logos\/([^.]+)\.(.+)/);
    if (matches && matches.length >= 3) {
      const [, id, ext] = matches;
      return this.getGitHubLogoUrl(id, ext);
    }
    
    // Fallback to a placeholder if path doesn't match expected format
    return 'https://placehold.co/400x400?text=Logo';
  },
  
  // Additional storage operations can be added here if needed
  
  // Example: Upload any file to Supabase storage (if you need this functionality) 
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(path, file, {
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading file to ${bucket}/${path}:`, error);
        throw error;
      }
      
      const { data: urlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(path);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  // Example: Delete a file from Supabase storage (if you need this functionality)
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        console.error(`Error deleting file from ${bucket}/${path}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Storage delete error:', error);
      return false;
    }
  },
  
  // Example: List files in a Supabase storage bucket (if you need this functionality)
  async listFiles(bucket: string, path: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .list(path);
      
      if (error) {
        console.error(`Error listing files in ${bucket}/${path}:`, error);
        return [];
      }
      
      return data.map(item => item.name);
    } catch (error) {
      console.error('Storage list error:', error);
      return [];
    }
  }
};
