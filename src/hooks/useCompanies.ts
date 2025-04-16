
import { useState, useCallback } from 'react';
import { Company, Category } from '../types/database';
import { supabaseAPI } from '../lib/supabase';
import { initialCompanies } from '../data/initialCompanies';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to load companies from Supabase with cache-busting
  const loadCompanies = async (force = false) => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing && !force) {
      console.log('Already refreshing, skipping redundant refresh');
      return;
    }
    
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      console.log('Loading companies from Supabase with timestamp:', new Date().toISOString());
      
      // Get all companies from Supabase with cache control headers
      const allCompanies = await supabaseAPI.companies.getAll();
      
      // If no companies exist in Supabase, initialize with sample data
      if (allCompanies.length === 0) {
        console.log('No companies found in Supabase, initializing with sample data');
        
        // Add each company to the database
        for (const company of initialCompanies) {
          await supabaseAPI.companies.add(company);
        }
        
        // Get the updated list
        const updatedCompanies = await supabaseAPI.companies.getAll();
        setCompanies(updatedCompanies);
      } else {
        console.log(`Setting ${allCompanies.length} companies from database`);
        setCompanies(allCompanies);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please check your connection or Supabase credentials.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to refresh companies with cache busting - only when explicitly requested
  const refreshCompanies = useCallback(async () => {
    console.log('Manually refreshing companies data at:', new Date().toISOString());
    await loadCompanies(true); // Force refresh
    return Promise.resolve();
  }, []);
  
  return {
    companies,
    isLoading,
    error,
    isRefreshing,
    loadCompanies,
    refreshCompanies,
    setCompanies
  };
}
