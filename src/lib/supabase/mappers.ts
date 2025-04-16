
import { Company, Category, CompanyDetails } from '../../types/database';
import type { Database } from '../../integrations/supabase/types';
import { categoryMapping } from './categoryMapping';

// Helper function to map database record to Company object
export const mapDbRecordToCompany = (record: any): Company => {
  // Get the logo URL, which may be base64 encoded
  const logoUrl = record.logo_url || '';
  
  // Convert details to a proper CompanyDetails object, handling null/undefined
  const details: CompanyDetails = {
    summary: record.details?.summary ?? null,
    detailFeatures: record.details?.detailFeatures || record.features || [],
    highlighted: record.details?.highlighted ?? false,
    pricing: record.details?.pricing ?? null,
    bestFor: record.details?.bestFor ?? null
  };

  return {
    id: record.id,
    name: record.name,
    website: record.website || '',
    logoUrl: logoUrl, // This may be base64 encoded
    logo: logoUrl, // Keep both logo fields for backward compatibility
    category: record.category as Category,
    description: record.description || '',
    features: record.features || [],
    pricing: record.pricing || (record.details?.pricing || ''),
    targetAudience: record.target_audience || (record.details?.bestFor || ''),
    details: details,
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
  // Prepare logo URL, keep base64 as is
  const logoUrl = company.logoUrl || company.logo || '';
  
  // Create a plain object for details that can be serialized to JSON
  const detailsObj = {
    summary: company.details?.summary ?? null,
    detailFeatures: company.details?.detailFeatures || company.features || [],
    highlighted: Boolean(company.details?.highlighted ?? false),
    pricing: company.details?.pricing ?? null,
    bestFor: company.details?.bestFor ?? null
  };
  
  const dbRecord: Database['public']['Tables']['companies']['Insert'] = {
    id: company.id,
    name: company.name,
    website: company.website || company.url || '',
    logo_url: logoUrl,
    category: categoryMapping[company.category],
    description: company.description || '',
    features: company.features || company.details?.detailFeatures || [],
    pricing: company.pricing || (company.details?.pricing || ''),
    target_audience: company.targetAudience || (company.details?.bestFor || ''),
    details: detailsObj,
    linkedin_url: company.linkedinUrl || '',
    founded_year: company.foundedYear,
    headquarters: company.headquarters || '',
    employee_count: company.employeeCount || '',
    funding_stage: company.fundingStage || '',
    last_updated: new Date().toISOString()
  };
  
  return dbRecord;
};
