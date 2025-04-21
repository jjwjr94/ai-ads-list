
import type { Database } from '@/integrations/supabase/types';
import * as companiesAPI from './companiesAPI';
import { storageAPI } from './storageAPI';

// Main export of the Supabase API
export const supabaseAPI = {
  companies: companiesAPI,
  storage: storageAPI
};
