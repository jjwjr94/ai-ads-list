
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Category, Company } from '@/types/frontend.models';

export type DbCompany = Database['public']['Tables']['companies']['Row'];

// Convert database company to frontend company format
const mapDbToFrontend = (dbCompany: DbCompany): Company => {
  // Safe access to details object with proper type checking
  const detailsObj = dbCompany.details as Record<string, any> | null;
  
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    website: dbCompany.website,
    description: dbCompany.description || undefined,
    category: dbCompany.category as Category || undefined,
    features: dbCompany.features || [],
    pricing: dbCompany.pricing || undefined,
    targetAudience: dbCompany.target_audience || undefined,
    linkedinUrl: dbCompany.linkedin_url || undefined,
    headquarters: dbCompany.headquarters || undefined,
    employeeCount: dbCompany.employee_count || undefined,
    fundingStage: dbCompany.funding_stage || undefined,
    foundedYear: dbCompany.founded_year || undefined,
    logoUrl: dbCompany.logo_url || undefined,
    details: {
      pricing: detailsObj?.pricing || null,
      bestFor: detailsObj?.bestFor || '',
      summary: detailsObj?.summary || undefined,
      highlighted: detailsObj?.highlighted || false,
      features: detailsObj?.features || []
    }
  };
};

// Convert frontend company to database format for updates
const mapFrontendToDb = (company: Partial<Company>): Partial<DbCompany> => {
  const result: Partial<DbCompany> = {};
  
  if (company.name !== undefined) result.name = company.name;
  if (company.website !== undefined) result.website = company.website;
  if (company.description !== undefined) result.description = company.description;
  if (company.category !== undefined) result.category = company.category;
  if (company.features !== undefined) result.features = company.features;
  if (company.pricing !== undefined) result.pricing = company.pricing;
  if (company.targetAudience !== undefined) result.target_audience = company.targetAudience;
  if (company.linkedinUrl !== undefined) result.linkedin_url = company.linkedinUrl;
  if (company.headquarters !== undefined) result.headquarters = company.headquarters;
  if (company.employeeCount !== undefined) result.employee_count = company.employeeCount;
  if (company.fundingStage !== undefined) result.funding_stage = company.fundingStage;
  if (company.foundedYear !== undefined) result.founded_year = company.foundedYear;
  if (company.logoUrl !== undefined) result.logo_url = company.logoUrl;
  if (company.details !== undefined) {
    result.details = company.details as any;
  }
  
  return result;
};

export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }

  return (data || []).map(mapDbToFrontend);
};

export const getAll = async (): Promise<Company[]> => {
  return getCompanies();
};

export const getHighlighted = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('details->highlighted', true);

  if (error) {
    console.error("Error fetching highlighted companies:", error);
    throw error;
  }

  return (data || []).map(mapDbToFrontend);
};

export const getByCategory = async (category: Category): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(`Error fetching companies by category ${category}:`, error);
    throw error;
  }

  return (data || []).map(mapDbToFrontend);
};

export const getById = async (id: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching company by ID ${id}:`, error);
    throw error;
  }

  return data ? mapDbToFrontend(data) : null;
};

export const search = async (query: string): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) {
    console.error(`Error searching companies with query ${query}:`, error);
    throw error;
  }

  return (data || []).map(mapDbToFrontend);
};

export const add = async (company: Company): Promise<Company> => {
  // Convert to DB format
  const dbCompany = mapFrontendToDb(company);
  
  console.log("Adding company to Supabase:", { company, dbCompany });
  
  // Make sure we include the ID from the company
  const insertData = {
    ...dbCompany,
    id: company.id // Ensure ID is included in the insert
  };
  
  const { data, error } = await supabase
    .from('companies')
    .insert([insertData])
    .select();

  if (error) {
    console.error("Error inserting company:", error);
    throw error;
  }

  return data && data[0] ? mapDbToFrontend(data[0]) : company;
};

export const insertCompany = async (company: Company): Promise<Company> => {
  // Convert to DB format and ensure ID is included
  const dbCompany = { ...mapFrontendToDb(company), id: company.id };
  
  const { data, error } = await supabase
    .from('companies')
    .insert(dbCompany)
    .select()
    .single();

  if (error) {
    console.error("Error inserting company:", error);
    throw error;
  }

  return data ? mapDbToFrontend(data) : company;
};

export const update = async (id: string, updates: Partial<Company>): Promise<Company | null> => {
  // Convert updates to DB format
  const dbUpdates = mapFrontendToDb(updates);
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id)
      .select();
  
    if (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  
    return data && data[0] ? mapDbToFrontend(data[0]) : null;
  } catch (err) {
    console.error("Error in update function:", err);
    
    // Special case for logoUrl updates that might need special handling
    if (updates.logoUrl !== undefined) {
      try {
        // Try to use RPC function for logo update
        const { data, error } = await supabase
          .rpc('update_company_logo', {
            company_id: id,
            logo_url_value: updates.logoUrl
          });
          
        if (error) throw error;
        return data ? mapDbToFrontend(data[0]) : null;
      } catch (logoError) {
        console.error("Error in logo specific update:", logoError);
        throw logoError;
      }
    }
    
    throw err;
  }
};

export const updateCompany = async (company: Company): Promise<Company | null> => {
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
): Promise<Company | null> => {
  const { data, error } = await supabase
    .rpc('update_company_logo', {
      company_id: companyId,
      logo_url_value: logoUrl
    });

  if (error) throw error;
  return data && data[0] ? mapDbToFrontend(data[0]) : null;
};
