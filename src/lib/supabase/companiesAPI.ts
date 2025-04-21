// src/lib/supabase/companiesAPI.ts

import { Category } from '@/types/frontend.models';
import { DbCategory } from '@/types/database.models';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyCreate, CompanyUpdate } from '@/types/frontend.models';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/integrations/supabase/types';

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
  last_updated?: string;
  has_dot_ai_domain?: boolean;
  founded_after_2020?: boolean | null;
  series_a_or_earlier?: boolean | null;
  [key: string]: any;
}

// Define the correct interface for the RPC function's parameters
interface UpdateCompanyLogoParams {
  company_id: string;
  logo_url_value: string;
}

// Define an interface for updating category
interface UpdateCompanyCategoryParams {
  company_id: string;
  category_value: string;
}

export const mapDbRecordToCompany = (record: any): Company => {
  return {
    id: record.id,
    name: record.name,
    website: record.website,
    category: record.category as Category,
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

export const mapCompanyToDbRecord = (company: CompanyCreate) => {
  const dbRecord: any = {
    name: company.name,
    website: company.website,
    category: company.category,
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

  if (company.aiNativeCriteria) {
    dbRecord.has_dot_ai_domain = company.aiNativeCriteria.hasDotAiDomain;
    dbRecord.founded_after_2020 = company.aiNativeCriteria.foundedAfter2020;
    dbRecord.series_a_or_earlier = company.aiNativeCriteria.seriesAOrEarlier;
  }

  return dbRecord;
};

export const companiesAPI = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
    return data.map(mapDbRecordToCompany);
  },

  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
    if (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return null;
    }
    return mapDbRecordToCompany(data);
  },

  async getByCategory(category: Category): Promise<Company[]> {
    const { data, error } = await supabase.from('companies').select('*').eq('category', category).order('name', { ascending: true });
    if (error) {
      console.error(`Error fetching companies in category ${category}:`, error);
      return [];
    }
    return data.map(mapDbRecordToCompany);
  },

  async add(company: CompanyCreate): Promise<Company | null> {
    const dbRecord = mapCompanyToDbRecord(company);
    const generatedId = company.id || uuidv4();
    dbRecord.id = generatedId;

    const { data, error } = await supabase.from('companies').insert([dbRecord]).select().single();
    if (error) {
      console.error('Error adding company:', error);
      return null;
    }
    return mapDbRecordToCompany(data);
  },

  async update(id: string, updates: CompanyUpdate): Promise<Company | null> {
    try {
      const cleanUpdates = {} as Record<string, any>;

      if (updates.name !== undefined) cleanUpdates.name = updates.name;
      if (updates.website !== undefined) cleanUpdates.website = updates.website;
      if (updates.category !== undefined) cleanUpdates.category = updates.category;
      if (updates.description !== undefined) cleanUpdates.description = updates.description;
      if (updates.logoUrl !== undefined) cleanUpdates.logo_url = updates.logoUrl;
      if (updates.targetAudience !== undefined) cleanUpdates.target_audience = updates.targetAudience;
      if (updates.features !== undefined) cleanUpdates.features = updates.features;
      if (updates.pricing !== undefined) cleanUpdates.pricing = updates.pricing;
      if (updates.linkedinUrl !== undefined) cleanUpdates.linkedin_url = updates.linkedinUrl;
      if (updates.foundedYear !== undefined) cleanUpdates.founded_year = updates.foundedYear;
      if (updates.headquarters !== undefined) cleanUpdates.headquarters = updates.headquarters;
      if (updates.employeeCount !== undefined) cleanUpdates.employee_count = updates.employeeCount;
      if (updates.fundingStage !== undefined) cleanUpdates.funding_stage = updates.fundingStage;
      if (updates.details !== undefined) cleanUpdates.details = updates.details;

      if (updates.aiNativeCriteria) {
        if (updates.aiNativeCriteria.hasDotAiDomain !== undefined)
          cleanUpdates.has_dot_ai_domain = updates.aiNativeCriteria.hasDotAiDomain;
        if (updates.aiNativeCriteria.foundedAfter2020 !== undefined)
          cleanUpdates.founded_after_2020 = updates.aiNativeCriteria.foundedAfter2020;
        if (updates.aiNativeCriteria.seriesAOrEarlier !== undefined)
          cleanUpdates.series_a_or_earlier = updates.aiNativeCriteria.seriesAOrEarlier;
      }

      if (Object.keys(cleanUpdates).length === 0) return null;

      cleanUpdates.last_updated = new Date().toISOString();

      // Special handling for logo-only updates
      if (Object.keys(cleanUpdates).length === 2 && cleanUpdates.logo_url) {
        const rpcParams: UpdateCompanyLogoParams = {
          company_id: id,
          logo_url_value: cleanUpdates.logo_url
        };

        // Fix: Provide both type arguments for RPC call
        const { data, error } = await supabase.rpc<
          'update_company_logo', 
          Database['public']['Functions']['update_company_logo']['Returns']
        >('update_company_logo', rpcParams);

        if (!error && data) {
          return mapDbRecordToCompany(data[0]);
        }
      }

      // Special handling for category-only updates
      if (Object.keys(cleanUpdates).length === 2 && cleanUpdates.category) {
        console.log('Performing category-only update with value:', cleanUpdates.category);
        
        // Use a direct update for category changes since there's no RPC function for this
        const { data, error } = await supabase
          .from('companies')
          .update({ 
            category: cleanUpdates.category,
            last_updated: cleanUpdates.last_updated 
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating company category:', error);
          return null;
        }
        
        if (data) {
          console.log('Category update successful:', data);
          return mapDbRecordToCompany(data);
        }
      }

      const { data, error } = await supabase.from('companies').update(cleanUpdates).eq('id', id).select().single();
      if (error || !data) return null;

      return mapDbRecordToCompany(data);
    } catch (error) {
      console.error(`Exception updating company ${id}:`, error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('companies').delete().eq('id', id);
    return !error;
  },

  async search(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    if (error) return [];
    return data.map(mapDbRecordToCompany);
  },

  async getHighlighted(): Promise<Company[]> {
    const { data, error } = await supabase.from('companies').select('*').filter('details->highlighted', 'eq', true);
    if (error) return [];
    if (data && data.length > 0) {
      return data.map(mapDbRecordToCompany).sort(() => 0.5 - Math.random());
    }
    const { data: randomData, error: randomError } = await supabase.from('companies').select('*').limit(6);
    if (randomError) return [];
    return randomData.map(mapDbRecordToCompany).sort(() => 0.5 - Math.random());
  },

  async uploadLogo(companyId: string, file: File, fileName: string): Promise<string> {
    const fileExt = fileName.split('.').pop();
    const filePath = `${companyId}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('company-logos').upload(filePath, file, { upsert: true });
    if (uploadError) throw new Error(`Failed to upload logo: ${uploadError.message}`);

    const { data } = supabase.storage.from('company-logos').getPublicUrl(filePath);
    const logoUrl = data.publicUrl;
    await this.update(companyId, { logoUrl });
    return logoUrl;
  }
};
