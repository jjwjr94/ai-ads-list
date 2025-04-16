
import { useCallback } from 'react';
import { Company } from '../types/database';
import { supabaseAPI } from '../lib/supabase';

export function useCompanyQueries() {
  // Get highlighted companies
  const getHighlightedCompanies = useCallback(async () => {
    try {
      return await supabaseAPI.companies.getHighlighted();
    } catch (err) {
      console.error('Error getting highlighted companies:', err);
      return [];
    }
  }, []);

  // Search for companies
  const searchCompanies = useCallback(async (query: string) => {
    try {
      return await supabaseAPI.companies.search(query);
    } catch (err) {
      console.error('Error searching companies:', err);
      return [];
    }
  }, []);

  return {
    getHighlightedCompanies,
    searchCompanies
  };
}
