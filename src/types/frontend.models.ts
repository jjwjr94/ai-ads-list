/**
 * Frontend Models
 * 
 * This file defines the interfaces used throughout the frontend application.
 * These types represent how data is used in the React components.
 */

/**
 * Frontend representation of a company
 */
export interface Company {
  // Primary fields
  id: string;
  name: string;
  website: string;
  category: Category;
  description: string;
  
  // Required fields with camelCase naming (frontend convention)
  logoUrl: string;
  targetAudience: string;
  features: string[];
  pricing: string;
  details: CompanyDetails;
  
  // Optional fields
  linkedinUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  employeeCount?: string;
  fundingStage?: string;
  lastUpdated?: Date;
  
  // AI Native criteria
  aiNativeCriteria?: AiNativeCriteria;
}

/**
 * Frontend representation of company details
 */
export interface CompanyDetails {
  summary: string;
  highlighted: boolean;
  features: string[];
  pricing: string;
  bestFor: string;
}

/**
 * AI Native criteria for determining if a company is AI-native
 */
export interface AiNativeCriteria {
  hasDotAiDomain?: boolean;
  foundedAfter2020?: boolean;
  seriesAOrEarlier?: boolean;
}

/**
 * Categories enum - aligned with actual database values
 * 
 * Note: This enum has been updated to match exactly with the categories
 * that exist in the Supabase database.
 */
export enum Category {
  STRATEGY_PLANNING = "Strategy & Planning",
  CREATIVE_CONTENT = "Creative & Content",
  PERFORMANCE_MEDIA = "Performance & Media Buying",
  SEO_ORGANIC = "SEO & Organic Growth",
  DATA_ANALYTICS = "Data & Analytics",
  WEB_APP_DEVELOPMENT = "Web & App Development",
  SOCIAL_MEDIA = "Social Media & Community Management"
}

/**
 * Type for company creation
 */
export type CompanyCreate = Omit<Company, 'id'> & { id?: string };

/**
 * Type for company updates
 */
export type CompanyUpdate = Partial<Company>;
