
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use direct values for the Supabase URL and Anon key
// These are public keys that are safe to use in browser code
const SUPABASE_URL = 'https://mkbrqiknsraiskoybdry.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYnJxaWtuc3JhaXNrb3liZHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTEwODcsImV4cCI6MjA2MDM4NzA4N30.JUPus1q5WEBwXFC9cvqQnt6WEzM1ajqx71MAT9Tw0dk';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
