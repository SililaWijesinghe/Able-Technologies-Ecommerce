import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking slug...");
  let err1 = await supabase.from('categories').insert([{ name: 't', slug: 't' }]);
  console.log("Slug Error:", err1.error?.message);

  console.log("Checking description...");
  let err2 = await supabase.from('categories').insert([{ name: 't', description: 't' }]);
  console.log("Desc Error:", err2.error?.message);
}
test();
