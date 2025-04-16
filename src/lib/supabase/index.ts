
import { Database } from '../integrations/supabase/types';
import { companiesAPI } from './companiesAPI';
import { storageAPI } from './storageAPI';

// Main export of the Supabase API
export const supabaseAPI = {
  companies: companiesAPI,
  storage: storageAPI
};
