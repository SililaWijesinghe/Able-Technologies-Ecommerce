import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Attempting to insert name only...");
  const { data: insertData, error: insertErr } = await supabase.from('categories').insert([{
    name: 'Test Category'
  }]).select();
  console.log("Insert Result:", insertData, "Insert Error:", insertErr);
}
test();
