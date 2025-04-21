import { supabase } from './supabase';
import { DbCompany } from '@/types/supabase.models';

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

export const insertCompany = async (company: DbCompany): Promise<DbCompany[]> => {
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

export const updateCompany = async (company: DbCompany): Promise<DbCompany[]> => {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', company.id)
    .select();

  if (error) {
    console.error("Error updating company:", error);
    throw error;
  }

  return data || [];
};

export const deleteCompany = async (id: string): Promise<string> => {
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
