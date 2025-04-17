
/**
 * Mapper functions for converting between database and frontend models
 * 
 * This file contains utility functions that handle the transformation
 * between database models (how data is stored in Supabase) and
 * frontend models (how data is used in React components).
 */

import { 
  DbCompany, 
  DbCompanyDetails,
  DbInsertParams,
  DbUpdateParams
} from './database.models';

import {
  Company,
  CompanyDetails,
  Category,
  AiNativeCriteria,
  CompanyCreate,
  CompanyUpdate
} from './frontend.models';

/**
 * Maps a database company record to a frontend Company object
 * @param dbCompany The database company record
 * @returns A frontend Company object
 */
export function mapDbCompanyToCompany(dbCompany: DbCompany): Company {
  // Create the company details object
  const details: CompanyDetails = {
    summary: dbCompany.details?.summary || '',
    highlighted: dbCompany.details?.highlighted || false,
    features: dbCompany.details?.features || [],
    pricing: dbCompany.details?.pricing || '',
    bestFor: dbCompany.details?.bestFor || ''
  };

  // Create the AI native criteria object if any of the fields exist
  let aiNativeCriteria: AiNativeCriteria | undefined;
  if (dbCompany.has_dot_ai_domain !== null || 
      dbCompany.founded_after_2020 !== null || 
      dbCompany.series_a_or_earlier !== null) {
    aiNativeCriteria = {
      hasDotAiDomain: dbCompany.has_dot_ai_domain || false,
      foundedAfter2020: dbCompany.founded_after_2020 || false,
      seriesAOrEarlier: dbCompany.series_a_or_earlier || false
    };
  }

  // Create and return the frontend Company object
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    website: dbCompany.website,
    category: dbCompany.category as Category,
    description: dbCompany.description,
    logoUrl: dbCompany.logo_url || '',
    targetAudience: dbCompany.target_audience || '',
    features: dbCompany.features || [],
    pricing: dbCompany.pricing || '',
    details,
    linkedinUrl: dbCompany.linkedin_url,
    foundedYear: dbCompany.founded_year,
    headquarters: dbCompany.headquarters,
    employeeCount: dbCompany.employee_count,
    fundingStage: dbCompany.funding_stage,
    lastUpdated: dbCompany.last_updated ? new Date(dbCompany.last_updated) : undefined,
    aiNativeCriteria
  };
}

/**
 * Maps a frontend Company object to a database company record for insertion
 * @param company The frontend Company object
 * @returns A database company record suitable for insertion
 */
export function mapCompanyToDbInsert(company: CompanyCreate | Company): DbInsertParams {
  // Create the database company record
  const dbCompany: DbInsertParams = {
    id: company.id, // Keep ID for database insertion
    name: company.name,
    website: company.website,
    category: company.category,
    description: company.description || '',
    logo_url: company.logoUrl || '',
    target_audience: company.targetAudience || '',
    features: company.features || [],
    pricing: company.pricing || '',
    details: {
      summary: company.details?.summary || '',
      highlighted: company.details?.highlighted || false,
      features: company.details?.features || [],
      pricing: company.details?.pricing || '',
      bestFor: company.details?.bestFor || ''
    },
    linkedin_url: company.linkedinUrl || '',
    founded_year: company.foundedYear || null,
    headquarters: company.headquarters || '',
    employee_count: company.employeeCount || '',
    funding_stage: company.fundingStage || '',
    last_updated: company.lastUpdated ? company.lastUpdated.toISOString() : new Date().toISOString()
  };

  // Add AI native criteria if it exists
  if (company.aiNativeCriteria) {
    dbCompany.has_dot_ai_domain = company.aiNativeCriteria.hasDotAiDomain;
    dbCompany.founded_after_2020 = company.aiNativeCriteria.foundedAfter2020;
    dbCompany.series_a_or_earlier = company.aiNativeCriteria.seriesAOrEarlier;
  }

  return dbCompany;
}

/**
 * Maps a frontend Company update object to a database update record
 * @param companyUpdate The frontend Company update object
 * @returns A database update record
 */
export function mapCompanyUpdateToDbUpdate(companyUpdate: CompanyUpdate): DbUpdateParams {
  const dbUpdate: DbUpdateParams = {};

  // Map basic fields
  if (companyUpdate.name !== undefined) dbUpdate.name = companyUpdate.name;
  if (companyUpdate.website !== undefined) dbUpdate.website = companyUpdate.website;
  if (companyUpdate.category !== undefined) dbUpdate.category = companyUpdate.category;
  if (companyUpdate.description !== undefined) dbUpdate.description = companyUpdate.description;
  if (companyUpdate.logoUrl !== undefined) dbUpdate.logo_url = companyUpdate.logoUrl;
  if (companyUpdate.targetAudience !== undefined) dbUpdate.target_audience = companyUpdate.targetAudience;
  if (companyUpdate.features !== undefined) dbUpdate.features = companyUpdate.features;
  if (companyUpdate.pricing !== undefined) dbUpdate.pricing = companyUpdate.pricing;
  if (companyUpdate.linkedinUrl !== undefined) dbUpdate.linkedin_url = companyUpdate.linkedinUrl;
  if (companyUpdate.foundedYear !== undefined) dbUpdate.founded_year = companyUpdate.foundedYear;
  if (companyUpdate.headquarters !== undefined) dbUpdate.headquarters = companyUpdate.headquarters;
  if (companyUpdate.employeeCount !== undefined) dbUpdate.employee_count = companyUpdate.employeeCount;
  if (companyUpdate.fundingStage !== undefined) dbUpdate.funding_stage = companyUpdate.fundingStage;
  if (companyUpdate.lastUpdated !== undefined) {
    dbUpdate.last_updated = companyUpdate.lastUpdated.toISOString();
  }

  // Map details if any detail fields are updated
  if (companyUpdate.details) {
    const dbDetails: DbCompanyDetails = {};
    
    if (companyUpdate.details.summary !== undefined) dbDetails.summary = companyUpdate.details.summary;
    if (companyUpdate.details.highlighted !== undefined) dbDetails.highlighted = companyUpdate.details.highlighted;
    if (companyUpdate.details.features !== undefined) dbDetails.features = companyUpdate.details.features;
    if (companyUpdate.details.pricing !== undefined) dbDetails.pricing = companyUpdate.details.pricing;
    if (companyUpdate.details.bestFor !== undefined) dbDetails.bestFor = companyUpdate.details.bestFor;
    
    // Only add details if at least one field is being updated
    if (Object.keys(dbDetails).length > 0) {
      dbUpdate.details = dbDetails;
    }
  }

  // Map AI native criteria if any fields are updated
  if (companyUpdate.aiNativeCriteria) {
    if (companyUpdate.aiNativeCriteria.hasDotAiDomain !== undefined) {
      dbUpdate.has_dot_ai_domain = companyUpdate.aiNativeCriteria.hasDotAiDomain;
    }
    if (companyUpdate.aiNativeCriteria.foundedAfter2020 !== undefined) {
      dbUpdate.founded_after_2020 = companyUpdate.aiNativeCriteria.foundedAfter2020;
    }
    if (companyUpdate.aiNativeCriteria.seriesAOrEarlier !== undefined) {
      dbUpdate.series_a_or_earlier = companyUpdate.aiNativeCriteria.seriesAOrEarlier;
    }
  }

  return dbUpdate;
}
