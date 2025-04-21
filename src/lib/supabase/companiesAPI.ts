import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Category } from '@/types/frontend.models';

export type DbCompany = Database['public']['Tables']['companies']['Row'];

export const getCompanies = async (): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }

  return data || [];
};

export const getAll = async (): Promise<DbCompany[]> => {
  return getCompanies();
};

export const getHighlighted = async (): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('details->highlighted', true);

  if (error) {
    console.error("Error fetching highlighted companies:", error);
    throw error;
  }

  return data || [];
};

export const getByCategory = async (category: Category): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(`Error fetching companies by category ${category}:`, error);
    throw error;
  }

  return data || [];
};

export const getById = async (id: string): Promise<DbCompany | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching company by ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const search = async (query: string): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) {
    console.error(`Error searching companies with query ${query}:`, error);
    throw error;
  }

  return data || [];
};

export const add = async (company: Partial<DbCompany>): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select();

  if (error) {
    console.error("Error inserting company:", error);
    throw error;
  }

  return data || [];
};

export const insertCompany = async (company: DbCompany): Promise<DbCompany[]> => {
  return add(company);
};

export const update = async (id: string, updates: Partial<DbCompany>): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error("Error updating company:", error);
    throw error;
  }

  return data || [];
};

export const updateCompany = async (company: DbCompany): Promise<DbCompany[]> => {
  return update(company.id, company);
};

export const delete_ = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting company:", error);
    throw error;
  }

  return id;
};

export const deleteCompany = async (id: string): Promise<string> => {
  return delete_(id);
};

export const updateCompanyLogo = async (
  companyId: string,
  logoUrl: string
): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .rpc('update_company_logo', {
      company_id: companyId,
      logo_url_value: logoUrl
    });

  if (error) throw error;
  return data;
};
