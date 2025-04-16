
import { supabase } from '@/integrations/supabase/client';
import type { Company, Category } from '../../types/database';
import { categoryMapping } from './categoryMapping';

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

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
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

    // Explicitly cast data to Company and provide default values
    return data ? {
      ...data,
      logoUrl: data.logo_url || '',
      targetAudience: data.target_audience || '',
      details: data.details || {}
    } as Company : null;
  },

  async create(company: Company): Promise<Company> {
    // Convert Company type to a Supabase compatible object
    const supabaseCompany = {
      id: company.id,
      name: company.name,
      website: company.website,
      category: company.category,
      description: company.description,
      features: company.features,
      pricing: company.pricing,
      target_audience: company.targetAudience,
      logo_url: company.logoUrl || company.logo,
      details: company.details,
      linkedin_url: company.linkedinUrl,
      founded_year: company.foundedYear,
      headquarters: company.headquarters,
      employee_count: company.employeeCount,
      funding_stage: company.fundingStage,
      last_updated: company.lastUpdated || new Date(),
      has_dot_ai_domain: company.aiNativeCriteria?.hasDotAiDomain,
      founded_after_2020: company.aiNativeCriteria?.foundedAfter2020,
      series_a_or_earlier: company.aiNativeCriteria?.seriesAOrEarlier,
    };

    const { data, error } = await supabase
      .from('companies')
      .insert(supabaseCompany)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    // Explicitly cast data to Company and provide default values
    return {
      ...data,
      logoUrl: data.logo_url || '',
      targetAudience: data.target_audience || '',
      details: data.details || {}
    } as Company;
  },

  async update(id: string, updates: Partial<Company>): Promise<boolean> {
    // Convert Company type to a Supabase compatible object
    const supabaseUpdates: Record<string, any> = {};
    
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.website !== undefined) supabaseUpdates.website = updates.website;
    if (updates.category !== undefined) supabaseUpdates.category = updates.category;
    if (updates.description !== undefined) supabaseUpdates.description = updates.description;
    if (updates.features !== undefined) supabaseUpdates.features = updates.features;
    if (updates.pricing !== undefined) supabaseUpdates.pricing = updates.pricing;
    if (updates.targetAudience !== undefined) supabaseUpdates.target_audience = updates.targetAudience;
    if (updates.logoUrl !== undefined) supabaseUpdates.logo_url = updates.logoUrl;
    if (updates.logo !== undefined) supabaseUpdates.logo_url = updates.logo;
    if (updates.details !== undefined) supabaseUpdates.details = updates.details;
    if (updates.linkedinUrl !== undefined) supabaseUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.foundedYear !== undefined) supabaseUpdates.founded_year = updates.foundedYear;
    if (updates.headquarters !== undefined) supabaseUpdates.headquarters = updates.headquarters;
    if (updates.employeeCount !== undefined) supabaseUpdates.employee_count = updates.employeeCount;
    if (updates.fundingStage !== undefined) supabaseUpdates.funding_stage = updates.fundingStage;
    if (updates.lastUpdated !== undefined) supabaseUpdates.last_updated = updates.lastUpdated;
    
    if (updates.aiNativeCriteria) {
      if (updates.aiNativeCriteria.hasDotAiDomain !== undefined) 
        supabaseUpdates.has_dot_ai_domain = updates.aiNativeCriteria.hasDotAiDomain;
      if (updates.aiNativeCriteria.foundedAfter2020 !== undefined) 
        supabaseUpdates.founded_after_2020 = updates.aiNativeCriteria.foundedAfter2020;
      if (updates.aiNativeCriteria.seriesAOrEarlier !== undefined) 
        supabaseUpdates.series_a_or_earlier = updates.aiNativeCriteria.seriesAOrEarlier;
    }

    const { error } = await supabase
      .from('companies')
      .update(supabaseUpdates)
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

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
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

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
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

    // Explicitly cast data to Company[] and provide default values
    return (data || []).map(company => ({
      ...company,
      logoUrl: company.logo_url || '',
      targetAudience: company.target_audience || '',
      details: company.details || {}
    })) as Company[];
  }
};
