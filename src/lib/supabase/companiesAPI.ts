import { supabase } from '../../integrations/supabase/client';
import { Company, Category } from '../../types/database';
import { mapCompanyToDbRecord, mapDbRecordToCompany } from './mappers';
import { categoryMapping } from './categoryMapping';
import type { Database } from '../../integrations/supabase/types';

// Company database operations
export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    console.log('Fetching all companies from Supabase');
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    // Map database records to Company objects
    return (data || []).map(mapDbRecordToCompany);
  },
  
  async getByCategory(category: Category): Promise<Company[]> {
    console.log(`Fetching companies for category: ${category} from Supabase`);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', categoryMapping[category]);
    
    if (error) {
      console.error(`Error fetching companies by category ${category}:`, error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} companies for category: ${category}`);
    return (data || []).map(mapDbRecordToCompany);
  },
  
  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching company ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return mapDbRecordToCompany(data);
  },
  
  async add(company: Company): Promise<Company> {
    const dbRecord = mapCompanyToDbRecord(company);
    
    const { data, error } = await supabase
      .from('companies')
      .insert(dbRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding company:', error);
      throw error;
    }
    
    return mapDbRecordToCompany(data);
  },
  
  async update(id: string, updates: Partial<Company>): Promise<Company | null> {
    // Create a partial database record from the updates
    const dbUpdates: Partial<Database['public']['Tables']['companies']['Update']> = {};
    
    // Map only the properties that are in the updates object
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    if (updates.features !== undefined) dbUpdates.features = updates.features;
    if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
    if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.foundedYear !== undefined) dbUpdates.founded_year = updates.foundedYear;
    if (updates.headquarters !== undefined) dbUpdates.headquarters = updates.headquarters;
    if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount;
    if (updates.fundingStage !== undefined) dbUpdates.funding_stage = updates.fundingStage;
    if (updates.details !== undefined) dbUpdates.details = updates.details;
    if (updates.category !== undefined && categoryMapping[updates.category]) {
      dbUpdates.category = categoryMapping[updates.category];
    }
    
    // Always update last_updated timestamp
    dbUpdates.last_updated = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating company ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return mapDbRecordToCompany(data);
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
    
    return (data || []).map(mapDbRecordToCompany);
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
    
    return (data || []).map(mapDbRecordToCompany);
  }
};
