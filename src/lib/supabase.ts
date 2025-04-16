import { createClient } from '@supabase/supabase-js';
import { Company, Category } from '../types/database';

// Initialize Supabase client with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client with fallback to dummy client if credentials are missing
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or API key. Check your environment variables.');
    
    // Return a mock implementation that doesn't access Supabase
    return {
      from: () => ({
        select: () => {
          const mockResponse = { data: [], error: null };
          // Add method chaining capabilities
          const chainableMethods = {
            ...mockResponse,
            eq: () => chainableMethods,
            neq: () => chainableMethods,
            gt: () => chainableMethods,
            gte: () => chainableMethods,
            lt: () => chainableMethods,
            lte: () => chainableMethods,
            like: () => chainableMethods,
            ilike: () => chainableMethods,
            is: () => chainableMethods,
            in: () => chainableMethods,
            contains: () => chainableMethods,
            containedBy: () => chainableMethods,
            rangeLt: () => chainableMethods,
            rangeGt: () => chainableMethods,
            rangeGte: () => chainableMethods,
            rangeLte: () => chainableMethods,
            rangeAdjacent: () => chainableMethods,
            overlaps: () => chainableMethods,
            textSearch: () => chainableMethods,
            filter: () => chainableMethods,
            not: () => chainableMethods,
            or: () => chainableMethods,
            and: () => chainableMethods,
            order: () => chainableMethods,
            limit: () => chainableMethods,
            range: () => chainableMethods,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
            csv: () => ({ data: null, error: null }),
          };
          return chainableMethods;
        },
        insert: () => ({ 
          data: null, 
          error: null,
          select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) })
        }),
        upsert: () => ({ 
          data: null, 
          error: null,
          select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) })
        }),
        update: () => {
          const mockResponse = { data: null, error: null };
          const mockUpdateChain = {
            ...mockResponse,
            eq: () => ({
              ...mockResponse,
              select: () => ({
                ...mockResponse,
                single: () => mockResponse
              })
            })
          };
          return mockUpdateChain;
        },
        delete: () => {
          const mockResponse = { data: null, error: null };
          return {
            ...mockResponse,
            eq: () => mockResponse
          };
        }
      }),
      storage: {
        from: () => ({
          upload: () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// Create the supabase client
export const supabase = createSupabaseClient();

// Helper functions for Supabase operations
export const supabaseAPI = {
  // Company operations
  companies: {
    async getAll(): Promise<Company[]> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        // Import and return initial companies data if no Supabase connection
        const { initialCompanies } = await import('../data/initialCompanies');
        return initialCompanies;
      }
      
      console.log('Fetching all companies from Supabase');
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      // Convert any string dates to Date objects
      return (data || []).map(company => ({
        ...company,
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated) : undefined
      }));
    },
    
    async getByCategory(category: Category): Promise<Company[]> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        // Import and filter initial companies by category
        const { initialCompanies } = await import('../data/initialCompanies');
        return initialCompanies.filter(company => company.category === category);
      }
      
      console.log(`Fetching companies for category: ${category} from Supabase`);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('category', category);
      
      if (error) {
        console.error(`Error fetching companies by category ${category}:`, error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} companies for category: ${category}`);
      return (data || []).map(company => ({
        ...company,
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated) : undefined
      }));
    },
    
    async getById(id: string): Promise<Company | null> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        // Import and find company by ID
        const { initialCompanies } = await import('../data/initialCompanies');
        return initialCompanies.find(company => company.id === id) || null;
      }
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        console.error(`Error fetching company ${id}:`, error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined
      };
    },
    
    async add(company: Company): Promise<Company> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        return company; // Just return the company in mock mode
      }
      
      // Ensure company has an ID and lastUpdated
      const companyToAdd = {
        ...company,
        lastUpdated: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('companies')
        .insert(companyToAdd)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }
      
      return {
        ...data,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined
      };
    },
    
    async update(id: string, updates: Partial<Company>): Promise<Company | null> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        return { ...updates, id } as Company; // Return mock updated company
      }
      
      // Add updated timestamp
      const updatesToApply = {
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('companies')
        .update(updatesToApply)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating company ${id}:`, error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined
      };
    },
    
    async delete(id: string): Promise<boolean> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        return true; // Return success in mock mode
      }
      
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting company ${id}:`, error);
        throw error;
      }
      
      return true;
    },
    
    async getHighlighted(): Promise<Company[]> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        const { initialCompanies } = await import('../data/initialCompanies');
        return initialCompanies.filter(company => company.details?.highlighted);
      }
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('details->highlighted', true);
      
      if (error) {
        console.error('Error fetching highlighted companies:', error);
        throw error;
      }
      
      return (data || []).map(company => ({
        ...company,
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated) : undefined
      }));
    },
    
    async search(query: string): Promise<Company[]> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        const { initialCompanies } = await import('../data/initialCompanies');
        const lowercaseQuery = query.toLowerCase();
        return initialCompanies.filter(company => 
          company.name.toLowerCase().includes(lowercaseQuery) || 
          company.description.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      
      if (error) {
        console.error(`Error searching companies for "${query}":`, error);
        throw error;
      }
      
      return (data || []).map(company => ({
        ...company,
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated || '') : undefined
      }));
    }
  },
  
  // Storage operations for logos
  storage: {
    async uploadLogo(id: string, file: File, altText: string): Promise<string> {
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Using mock data: Missing Supabase credentials');
        return URL.createObjectURL(file); // Return a temporary local URL for the file
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error } = await supabase
        .storage
        .from('company-logos')
        .upload(filePath, file, {
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading logo for company ${id}:`, error);
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(filePath);
        
      // Update the company with the logo URL
      await supabaseAPI.companies.update(id, { 
        logo: data.publicUrl,
        logoUrl: data.publicUrl 
      });
      
      return data.publicUrl;
    },
    
    getPublicUrl(path: string): string {
      if (!supabaseUrl || !supabaseKey) {
        return path; // In mock mode, just return the path
      }
      
      const { data } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(path);
        
      return data.publicUrl;
    }
  }
};
