
import { useCallback } from 'react';
import { supabaseAPI } from '../lib/supabase';

export function useCompanyLogo(refreshCompanies: () => Promise<void>) {
  // Upload a logo for a company
  const uploadLogo = useCallback(async (id: string, file: File, altText: string) => {
    try {
      console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
      const logoUrl = await supabaseAPI.storage.uploadLogo(id, file, altText);
      console.log(`Logo uploaded successfully, URL: ${logoUrl}`);
      
      // Update company with new logo URL
      const updatedCompany = await supabaseAPI.companies.update(id, {
        logo: logoUrl,
        logoUrl: logoUrl
      });
      
      console.log('Company updated with new logo URL');
      
      // Force refresh companies to get updated logo paths
      await refreshCompanies();
      
      // Add cache-busting parameter
      return `${logoUrl}?t=${Date.now()}`;
    } catch (err) {
      console.error('Error uploading logo:', err);
      throw err;
    }
  }, [refreshCompanies]);

  return {
    uploadLogo
  };
}
