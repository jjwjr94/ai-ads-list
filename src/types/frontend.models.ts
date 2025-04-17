/**
 * Frontend Models
 * 
 * This file defines the interfaces used throughout the frontend application.
 * These types represent how data is used in the React components.
 */

import type { Database } from '@/integrations/supabase/types';

/**
 * Frontend representation of a company
 */
export interface Company {
  // Required fields
  id: string;
  name: string;
  website: string;
  logoUrl: string;
  
  // Optional fields
  category?: Category;
  description?: string;
  targetAudience?: string;
  features?: string[];
  pricing?: string;
  details: CompanyDetails;
  
  // Optional metadata
  linkedinUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  employeeCount?: string;
  fundingStage?: string;
  lastUpdated?: Date;
  aiNativeCriteria?: AiNativeCriteria;
}

/**
 * Frontend representation of company details
 */
export interface CompanyDetails {
  summary?: string;
  highlighted?: boolean;
  features?: string[];
  pricing: string | null; // Nullable to match database model
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
 * Categories enum
 */
export enum Category {
  STRATEGY_PLANNING = "Strategy & Planning",
  CREATIVE_CONTENT = "Creative & Content",
  PERFORMANCE_MEDIA = "Performance & Media Buying",
  SEO_ORGANIC = "SEO & Organic Growth",
  DATA_ANALYTICS = "Data & Analytics",
  WEB_APP_DEVELOPMENT = "Web & App Development",
  ACCOUNT_MANAGEMENT = "Account Management & Client Services",
  SOCIAL_MEDIA = "Social Media & Community Management",
  INFLUENCER_MARKETING = "Influencer & Partnership Marketing",
  BRAND_MANAGEMENT = "Brand Management",
  AD_FRAUD = "Ad Fraud Detection & Prevention",
  AI_NATIVE = "AI-Native Agencies"
}

/**
 * Type for company creation
 */
export type CompanyCreate = Omit<Company, 'id'> & { id?: string };

/**
 * Type for company updates
 */
export type CompanyUpdate = Partial<Company>;
