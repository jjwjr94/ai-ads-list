
import { createClient } from '@supabase/supabase-js';
import { Company, Category } from '../types/database';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or API key. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for Supabase operations
export const supabaseAPI = {
  // Company operations
  companies: {
    async getAll(): Promise<Company[]> {
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
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('category', category);
      
      if (error) {
        console.error(`Error fetching companies by category ${category}:`, error);
        throw error;
      }
      
      return (data || []).map(company => ({
        ...company,
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated) : undefined
      }));
    },
    
    async getById(id: string): Promise<Company | null> {
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
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated) : undefined
      }));
    }
  },
  
  // Storage operations for logos
  storage: {
    async uploadLogo(id: string, file: File, altText: string): Promise<string> {
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
      const { data } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(path);
        
      return data.publicUrl;
    }
  }
};
