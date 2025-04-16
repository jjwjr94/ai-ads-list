/**
 * Companies API
 * 
 * This file provides a type-safe interface for interacting with the companies data in Supabase.
 * It handles all database operations and ensures proper mapping between database and frontend models.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Company, Category } from '../../types/database';
import { categoryMapping } from './categoryMapping';
import { v4 as uuidv4 } from 'uuid';

// Define types for database records
interface DbRecord {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
  features: string[];
  pricing: string;
  target_audience?: string;
  logo_url?: string;
  details?: any;
  linkedin_url?: string;
  founded_year?: number;
  headquarters?: string;
  employee_count?: string;
  funding_stage?: string;
  last_updated?: Date | string;
  has_dot_ai_domain?: boolean;
  founded_after_2020?: boolean | null;
  series_a_or_earlier?: boolean | null;
  [key: string]: any;
}

// Utility function to map database record to Company object
const mapDbRecordToCompany = (record: DbRecord): Company => ({
  id: record.id,
  name: record.name,
  website: record.website,
  category: record.category as Category,
  description: record.description,
  features: record.features || [],
  pricing: record.pricing || '',
  logoUrl: record.logo_url || '',
  targetAudience: record.target_audience || '',
  details: record.details || {},
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
});

// Utility function to map Company object to database record
const mapCompanyToDbRecord = (company: Company): DbRecord => {
  const dbRecord: DbRecord = {
    id: company.id || uuidv4(),
    name: company.name,
    website: company.website,
    category: company.category,
    description: company.description,
    features: company.features,
    pricing: company.pricing,
    target_audience: company.targetAudience,
    logo_url: company.logoUrl || '',
    details: company.details ? JSON.stringify(company.details) : '{}',
    linkedin_url: company.linkedinUrl,
    founded_year: company.foundedYear,
    headquarters: company.headquarters,
    employee_count: company.employeeCount,
    funding_stage: company.fundingStage,
    last_updated: company.lastUpdated || new Date()
  };
  
  // Add AI native criteria fields if they exist
  if (company.aiNativeCriteria) {
    dbRecord.has_dot_ai_domain = company.aiNativeCriteria.hasDotAiDomain;
    dbRecord.founded_after_2020 = company.aiNativeCriteria.foundedAfter2020;
    dbRecord.series_a_or_earlier = company.aiNativeCriteria.seriesAOrEarlier;
  }
  
  return dbRecord;
};

// Utility function to create partial database record for updates
const createPartialDbRecord = (updates: Partial<Company>): Partial<DbRecord> => {
  const dbUpdates: Partial<DbRecord> = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.website !== undefined) dbUpdates.website = updates.website;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.features !== undefined) dbUpdates.features = updates.features;
  if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
  if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
  if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
  if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
  if (updates.foundedYear !== undefined) dbUpdates.founded_year = updates.foundedYear;
  if (updates.headquarters !== undefined) dbUpdates.headquarters = updates.headquarters;
  if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount;
  if (updates.fundingStage !== undefined) dbUpdates.funding_stage = updates.fundingStage;
  if (updates.lastUpdated !== undefined) dbUpdates.last_updated = updates.lastUpdated;
  
  // Handle AI native criteria fields
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
  
  // Handle details object separately to ensure it's properly serialized
  if (updates.details !== undefined) {
    dbUpdates.details = JSON.stringify(updates.details);
  }
  
  return dbUpdates;
};

import { supabase } from '@/integrations/supabase/client';
import { 
  Company, 
  Category, 
  CompanyCreate,
  CompanyUpdate
} from '../types/frontend.models';
import {
  mapDbCompanyToCompany,
  mapCompanyToDbInsert,
  mapCompanyUpdateToDbUpdate
} from '../types/mappers';

/**
 * Companies API service
 */
export const companiesAPI = {
  /**
   * Get all companies
   * @returns Promise resolving to an array of Company objects
   */
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    return (data || []).map(mapDbCompanyToCompany);
  },

  /**
   * Get a company by ID
   * @param id The company ID
   * @returns Promise resolving to a Company object or null if not found
   */
    
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

    return data ? mapDbCompanyToCompany(data) : null;
  },

  /**
   * Create a new company
   * @param company The company to create
   * @returns Promise resolving to the created Company object
   */
  async create(company: CompanyCreate): Promise<Company> {
    const dbCompany = mapCompanyToDbInsert(company);
    
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
      .insert([dbCompany])
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }

    return mapDbCompanyToCompany(data);
  },

  /**
   * Update an existing company
   * @param id The ID of the company to update
   * @param updates The updates to apply
   * @returns Promise resolving to a boolean indicating success
   */
  async update(id: string, updates: CompanyUpdate): Promise<boolean> {
    const dbUpdates = mapCompanyUpdateToDbUpdate(updates);

    
    return mapDbRecordToCompany(data);
  },
  
  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    const dbUpdates = createPartialDbRecord(updates);
    
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

  /**
   * Delete a company
   * @param id The ID of the company to delete
   * @returns Promise resolving to a boolean indicating success
   */
  
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

  /**
   * Get companies by category
   * @param category The category to filter by
   * @returns Promise resolving to an array of Company objects
   */

  
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

    return (data || []).map(mapDbCompanyToCompany);
  },

  /**
   * Search for companies
   * @param query The search query
   * @returns Promise resolving to an array of Company objects
   */
  async search(query: string): Promise<Company[]> {
    
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

    return (data || []).map(mapDbCompanyToCompany);
  },

  /**
   * Get highlighted companies
   * @returns Promise resolving to an array of highlighted Company objects
   */
  async getHighlighted(): Promise<Company[]> {
    
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

    return (data || []).map(mapDbCompanyToCompany);
  },

  /**
   * Upload a company logo
   * @param companyId The ID of the company
   * @param file The logo file
   * @param fileName The name of the file
   * @returns Promise resolving to the logo URL
   */
  async uploadLogo(companyId: string, file: File, fileName: string): Promise<string> {
    const fileExt = fileName.split('.').pop();
    const filePath = `${companyId}/logo.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }
    
    const { data } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);
    
    const logoUrl = data.publicUrl;
    
    // Update the company with the new logo URL
    await this.update(companyId, { logoUrl });
    
    return logoUrl;
    
    return data.map(mapDbRecordToCompany);
  }
};
