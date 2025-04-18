/**
 * Database Models
 * 
 * This file defines the interfaces that directly map to the database schema.
 * These types represent how data is stored in Supabase.
 */

/**
 * Database categories enum - includes all categories for type safety
 * 
 * Note: Some categories don't have companies mapped to them yet in the database,
 * but we include them here for future use.
 */
export enum DbCategory {
  STRATEGY_PLANNING = "Strategy & Planning",
  CREATIVE_CONTENT = "Creative & Content",
  PERFORMANCE_MEDIA = "Performance & Media Buying",
  SEO_ORGANIC = "SEO & Organic Growth",
  DATA_ANALYTICS = "Data & Analytics",
  WEB_APP_DEVELOPMENT = "Web & App Development",
  SOCIAL_MEDIA = "Social Media & Community Management",
  ACCOUNT_MANAGEMENT = "Account Management & Client Services",
  INFLUENCER_MARKETING = "Influencer & Partnership Marketing",
  BRAND_MANAGEMENT = "Brand Management",
  AD_FRAUD = "Ad Fraud Detection & Prevention",
  AI_NATIVE = "AI-Native Agencies",
  B2B_LEAD_GEN = "B2B & Lead Gen",
  CAMPAIGN_OPERATIONS = "Campaign Operations", 
  ECOMMERCE = "Ecommerce"
}

/**
 * Database representation of a company
 */
export interface DbCompany {
  // Primary fields
  id: string;
  name: string;
  website: string;
  category: DbCategory; // Using DbCategory enum for type safety
  description: string;
  
  // Optional fields with snake_case naming (database convention)
  logo_url?: string | null;
  target_audience?: string | null;
  features?: string[] | null;
  pricing?: string | null;
  details?: DbCompanyDetails | null;
  linkedin_url?: string | null;
  founded_year?: number | null;
  headquarters?: string | null;
  employee_count?: string | null;
  funding_stage?: string | null;
  last_updated?: string | null;
  
  // AI Native criteria fields
  has_dot_ai_domain?: boolean | null;
  founded_after_2020?: boolean | null;
  series_a_or_earlier?: boolean | null;
}

/**
 * Database representation of company details
 */
export interface DbCompanyDetails {
  summary?: string | null;
  highlighted?: boolean | null;
  features?: string[] | null;
  pricing?: string | null;
  bestFor?: string | null;
}

/**
 * Type for database query parameters
 */
export interface DbQueryParams {
  [key: string]: any;
}

/**
 * Type for database insert operations
 */
export type DbInsertParams = Omit<DbCompany, 'id'> & { id?: string };

/**
 * Type for database update operations
 */
export type DbUpdateParams = Partial<DbCompany>;
