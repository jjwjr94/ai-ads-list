
import { useState, useCallback, useRef } from 'react';
import { Company } from '../types/database';
import { supabaseAPI } from '../lib/supabase';
import { initialCompanies } from '../data/initialCompanies';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Function to load companies from Supabase with caching
  const loadCompanies = async (force = false) => {
    // Check if we should use cached data
    const now = Date.now();
    const shouldUseCache = !force && 
                          companies.length > 0 && 
                          (now - lastFetchTime.current) < CACHE_DURATION;
    
    if (shouldUseCache) {
      console.log('Using cached companies data');
      return;
    }
    
    // Prevent multiple simultaneous refreshes
    if (isRefreshing && !force) {
      console.log('Already refreshing, skipping redundant refresh');
      return;
    }
    
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      console.log('Loading companies from Supabase with timestamp:', new Date().toISOString());
      
      // Get all companies from Supabase
      const allCompanies = await supabaseAPI.companies.getAll();
      
      // If no companies exist in Supabase, initialize with sample data
      if (allCompanies.length === 0) {
        console.log('No companies found in Supabase, initializing with sample data');
        
        // Add each company to the database
        for (const company of initialCompanies) {
          // Convert to CompanyCreate type to ensure proper initialization
          const companyCreate = {
            ...company as any,
            id: undefined // Remove ID to let Supabase generate one
          };
          await supabaseAPI.companies.create(companyCreate);
        }
        
        // Get the updated list
        const updatedCompanies = await supabaseAPI.companies.getAll();
        setCompanies(updatedCompanies);
      } else {
        console.log(`Setting ${allCompanies.length} companies from database`);
        setCompanies(allCompanies);
      }
      
      // Update last fetch time
      lastFetchTime.current = Date.now();
      setError(null);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please check your connection or Supabase credentials.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to refresh companies - only when explicitly requested
  const refreshCompanies = useCallback(async () => {
    console.log('Manually refreshing companies data at:', new Date().toISOString());
    await loadCompanies(true); // Force refresh
    return Promise.resolve();
  }, []);
  
  // Get highlighted companies for the homepage
  const getHighlightedCompanies = useCallback(async () => {
    try {
      // Try to get companies marked as highlighted first
      const highlighted = await supabaseAPI.companies.getHighlighted();
      if (highlighted && highlighted.length > 0) {
        return highlighted;
      }
      
      // Fallback to returning random companies if none are highlighted
      if (companies.length > 0) {
        // If we already have companies loaded, return a random selection
        const shuffled = [...companies].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(6, companies.length));
      }
      
      // If no companies are loaded yet, fetch from API and return a selection
      const allCompanies = await supabaseAPI.companies.getAll();
      const shuffled = [...allCompanies].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(6, allCompanies.length));
    } catch (error) {
      console.error('Error getting highlighted companies:', error);
      return [];
    }
  }, [companies]);
  
  // Optimistic update helpers
  const optimisticAddCompany = useCallback((company: Company) => {
    setCompanies(prev => [...prev, company]);
  }, []);
  
  const optimisticUpdateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...updates } : company
      )
    );
  }, []);
  
  const optimisticDeleteCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  }, []);
  
  return {
    companies,
    isLoading,
    error,
    isRefreshing,
    loadCompanies,
    refreshCompanies,
    getHighlightedCompanies,
    optimisticAddCompany,
    optimisticUpdateCompany,
    optimisticDeleteCompany,
    setCompanies
  };
}
