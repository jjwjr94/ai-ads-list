
/**
 * Frontend Models
 * 
 * This file defines the interfaces used throughout the frontend application.
 * These types represent how data is used in the React components.
 */

import type { Database } from '@/integrations/supabase/types';

// Use the company category enum directly from the database types
export type Category = Database['public']['Enums']['company_category'];

/**
 * Frontend representation of company details
 */
export interface CompanyDetails {
  summary?: string | null;
  highlighted?: boolean | null;
  features?: string[] | null;
  pricing?: string | null;
  bestFor?: string | null;
}

/**
 * Frontend representation of a company - using database structure
 */
export type Company = Database['public']['Tables']['companies']['Row'];

/**
 * Type for company creation
 */
export type CompanyCreate = Database['public']['Tables']['companies']['Insert'];

/**
 * Type for company updates
 */
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

