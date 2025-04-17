
/**
 * Companies API
 * 
 * This file provides a type-safe interface for interacting with the companies data in Supabase.
 * It handles all database operations and ensures proper mapping between database and frontend models.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  Company,
  Category
} from '../../types/database';
import {
  mapDbCompanyToCompany,
  mapCompanyToDbInsert,
  mapCompanyUpdateToDbUpdate
} from '../../types/mappers';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/integrations/supabase/types';

// Define types for database records
interface DbRecord {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
  features: string[];
  pricing: string;
  target_audience?: string;
  logo_url?: string;
  details?: any;
  linkedin_url?: string;
  founded_year?: number;
  headquarters?: string;
  employee_count?: string;
  funding_stage?: string;
  last_updated?: string; // Ensure this is string type
  has_dot_ai_domain?: boolean;
  founded_after_2020?: boolean | null;
  series_a_or_earlier?: boolean | null;
  [key: string]: any;
}

/**
 * Companies API service
 */
export const companiesAPI = {
  /**
   * Get all companies
   * @returns Promise resolving to an array of Company objects
   */
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
  },

  /**
   * Get a company by ID
   * @param id The company ID
   * @returns Promise resolving to a Company object or null if not found
   */
  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching company by ID:', error);
      throw error;
    }

    if (data) {
      // Ensure last_updated is string if it exists
      if (data.last_updated && typeof data.last_updated === 'object') {
        data.last_updated = new Date(data.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(data as DbRecord);
    }
    
    return null;
  },

  /**
   * Create a new company
   * @param company The company to create
   * @returns Promise resolving to the created Company object
   */
  async create(company: Omit<Company, "id">): Promise<Company> {
    // Convert the company to the format expected by the database
    const dbCompany = mapCompanyToDbInsert(company);
    
    // Ensure all required fields
    if (!dbCompany.name || !dbCompany.website || !dbCompany.category) {
      throw new Error('Missing required fields for company');
    }

    const { data, error } = await supabase
      .from('companies')
      .insert(dbCompany as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }

    // Ensure last_updated is string if it exists
    if (data.last_updated && typeof data.last_updated === 'object') {
      data.last_updated = new Date(data.last_updated).toISOString();
    }
    
    return mapDbCompanyToCompany(data as DbRecord);
  },

  /**
   * Update an existing company
   * @param id The ID of the company to update
   * @param updates The updates to apply
   * @returns Promise resolving to a boolean indicating success
   */
  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    // Convert the updates to the format expected by the database
    const dbUpdates = mapCompanyUpdateToDbUpdate(updates as Partial<Company>);
    
    const { error } = await supabase
      .from('companies')
      .update(dbUpdates as any)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }
    
    return true;
  },

  /**
   * Delete a company
   * @param id The ID of the company to delete
   * @returns Promise resolving to a boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
    
    return true;
  },

  /**
   * Get companies by category
   * @param category The category to filter by
   * @returns Promise resolving to an array of Company objects
   */
  async getByCategory(category: Category): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching companies by category:', error);
      throw error;
    }

    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
  },

  /**
   * Search for companies
   * @param query The search query
   * @returns Promise resolving to an array of Company objects
   */
  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching companies:', error);
      throw error;
    }

    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
  },

  /**
   * Get highlighted companies
   * @returns Promise resolving to an array of highlighted Company objects
   */
  async getHighlighted(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .filter('details->highlighted', 'eq', true)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching highlighted companies:', error);
      throw error;
    }

    if (data && data.length > 0) {
      // Type assertion to ensure compatibility
      const mappedCompanies = data.map((item) => {
        // Ensure last_updated is string if it exists
        if (item.last_updated && typeof item.last_updated === 'object') {
          item.last_updated = new Date(item.last_updated).toISOString();
        }
        return mapDbCompanyToCompany(item as DbRecord);
      });
      
      return mappedCompanies;
    }
    
    // If no highlighted companies, get random companies as fallback
    const { data: randomData, error: randomError } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })
      .limit(6);
    
    if (randomError) {
      console.error('Error fetching random companies:', randomError);
      throw randomError;
    }

    // Type assertion to ensure compatibility
    const mappedRandomCompanies = (randomData || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedRandomCompanies;
  },

  /**
   * Upload a company logo
   * @param companyId The ID of the company
   * @param file The logo file
   * @param fileName The name of the file
   * @returns Promise resolving to the logo URL
   */
  async uploadLogo(companyId: string, file: File, fileName: string): Promise<string> {
    const fileExt = fileName.split('.').pop();
    const filePath = `${companyId}/logo.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }
    
    const { data } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);
    
    const logoUrl = data.publicUrl;
    
    // Update the company with the new logo URL
    await this.update(companyId, { logoUrl });
    
    return logoUrl;
  }
};
