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
  // Required fields
  id: string;
  name: string;
  website: string;
  
  // Optional fields
  category?: Category;
  description?: string;
  logoUrl?: string;
  targetAudience?: string;
  features?: string[];
  pricing?: string;
  details: CompanyDetails;
  
  // Optional metadata
  logo?: string;
  linkedinUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  employeeCount?: string;
  fundingStage?: string;
  lastUpdated?: Date;
  aiNativeCriteria?: AiNativeCriteria;
  url?: string;
}

/**
 * Frontend representation of company details
 */
export interface CompanyDetails {
  summary?: string;
  highlighted?: boolean;
  features?: string[]; // This line is added to ensure features exists in CompanyDetails
  pricing: string | null; // Explicitly allow null to match database model
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
 * Categories enum - includes all categories, even those without companies yet
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
  AI_NATIVE = "AI-Native Agencies",
  B2B_LEAD_GEN = "B2B & Lead Gen",
  CAMPAIGN_OPERATIONS = "Campaign Operations", 
  ECOMMERCE = "Ecommerce",
  SIMULATION_FORECASTING = "Simulation/Forecasting",
  AFFILIATE = "Affiliate"
}

/**
 * Type for company creation
 */
export type CompanyCreate = Omit<Company, 'id'>;

/**
 * Type for company updates
 */
export type CompanyUpdate = Partial<Company>;
