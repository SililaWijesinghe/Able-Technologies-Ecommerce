import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking products table...");
  const { data: prodData, error: prodErr } = await supabase.from('products').select('category, category_id').limit(5);
  console.log("Products:", prodData, "Error:", prodErr);

  console.log("\nAttempting to insert a dummy category...");
  const { data: insertData, error: insertErr } = await supabase.from('categories').insert([{
    name: 'Test Category',
    slug: 'test-category',
    description: 'Testing insert permissions'
  }]).select();
  console.log("Insert Result:", insertData, "Insert Error:", insertErr);
}
test();
