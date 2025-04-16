
import { supabase } from './supabaseClient';
import type { Company } from './types';

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

    return data ?? [];
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

    return data ?? null;
  },

  async create(company: Partial<Company>): Promise<boolean> {
    const { error } = await supabase.from('companies').insert(company);

    if (error) {
      console.error('Error creating company:', error);
      return false;
    }

    return true;
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
    const { error } = await supabase.from('companies').delete().eq('id', id);

    if (error) {
      console.error(`Error deleting company with id ${id}:`, error);
      return false;
    }

    return true;
  },

  async getHighlighted(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*') // Using full select to avoid deep type issues
      .eq('details->>highlighted', 'true')
      .setHeader('cache-control', 'no-cache');

    if (error) {
      console.error('Error fetching highlighted companies:', error);
      return [];
    }

    return data ?? [];
  }
};
