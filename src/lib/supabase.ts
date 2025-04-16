
import { createClient } from '@supabase/supabase-js';
import { Company, Category } from '../types/database';
import { supabase } from '../integrations/supabase/client';

// Helper functions for Supabase operations
export const supabaseAPI = {
  // Company operations
  companies: {
    async getAll(): Promise<Company[]> {
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
        lastUpdated: company.lastUpdated ? new Date(data.lastUpdated) : undefined
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
        lastUpdated: company.lastUpdated ? new Date(company.lastUpdated || '') : undefined
      }));
    }
  },
  
  // Storage operations for logos
  storage: {
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
    
    getPublicUrl(path: string): string {
      const { data } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(path);
        
      return data.publicUrl;
    }
  }
};
