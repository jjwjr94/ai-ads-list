/**
 * Companies API
 * 
 * This file provides a type-safe interface for interacting with the companies data in Supabase.
 * It handles all database operations and ensures proper mapping between database and frontend models.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  Company, 
  Category, 
  CompanyCreate,
  CompanyUpdate
} from '../types/frontend.models';
import {
  mapDbCompanyToCompany,
  mapCompanyToDbInsert,
  mapCompanyUpdateToDbUpdate
} from '../types/mappers';

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
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return (data || []).map(mapDbCompanyToCompany);
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
      console.error(`Error fetching company with id ${id}:`, error);
      return null;
    }

    return data ? mapDbCompanyToCompany(data) : null;
  },

  /**
   * Create a new company
   * @param company The company to create
   * @returns Promise resolving to the created Company object
   */
  async create(company: CompanyCreate): Promise<Company> {
    const dbCompany = mapCompanyToDbInsert(company);

    const { data, error } = await supabase
      .from('companies')
      .insert([dbCompany])
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return mapDbCompanyToCompany(data);
  },

  /**
   * Update an existing company
   * @param id The ID of the company to update
   * @param updates The updates to apply
   * @returns Promise resolving to a boolean indicating success
   */
  async update(id: string, updates: CompanyUpdate): Promise<boolean> {
    const dbUpdates = mapCompanyUpdateToDbUpdate(updates);

    const { error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error(`Error updating company with id ${id}:`, error);
      return false;
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
      console.error(`Error deleting company with id ${id}:`, error);
      return false;
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
      .eq('category', category);

    if (error) {
      console.error(`Error fetching companies in category ${category}:`, error);
      return [];
    }

    return (data || []).map(mapDbCompanyToCompany);
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
      return [];
    }

    return (data || []).map(mapDbCompanyToCompany);
  },

  /**
   * Get highlighted companies
   * @returns Promise resolving to an array of highlighted Company objects
   */
  async getHighlighted(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('details->>highlighted', 'true')
      .setHeader('cache-control', 'no-cache');

    if (error) {
      console.error('Error fetching highlighted companies:', error);
      return [];
    }

    return (data || []).map(mapDbCompanyToCompany);
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
