import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './supabaseMock';

let supabaseClient: any = null;

export function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (url && key && !url.includes('placeholder.supabase.co')) {
      supabaseClient = createClient(url, key);
    } else {
      console.info('[Server] Using in-memory database mock (no Supabase credentials provided).');
      supabaseClient = createMockSupabaseClient();
    }
  }
  return supabaseClient;
}
