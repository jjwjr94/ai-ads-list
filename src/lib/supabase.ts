
import { createClient } from '@supabase/supabase-js';
import { Company, Category } from '../types/database';
import { supabase } from '../integrations/supabase/client';

// Map between TypeScript Category and Supabase database category
const categoryMapping: Record<Category, string> = {
  "Strategy & Planning": "Strategy & Planning",
  "Creative & Content": "Creative & Content",
  "Performance & Media Buying": "Performance & Media Buying",
  "SEO & Organic Growth": "SEO & Organic Growth", 
  "Data & Analytics": "Data & Analytics",
  "Web & App Development": "Web & App Development",
  "Account Management & Client Services": "Account Management & Client Services",
  "Social Media & Community Management": "Social Media & Community Management",
  "Influencer & Partnership Marketing": "Influencer & Partnership Marketing",
  "Brand Management": "Brand Management",
  "Ad Fraud Detection & Prevention": "Ad Fraud Detection & Prevention",
  "AI-Native Agencies": "AI-Native Agencies",
  "Copywriting": "Copywriting",
  "Analytics": "Analytics",
  "SEO": "SEO"
};

// Helper functions to map between database column names and frontend property names
const mapDbRecordToCompany = (record: any): Company => {
  return {
    id: record.id,
    name: record.name,
    website: record.website || '',
    logoUrl: record.logo_url || '',
    logo: record.logo_url || '',
    category: record.category as Category,
    description: record.description || '',
    features: record.features || [],
    pricing: record.pricing || record.details?.pricing || '',
    targetAudience: record.target_audience || record.details?.bestFor || '',
    details: {
      summary: record.details?.summary || '',
      features: record.features || record.details?.features || [],
      highlighted: record.details?.highlighted || false,
      pricing: record.pricing || record.details?.pricing || '',
      bestFor: record.target_audience || record.details?.bestFor || ''
    },
    linkedinUrl: record.linkedin_url || '',
    foundedYear: record.founded_year || undefined,
    headquarters: record.headquarters || '',
    employeeCount: record.employee_count || '',
    fundingStage: record.funding_stage || '',
    lastUpdated: record.last_updated ? new Date(record.last_updated) : new Date(),
    url: record.website || ''
  };
};

const mapCompanyToDbRecord = (company: Company) => {
  return {
    id: company.id,
    name: company.name,
    website: company.website || company.url || '',
    logo_url: company.logoUrl || company.logo || '',
    category: categoryMapping[company.category], // Use mapping here
    description: company.description || '',
    features: company.features || [],
    pricing: company.pricing || company.details?.pricing || '',
    target_audience: company.targetAudience || company.details?.bestFor || '',
    details: company.details || {},
    linkedin_url: company.linkedinUrl || '',
    founded_year: company.foundedYear,
    headquarters: company.headquarters || '',
    employee_count: company.employeeCount || '',
    funding_stage: company.fundingStage || '',
    last_updated: new Date().toISOString()
  };
};

// Helper functions for Supabase operations
export const supabaseAPI = {
  // Company operations
  companies: {
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
        .eq('category', category);
      
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
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
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
      // Map updates to database column names
      const dbUpdates = Object.keys(updates).reduce((acc: any, key) => {
        if (key === 'logoUrl') acc.logo_url = updates.logoUrl;
        else if (key === 'targetAudience') acc.target_audience = updates.targetAudience;
        else if (key === 'linkedinUrl') acc.linkedin_url = updates.linkedinUrl;
        else if (key === 'foundedYear') acc.founded_year = updates.foundedYear;
        else if (key === 'employeeCount') acc.employee_count = updates.employeeCount;
        else if (key === 'fundingStage') acc.funding_stage = updates.fundingStage;
        else if (key === 'lastUpdated') acc.last_updated = new Date().toISOString();
        else if (key !== 'logo' && key !== 'url') acc[key] = (updates as any)[key];
        return acc;
      }, {});
      
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
  },
  
  // Storage operations for logos
  storage: {
    async uploadLogo(id: string, file: File, altText: string): Promise<string> {
      console.log(`Uploading logo file for company ${id}: ${file.name}`);
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      try {
        console.log(`Attempting to upload to path: ${filePath}`);
        const { data, error } = await supabase
          .storage
          .from('company-logos')
          .upload(filePath, file, {
            upsert: true
          });
        
        if (error) {
          console.error(`Error uploading logo for company ${id}:`, error);
          throw error;
        }
        
        console.log('Upload successful, data:', data);
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase
          .storage
          .from('company-logos')
          .getPublicUrl(filePath);
          
        console.log(`Generated public URL: ${urlData.publicUrl}`);
          
        return urlData.publicUrl;
      } catch (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
    },
    
    getPublicUrl(path: string): string {
      const { data } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(path);
        
      return data.publicUrl;
    }
  }
};
