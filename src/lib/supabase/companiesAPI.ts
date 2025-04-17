
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

import { supabase } from '@/integrations/supabase/client';
import { 
  Company as DatabaseCompany,
  Category
} from '../../types/database';

import { Company, CompanyCreate } from '../../types/frontend.models';

import {
  mapDbCompanyToCompany,
  mapCompanyToDbInsert,
  mapCompanyUpdateToDbUpdate
} from '../../types/mappers';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/integrations/supabase/types';

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
  last_updated?: string; // Ensure this is string type
  has_dot_ai_domain?: boolean;
  founded_after_2020?: boolean | null;
  series_a_or_earlier?: boolean | null;
  [key: string]: any;
}


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
    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
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
    if (data) {
      // Ensure last_updated is string if it exists
      if (data.last_updated && typeof data.last_updated === 'object') {
        data.last_updated = new Date(data.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(data as DbRecord);
    }
    
    return null;
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
  async create(company: CompanyCreate): Promise<Company> {
    // Convert the company to the format expected by the database
    // Ensure the company has required fields
    if (!company.name || !company.website || !company.category) {
      throw new Error('Missing required fields for company');
    }

    // Generate a new ID if one doesn't exist
    const companyWithId: Company = { 
      ...company as any, 
      id: company.id || uuidv4() 
    };
    
    // Map to database format
    const dbCompany = mapCompanyToDbInsert(companyWithId);
    
    // Ensure the category is cast to the correct enum type
    const { data, error } = await supabase
      .from('companies')
      .insert([dbRecord]) // Use array to satisfy TypeScript
      .insert({
        ...dbCompany,
        category: dbCompany.category as Database["public"]["Enums"]["company_category"]
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding company:', error);
      return null;
    }

    return mapDbRecordToCompany(data);
    // Ensure last_updated is string if it exists
    if (data.last_updated && typeof data.last_updated === 'object') {
      data.last_updated = new Date(data.last_updated).toISOString();
    }
    
    return mapDbCompanyToCompany(data as DbRecord);
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

  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    // Convert the updates to the format expected by the database
    const dbUpdates = mapCompanyUpdateToDbUpdate(updates as any);
    
    // Ensure the category is cast if it exists
    if (dbUpdates.category) {
      dbUpdates.category = dbUpdates.category as Database["public"]["Enums"]["company_category"];
    }
    
    const { error } = await supabase
      .from('companies')
      .update(dbUpdates as any)
      .eq('id', id);
    
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

    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
  },

  /**
   * Search for companies
   * @param query The search query
   * @returns Promise resolving to an array of Company objects
   */
  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching companies:', error);
      throw error;
    }

    // Type assertion to ensure compatibility
    const mappedCompanies = (data || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    return mappedCompanies;
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
  async getHighlighted(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .filter('details->highlighted', 'eq', true);
    
    if (error) {
      console.error('Error fetching highlighted companies:', error);
      throw error;
    }

    if (data && data.length > 0) {
      // Type assertion to ensure compatibility
      const mappedCompanies = data.map((item) => {
        // Ensure last_updated is string if it exists
        if (item.last_updated && typeof item.last_updated === 'object') {
          item.last_updated = new Date(item.last_updated).toISOString();
        }
        return mapDbCompanyToCompany(item as DbRecord);
      });
      
      // Randomize the order of highlighted companies
      return mappedCompanies.sort(() => 0.5 - Math.random());
    }
    
    // If no highlighted companies, get random companies as fallback
    const { data: randomData, error: randomError } = await supabase
      .from('companies')
      .select('*')
      .limit(6);
    
    if (randomError) {
      console.error('Error fetching random companies:', randomError);
      throw randomError;
    }

    // Type assertion to ensure compatibility
    const mappedRandomCompanies = (randomData || []).map((item) => {
      // Ensure last_updated is string if it exists
      if (item.last_updated && typeof item.last_updated === 'object') {
        item.last_updated = new Date(item.last_updated).toISOString();
      }
      return mapDbCompanyToCompany(item as DbRecord);
    });
    
    // Return random companies in a random order
    return mappedRandomCompanies.sort(() => 0.5 - Math.random());
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
  }
};
