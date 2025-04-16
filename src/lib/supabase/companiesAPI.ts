import { supabase } from '@/integrations/supabase/client';
import type { Company, Category } from '../../types/database';
import { categoryMapping } from './categoryMapping';

// Utility function to map database record to Company object
const mapDbRecordToCompany = (record: any): Company => ({
  ...record,
  logoUrl: record.logo_url || '',
  targetAudience: record.target_audience || '',
  details: record.details || {}
}) as Company;

// Utility function to map Company object to database record
const mapCompanyToDbRecord = (company: Company): Record<string, any> => ({
  id: company.id,
  name: company.name,
  website: company.website,
  category: company.category,
  description: company.description,
  features: company.features,
  pricing: company.pricing,
  target_audience: company.targetAudience,
  logo_url: company.logoUrl || company.logo,
  details: JSON.parse(JSON.stringify(company.details || {})), // Convert to plain object
  linkedin_url: company.linkedinUrl,
  founded_year: company.foundedYear,
  headquarters: company.headquarters,
  employee_count: company.employeeCount,
  funding_stage: company.fundingStage,
  last_updated: company.lastUpdated || new Date(),
  has_dot_ai_domain: company.aiNativeCriteria?.hasDotAiDomain,
  founded_after_2020: company.aiNativeCriteria?.foundedAfter2020,
  series_a_or_earlier: company.aiNativeCriteria?.seriesAOrEarlier,
});

// Utility function to create partial database record for updates
const createPartialDbRecord = (updates: Partial<Company>): Record<string, any> => {
  const dbUpdates: Record<string, any> = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.website !== undefined) dbUpdates.website = updates.website;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.features !== undefined) dbUpdates.features = updates.features;
  if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
  if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
  if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
  if (updates.logo !== undefined) dbUpdates.logo_url = updates.logo;
  if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
  if (updates.foundedYear !== undefined) dbUpdates.founded_year = updates.foundedYear;
  if (updates.headquarters !== undefined) dbUpdates.headquarters = updates.headquarters;
  if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount;
  if (updates.fundingStage !== undefined) dbUpdates.funding_stage = updates.fundingStage;
  if (updates.lastUpdated !== undefined) dbUpdates.last_updated = updates.lastUpdated;
  
  // Handle details object separately to ensure it's properly serialized
  if (updates.details !== undefined) {
    dbUpdates.details = JSON.parse(JSON.stringify(updates.details));
  }
  
  if (updates.aiNativeCriteria) {
    if (updates.aiNativeCriteria.hasDotAiDomain !== undefined) 
      dbUpdates.has_dot_ai_domain = updates.aiNativeCriteria.hasDotAiDomain;
    if (updates.aiNativeCriteria.foundedAfter2020 !== undefined) 
      dbUpdates.founded_after_2020 = updates.aiNativeCriteria.foundedAfter2020;
    if (updates.aiNativeCriteria.seriesAOrEarlier !== undefined) 
      dbUpdates.series_a_or_earlier = updates.aiNativeCriteria.seriesAOrEarlier;
  }
  
  return dbUpdates;
};

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

    return (data || []).map(mapDbRecordToCompany);
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

    return data ? mapDbRecordToCompany(data) : null;
  },

  async create(company: Company): Promise<Company> {
    const dbRecord = mapCompanyToDbRecord(company);

    const { data, error } = await supabase
      .from('companies')
      .insert(dbRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return mapDbRecordToCompany(data);
  },

  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    const dbUpdates = createPartialDbRecord(updates);

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

    return (data || []).map(mapDbRecordToCompany);
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

    return (data || []).map(mapDbRecordToCompany);
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

    return (data || []).map(mapDbRecordToCompany);
  }
};
