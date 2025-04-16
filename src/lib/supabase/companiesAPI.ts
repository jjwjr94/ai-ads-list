
import { supabase } from '@/integrations/supabase/client';
import type { Company, Category } from '../../types/database';
import { categoryMapping } from './categoryMapping';
import { v4 as uuidv4 } from 'uuid';

// Function to map a Company object to a database record
const mapCompanyToDbRecord = (company: Company): Record<string, any> => ({
  id: company.id || uuidv4(),
  name: company.name,
  website: company.website,
  category: company.category,
  description: company.description,
  features: company.features,
  founded_year: company.foundedYear,
  employee_count: company.employeeCount,
  headquarters: company.headquarters,
  has_dot_ai_domain: company.hasDotAiDomain,
  founded_after_2020: company.foundedAfter2020,
  series_a_or_earlier: company.seriesAOrEarlier,
  funding_stage: company.fundingStage,
  pricing: company.pricing,
  target_audience: company.targetAudience,
  logo_url: company.logoUrl || company.logo,
  details: JSON.stringify(company.details || {}), // Convert to string for Supabase
  linkedin_url: company.linkedinUrl,
  founded_year: company.foundedYear,
  headquarters: company.headquarters,
});

// Function to map a database record to a Company object
const mapDbRecordToCompany = (record: any): Company => ({
  id: record.id,
  name: record.name,
  website: record.website,
  category: record.category,
  description: record.description,
  features: record.features || [],
  foundedYear: record.founded_year,
  employeeCount: record.employee_count,
  headquarters: record.headquarters,
  hasDotAiDomain: record.has_dot_ai_domain,
  foundedAfter2020: record.founded_after_2020,
  seriesAOrEarlier: record.series_a_or_earlier,
  fundingStage: record.funding_stage,
  pricing: record.pricing,
  targetAudience: record.target_audience,
  logoUrl: record.logo_url,
  logo: record.logo_url,
  details: record.details ? (typeof record.details === 'string' ? JSON.parse(record.details) : record.details) : {},
  linkedinUrl: record.linkedin_url,
});

// Prepare updates for Supabase
const prepareUpdates = (updates: Partial<Company>): Record<string, any> => {
  const dbUpdates: Record<string, any> = {};
  
  // Map camelCase properties to snake_case for database
  if (updates.logoUrl) dbUpdates.logo_url = updates.logoUrl;
  if (updates.foundedYear) dbUpdates.founded_year = updates.foundedYear;
  if (updates.employeeCount) dbUpdates.employee_count = updates.employeeCount;
  if (updates.hasDotAiDomain) dbUpdates.has_dot_ai_domain = updates.hasDotAiDomain;
  if (updates.foundedAfter2020) dbUpdates.founded_after_2020 = updates.foundedAfter2020;
  if (updates.seriesAOrEarlier) dbUpdates.series_a_or_earlier = updates.seriesAOrEarlier;
  if (updates.fundingStage) dbUpdates.funding_stage = updates.fundingStage;
  if (updates.targetAudience) dbUpdates.target_audience = updates.targetAudience;
  if (updates.linkedinUrl) dbUpdates.linkedin_url = updates.linkedinUrl;
  
  // Handle details object separately to ensure it's properly serialized
  if (updates.details !== undefined) {
    dbUpdates.details = JSON.stringify(updates.details);
  }
  
  if (updates.aiNativeCriteria) {
    dbUpdates.ai_native_criteria = updates.aiNativeCriteria;
  }
  
  // Copy over simple properties that don't need transformation
  ['name', 'website', 'category', 'description', 'features', 'pricing', 'headquarters'].forEach(prop => {
    if (updates[prop as keyof Company] !== undefined) {
      dbUpdates[prop] = updates[prop as keyof Company];
    }
  });
  
  return dbUpdates;
};

export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    return data.map(mapDbRecordToCompany);
  },
  
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
    
    return mapDbRecordToCompany(data);
  },

  async create(company: Company): Promise<Company> {
    // Convert company to DB record format
    const dbRecord = mapCompanyToDbRecord(company);
    
    // Ensure all required fields
    if (!dbRecord.id || !dbRecord.name || !dbRecord.website || !dbRecord.category) {
      throw new Error('Missing required fields for company');
    }

    const { data, error } = await supabase
      .from('companies')
      .insert(dbRecord) // Pass the single object directly, not in an array
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }
    
    return mapDbRecordToCompany(data);
  },
  
  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    const dbUpdates = prepareUpdates(updates);
    
    const { error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }
    
    return true;
  },
  
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
    
    return data.map(mapDbRecordToCompany);
  },
  
  async getHighlighted(): Promise<Company[]> {
    // This is a placeholder for a future implementation
    // For now, we'll just return the first 6 companies
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })
      .limit(6);
    
    if (error) {
      console.error('Error fetching highlighted companies:', error);
      throw error;
    }
    
    return data.map(mapDbRecordToCompany);
  },
  
  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
    
    return data.map(mapDbRecordToCompany);
  }
};
