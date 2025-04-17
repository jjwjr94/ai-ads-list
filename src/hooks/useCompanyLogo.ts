
import { useCallback } from 'react';
import { supabaseAPI } from '../lib/supabase';
import { Company } from '../types/frontend.models';

export function useCompanyLogo(updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>) {
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, altText: string) => {
    try {
      console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
      const logoUrl = await supabaseAPI.storage.uploadLogo(id, file, altText);
      console.log(`Logo uploaded successfully, URL: ${logoUrl}`);
      
      // Update company with new logo URL
      const updated = await updateCompany(id, {
        logoUrl: logoUrl
      });
      
      console.log('Company updated with new logo URL:', updated);
      
      // Add cache-busting parameter
      return `${logoUrl}?t=${Date.now()}`;
    } catch (err) {
      console.error('Error uploading logo:', err);
      throw err;
    }
  }, [updateCompany]);

  return {
    uploadLogo
  };
}
