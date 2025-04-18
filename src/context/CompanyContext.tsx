import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company, Category } from '../types/database';
import { supabaseAPI } from '../lib/supabase';
import { initialCompanies } from '../data/initialCompanies';

// Create context for the database
interface CompanyContextType {
  companies: Company[];
  getCompaniesByCategory: (category: Category) => Promise<Company[]>;
  getCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Company) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  searchCompanies: (query: string) => Promise<Company[]>;
  uploadLogo: (id: string, file: File, altText: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
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
      setLastRefresh(Date.now());
    }
  };

  // Function to refresh companies with cache busting - only when explicitly requested
  const refreshCompanies = async () => {
    console.log('Manually refreshing companies data at:', new Date().toISOString());
    await loadCompanies(true); // Force refresh
    
    // Force browser to reload images by adding timestamp
    const timestamp = Date.now();
    
    // Update the lastRefresh state to trigger a re-render
    setLastRefresh(timestamp);
    
    return Promise.resolve();
  };
  
  // Load companies on initial render only
  useEffect(() => {
    loadCompanies();
    
    // Remove automatic refresh on window focus and interval refresh
    // to prevent excessive refreshing while scrolling
    
    return () => {
      // Cleanup function - no intervals to clear anymore
    };
  }, []);

  // Database operations using Supabase
  const value = {
    companies,
    getCompaniesByCategory: async (category: Category) => {
      try {
        return await supabaseAPI.companies.getByCategory(category);
      } catch (err) {
        console.error('Error getting companies by category:', err);
        setError('Failed to get companies by category from Supabase.');
        return [];
      }
    },
    getCompanyById: async (id: string) => {
      try {
        return await supabaseAPI.companies.getById(id);
      } catch (err) {
        console.error('Error getting company by ID:', err);
        setError('Failed to get company details from Supabase.');
        return null;
      }
    },
    addCompany: async (company: Company) => {
      try {
        const newCompany = await supabaseAPI.companies.add(company);
        await refreshCompanies(); // Keep refresh after adding a company
        return newCompany;
      } catch (err) {
        console.error('Error adding company:', err);
        setError('Failed to add company to Supabase.');
        throw err;
      }
    },
    updateCompany: async (id: string, updates: Partial<Company>) => {
      try {
        console.log(`Updating company ${id} with:`, updates);
        const updatedCompany = await supabaseAPI.companies.update(id, updates);
        console.log('Company updated, refreshing data');
        await refreshCompanies(); // Keep refresh after updating a company
        return updatedCompany;
      } catch (err) {
        console.error('Error updating company:', err);
        setError('Failed to update company in Supabase.');
        throw err;
      }
    },
    deleteCompany: async (id: string) => {
      try {
        const success = await supabaseAPI.companies.delete(id);
        if (success) {
          console.log('Company deleted, refreshing data');
          await refreshCompanies(); // Keep refresh after deleting a company
        }
        return success;
      } catch (err) {
        console.error('Error deleting company:', err);
        setError('Failed to delete company from Supabase.');
        return false;
      }
    },
    getHighlightedCompanies: async () => {
      try {
        return await supabaseAPI.companies.getHighlighted();
      } catch (err) {
        console.error('Error getting highlighted companies:', err);
        setError('Failed to get highlighted companies from Supabase.');
        return [];
      }
    },
    searchCompanies: async (query: string) => {
      try {
        return await supabaseAPI.companies.search(query);
      } catch (err) {
        console.error('Error searching companies:', err);
        setError('Failed to search companies in Supabase.');
        return [];
      }
    },
    uploadLogo: async (id: string, file: File, altText: string) => {
      try {
        console.log(`Uploading logo for company ID: ${id} at ${new Date().toISOString()}`);
        
        // Step 1: Just upload to storage using the new function that doesn't update the database
        const logoUrl = await supabaseAPI.storage.uploadLogoToStorage(id, file);
        console.log(`Logo uploaded successfully, URL: ${logoUrl}`);
        
        // Step 2: Update company with new logo URL in a separate operation
        try {
          // Use a simplified update that only changes the logo fields
          // This direct approach avoids the complex update that was causing recursion
          const { data, error } = await supabase
            .from('companies')
            .update({
              logo_url: logoUrl,
              logo: logoUrl
            })
            .eq('id', id);
            
          if (error) {
            console.error('Error updating company with logo URL:', error);
            // Even if this fails, we still return the logo URL
          } else {
            console.log('Company updated with new logo URL');
          }
        } catch (updateErr) {
          console.error('Exception during company update:', updateErr);
          // Continue even if update fails
        }
        
        // Force refresh companies to get updated logo paths
        try {
          await refreshCompanies(); // Keep refresh after logo upload
        } catch (refreshErr) {
          console.error('Error refreshing companies after logo upload:', refreshErr);
          // Continue even if refresh fails
        }
        
        // Return the URL regardless of whether the database update succeeded
        return logoUrl;
      } catch (err) {
        console.error('Error uploading logo:', err);
        setError('Failed to upload logo to Supabase storage.');
        throw err;
      }
    },
    isLoading,
    error,
    refreshCompanies,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the company database
export const useCompanyDatabase = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyDatabase must be used within a CompanyProvider');
  }
  return context;
};
