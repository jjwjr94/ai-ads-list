
/**
 * Database Models
 * 
 * This file defines the interfaces that directly map to the database schema.
 * These types represent how data is stored in Supabase.
 */

/**
 * Database representation of a company
 */
export interface DbCompany {
  // Primary fields
  id: string;
  name: string;
  website: string;
  category: string;
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
