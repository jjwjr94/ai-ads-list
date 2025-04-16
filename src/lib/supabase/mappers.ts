
import { Company, Category } from '../../types/database';
import type { Database } from '../../integrations/supabase/types';
import { categoryMapping } from './categoryMapping';

// Helper function to map database record to Company object
export const mapDbRecordToCompany = (record: any): Company => {
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

// Helper function to map Company object to database record
export const mapCompanyToDbRecord = (company: Company): Database['public']['Tables']['companies']['Insert'] => {
  const dbRecord: Database['public']['Tables']['companies']['Insert'] = {
    id: company.id,
    name: company.name,
    website: company.website || company.url || '',
    logo_url: company.logoUrl || company.logo || '',
    category: categoryMapping[company.category],
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
  
  return dbRecord;
};
