import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './supabaseMock';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isRealSupabaseConfigured = 
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder.supabase.co'));

if (!isRealSupabaseConfigured) {
  console.info('Running in offline/mock database mode with rich sample inventory.');
}

export const supabase: any = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

