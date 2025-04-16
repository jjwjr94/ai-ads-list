import { supabase } from '../../integrations/supabase/client';
import { Company, Category, CompanyDetails } from '../../types/database';
import { mapCompanyToDbRecord, mapDbRecordToCompany } from './mappers';
import { categoryMapping } from './categoryMapping';

// Define a type for database operations to avoid circular references
type DbCompanyDetails = {
  summary: string | null;
  detailFeatures: string[];  // Renamed from 'features' to match CompanyDetails
  highlighted: boolean;
  pricing: string | null;
  bestFor: string | null;
};

export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    console.log('Fetching all companies from Supabase');
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name')
      .setHeader('cache-control', 'no-cache');
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} companies from database`);
    // Map database records to Company objects
    return (data || []).map(mapDbRecordToCompany);
  },
  
  async getByCategory(category: Category): Promise<Company[]> {
    console.log(`Fetching companies for category: ${category} from Supabase`);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', categoryMapping[category])
      .order('name')
      .setHeader('cache-control', 'no-cache');
    
    if (error) {
      console.error(`Error fetching companies by category ${category}:`, error);
      return []; // Return an empty array instead of throwing
    }
    
    console.log(`Found ${data?.length || 0} companies for category: ${category}`);
    return (data || []).map(mapDbRecordToCompany);
  },
  
  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .setHeader('cache-control', 'no-cache')
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
    // Create a new object for database updates
    const dbUpdates: Record<string, any> = {};
    
    // Only add fields that are defined in the updates object
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    
    // Handle features carefully
    if (updates.features !== undefined) dbUpdates.features = updates.features;
    
    if (updates.details) {
      // Create a simple object literal without referencing the Company type
      const detailsObj: DbCompanyDetails = {
        summary: updates.details.summary ?? null,
        detailFeatures: Array.isArray(updates.details.detailFeatures) 
          ? [...updates.details.detailFeatures] 
          : [],
        highlighted: Boolean(updates.details.highlighted ?? false),
        pricing: updates.details.pricing ?? null,
        bestFor: updates.details.bestFor ?? null
      };
      
      // Assign the explicitly typed object to dbUpdates
      dbUpdates.details = detailsObj;
    }
    
    if (updates.category !== undefined && updates.category in categoryMapping) {
      dbUpdates.category = categoryMapping[updates.category as Category];
    }
    
    dbUpdates.last_updated = new Date().toISOString();
    
    console.log('Updating company with values:', dbUpdates);
    
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
      .eq('details->highlighted', true)
      .setHeader('cache-control', 'no-cache');
    
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
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .setHeader('cache-control', 'no-cache');
    
    if (error) {
      console.error(`Error searching companies for "${query}":`, error);
      throw error;
    }
    
    return (data || []).map(mapDbRecordToCompany);
  }
};
