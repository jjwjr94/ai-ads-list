import { supabase } from '../../integrations/supabase/client';

// Storage operations for company logos
export const storageAPI = {
  async uploadLogo(id: string, file: File, altText: string): Promise<string> {
    console.log(`Uploading logo file for company ${id}: ${file.name}`);
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    try {
      console.log(`Attempting to upload to path: ${filePath}`);
      const { data, error } = await supabase
        .storage
        .from('company-logos')
        .upload(filePath, file, {
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading logo for company ${id}:`, error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(filePath);
        
      console.log(`Generated public URL: ${urlData.publicUrl}`);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  // New function that only handles storage operations without database updates
  async uploadLogoToStorage(id: string, file: File): Promise<string> {
    console.log(`Uploading logo file to storage for company ${id}: ${file.name}`);
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    try {
      console.log(`Attempting to upload to path: ${filePath}`);
      const { data, error } = await supabase
        .storage
        .from('company-logos')
        .upload(filePath, file, {
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading logo for company ${id}:`, error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(filePath);
        
      console.log(`Generated public URL: ${urlData.publicUrl}`);
      
      // Add cache-busting parameter
      return `${urlData.publicUrl}?t=${Date.now()}`;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  getPublicUrl(path: string): string {
    const { data } = supabase
      .storage
      .from('company-logos')
      .getPublicUrl(path);
      
    return data.publicUrl;
  }
};
