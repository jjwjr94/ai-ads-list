
import { supabase } from '@/integrations/supabase/client';
import type { Company, Category } from '../../types/database';
import { categoryMapping } from './categoryMapping';

export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
  },

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

    // Explicitly cast data to Company and provide default values
    return data ? {
      ...data,
      logoUrl: data.logo_url || '',
      targetAudience: data.target_audience || '',
      details: data.details || {}
    } as Company : null;
  },

  async create(company: Company): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    // Explicitly cast data to Company and provide default values
    return {
      ...data,
      logoUrl: data.logo_url || '',
      targetAudience: data.target_audience || '',
      details: data.details || {}
    } as Company;
  },

  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error(`Error updating company with id ${id}:`, error);
      return false;
    }

    return true;
  },

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

  async getByCategory(category: Category): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error(`Error fetching companies in category ${category}:`, error);
      return [];
    }

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
  },

  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Error searching companies:', error);
      return [];
    }

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
  },

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

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
  }
};
