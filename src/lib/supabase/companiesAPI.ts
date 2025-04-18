import { supabase } from '../../integrations/supabase/client';
import { Company, Category } from '../../types/database';
import { mapCompanyToDbRecord, mapDbRecordToCompany } from './mappers';
import { categoryMapping } from './categoryMapping';

// Define a completely separate type for database operations to avoid any circular references
type DbCompanyDetails = {
  summary: string;
  features: string[];
  highlighted: boolean;
  pricing: string;
  bestFor: string;
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
    // Create a new object for database updates that matches the Supabase schema
    const dbUpdates: Record<string, any> = {};
    
    // Only add fields that are defined in the updates object
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    if (updates.logo !== undefined) dbUpdates.logo_url = updates.logo; // Handle both logo fields
    if (updates.features !== undefined) dbUpdates.features = updates.features;
    if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
    if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.foundedYear !== undefined) dbUpdates.founded_year = updates.foundedYear;
    if (updates.headquarters !== undefined) dbUpdates.headquarters = updates.headquarters;
    if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount;
    if (updates.fundingStage !== undefined) dbUpdates.funding_stage = updates.fundingStage;
    
    // Handle AI Native criteria if present
    if (updates.aiNativeCriteria) {
      if (updates.aiNativeCriteria.hasDotAiDomain !== undefined) {
        dbUpdates.has_dot_ai_domain = updates.aiNativeCriteria.hasDotAiDomain;
      }
      if (updates.aiNativeCriteria.foundedAfter2020 !== undefined) {
        dbUpdates.founded_after_2020 = updates.aiNativeCriteria.foundedAfter2020;
      }
      if (updates.aiNativeCriteria.seriesAOrEarlier !== undefined) {
        dbUpdates.series_a_or_earlier = updates.aiNativeCriteria.seriesAOrEarlier;
      }
    }
    
    // Handle details separately to avoid infinite type instantiation
    if (updates.details) {
      // Create a completely separate object with explicit typing
      // This breaks any potential circular references
      const detailsObj: DbCompanyDetails = {
        summary: typeof updates.details.summary === 'string' ? updates.details.summary : '',
        features: Array.isArray(updates.details.features) ? updates.details.features : [],
        highlighted: typeof updates.details.highlighted === 'boolean' ? updates.details.highlighted : false,
        pricing: typeof updates.details.pricing === 'string' ? updates.details.pricing : '',
        bestFor: typeof updates.details.bestFor === 'string' ? updates.details.bestFor : ''
      };
      
      // Assign the explicitly typed object to dbUpdates
      dbUpdates.details = detailsObj;
    }
    
    // Ensure category is properly mapped to the database enum value
    if (updates.category !== undefined) {
      // Make sure we're using a valid category from the enum
      if (updates.category in categoryMapping) {
        dbUpdates.category = categoryMapping[updates.category as Category];
      } else {
        console.warn(`Invalid category: ${updates.category}, using default`);
        // Use a default category if the provided one is invalid
        dbUpdates.category = "Strategy & Planning";
      }
    }
    
    dbUpdates.last_updated = new Date().toISOString();
    
    console.log('Updating company with values:', dbUpdates);
    
    // Use proper error handling and ensure we get the updated record back
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
    
    if (!data) {
      console.error(`No data returned after updating company ${id}`);
      return null;
    }
    
    console.log(`Company ${id} updated successfully, returned data:`, data);
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
