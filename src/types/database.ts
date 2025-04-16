// Database structure for AI marketing companies

interface Company {
  id: string;               // Unique identifier
  name: string;             // Company name
  url: string;              // Company website URL
  description: string;      // Short description
  category: Category;       // Category enum
  logo: string;             // Path to logo image
  details: {
    summary: string;        // Detailed summary
    features: string[];     // Key features list
    pricing: string;        // Pricing information
    bestFor: string;        // Target audience
    highlighted?: boolean;  // Whether to highlight this company
  };
  linkedinUrl?: string;     // LinkedIn URL
  foundedYear?: number;     // Year founded
  headquarters?: string;    // Company headquarters location
  employeeCount?: string;   // Approximate employee count range
  fundingStage?: string;    // Funding information if available
  lastUpdated: Date;        // When this entry was last updated
}

// Categories enum
enum Category {
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
  AD_NATIVE = "Ad-Native Agencies"
}

// Sample database structure
interface CompanyDatabase {
  companies: Company[];
  getCompaniesByCategory(category: Category): Company[];
  getCompanyById(id: string): Company | undefined;
  addCompany(company: Company): void;
  updateCompany(id: string, updates: Partial<Company>): void;
  deleteCompany(id: string): void;
  getHighlightedCompanies(): Company[];
}
