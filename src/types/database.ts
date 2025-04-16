
// Database structure for AI marketing companies

export interface Company {
  id: string;               // Unique identifier
  name: string;             // Company name
  website: string;          // Company website URL
  logoUrl: string;          // Path to logo image
  category: Category;       // Category enum
  description: string;      // Short description
  features: string[];       // Key features list
  pricing: string;          // Pricing information
  targetAudience: string;   // Target audience
  details?: {
    summary?: string;       // Detailed summary
    highlighted?: boolean;  // Whether to highlight this company
  };
  linkedinUrl?: string;     // LinkedIn URL
  foundedYear?: number;     // Year founded
  headquarters?: string;    // Company headquarters location
  employeeCount?: string;   // Approximate employee count range
  fundingStage?: string;    // Funding information if available
  lastUpdated?: Date;       // When this entry was last updated
  aiNativeCriteria?: {
    hasDotAiDomain?: boolean;
    foundedAfter2020?: boolean | null;
    seriesAOrEarlier?: boolean | null;
  };
}

// Categories enum
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
  AD_NATIVE = "Ad-Native Agencies",
  COPYWRITING = "Copywriting",
  ANALYTICS = "Analytics",
  SEO = "SEO"
}

// Sample database structure
export interface CompanyDatabase {
  companies: Company[];
  getCompaniesByCategory(category: Category): Company[];
  getCompanyById(id: string): Company | undefined;
  addCompany(company: Company): void;
  updateCompany(id: string, updates: Partial<Company>): void;
  deleteCompany(id: string): void;
  getHighlightedCompanies(): Company[];
}
