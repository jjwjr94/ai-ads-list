
// Re-export types from the Supabase generated types
export type { Database } from '@/integrations/supabase/types';
export type Company = Database['public']['Tables']['companies']['Row'];
export type Category = Database['public']['Enums']['company_category'];
export type CompanyDetails = NonNullable<Company['details']>;

