import { Category } from '@/types/frontend.models';
import { DbCategory } from '@/types/database.models';
import { supabase } from './supabaseClient';
import { Company, CompanyCreate, CompanyUpdate } from '@/types/frontend.models';

/**
 * Helper function to map database record to frontend Company object
 */
export const mapDbRecordToCompany = (record: any): Company => {
  return {
    id: record.id,
    name: record.name,
    website: record.website,
    category: record.category as Category, // Cast to Category enum
    description: record.description,
    logoUrl: record.logo_url || '',
    targetAudience: record.target_audience || '',
    features: record.features || [],
    pricing: record.pricing || '',
    details: {
      summary: record.details?.summary || '',
      highlighted: record.details?.highlighted || false,
      features: record.details?.features || [],
      pricing: record.details?.pricing || '',
      bestFor: record.details?.bestFor || ''
    },
    linkedinUrl: record.linkedin_url,
    foundedYear: record.founded_year,
    headquarters: record.headquarters,
    employeeCount: record.employee_count,
    fundingStage: record.funding_stage,
    lastUpdated: record.last_updated ? new Date(record.last_updated) : undefined,
    aiNativeCriteria: {
      hasDotAiDomain: record.has_dot_ai_domain,
      foundedAfter2020: record.founded_after_2020,
      seriesAOrEarlier: record.series_a_or_earlier
    }
  };
};

/**
 * Helper function to map frontend Company to database record for insertion
 */
export const mapCompanyToDbRecord = (company: CompanyCreate) => {
  const dbRecord: any = {
    name: company.name,
    website: company.website,
    category: company.category, // Category enum value is a string that matches DB values
    description: company.description,
    logo_url: company.logoUrl,
    target_audience: company.targetAudience,
    features: company.features,
    pricing: company.pricing,
    linkedin_url: company.linkedinUrl,
    founded_year: company.foundedYear,
    headquarters: company.headquarters,
    employee_count: company.employeeCount,
    funding_stage: company.fundingStage,
    details: company.details
  };

  // Add AI Native criteria if present
  if (company.aiNativeCriteria) {
    dbRecord.has_dot_ai_domain = company.aiNativeCriteria.hasDotAiDomain;
    dbRecord.founded_after_2020 = company.aiNativeCriteria.foundedAfter2020;
    dbRecord.series_a_or_earlier = company.aiNativeCriteria.seriesAOrEarlier;
  }

  return dbRecord;
};

/**
 * Companies API for interacting with the Supabase database
 */
export const companiesAPI = {
  /**
   * Get all companies
   */
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return data.map(mapDbRecordToCompany);
  },

  /**
   * Get a company by ID
   */
  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return null;
    }

    return mapDbRecordToCompany(data);
  },

  /**
   * Get companies by category
   */
  async getByCategory(category: Category): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error(`Error fetching companies in category ${category}:`, error);
      return [];
    }

    return data.map(mapDbRecordToCompany);
  },

  /**
   * Add a new company
   */
  async add(company: CompanyCreate): Promise<Company | null> {
    const dbRecord = mapCompanyToDbRecord(company);

    const { data, error } = await supabase
      .from('companies')
      .insert([dbRecord]) // Use array to satisfy TypeScript
      .select()
      .single();

    if (error) {
      console.error('Error adding company:', error);
      return null;
    }

    return mapDbRecordToCompany(data);
  },

  /**
   * Update an existing company
   */
  async update(id: string, updates: CompanyUpdate): Promise<Company | null> {
    const dbUpdates: any = {};

    // Map basic fields
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
    if (updates.features !== undefined) dbUpdates.features = updates.features;
    if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.foundedYear !== undefined) dbUpdates.founded_year = updates.foundedYear;
    if (updates.headquarters !== undefined) dbUpdates.headquarters = updates.headquarters;
    if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount;
    if (updates.fundingStage !== undefined) dbUpdates.funding_stage = updates.fundingStage;

    // Handle details separately to avoid infinite type instantiation
    if (updates.details) {
      // Create a plain object with explicit type annotation to break the recursion
      const detailsUpdate: {
        summary?: string;
        features?: string[];
        highlighted?: boolean;
        pricing?: string;
        bestFor?: string;
      } = {};
      
      // Only copy properties that exist in the updates
      if (updates.details.summary !== undefined) detailsUpdate.summary = updates.details.summary;
      if (updates.details.features !== undefined) detailsUpdate.features = updates.details.features;
      if (updates.details.highlighted !== undefined) detailsUpdate.highlighted = updates.details.highlighted;
      if (updates.details.pricing !== undefined) detailsUpdate.pricing = updates.details.pricing;
      if (updates.details.bestFor !== undefined) detailsUpdate.bestFor = updates.details.bestFor;
      
      // Assign the explicitly typed object to dbUpdates
      dbUpdates.details = detailsUpdate;
    }

    // Handle AI Native criteria
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

    const { data, error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      return null;
    }

    return mapDbRecordToCompany(data);
  },

  /**
   * Delete a company
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
      return false;
    }

    return true;
  },

  /**
   * Search companies by name or description
   */
  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error(`Error searching companies with query "${query}":`, error);
      return [];
    }

    return data.map(mapDbRecordToCompany);
  }
};
