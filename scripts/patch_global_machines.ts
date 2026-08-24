import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function patchGlobalMachines() {
  console.log("🔄 Patching 'Global Machines' category image...");
  
  const { data, error } = await supabase
    .from('categories')
    .update({ icon_url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=500' })
    .eq('name', 'Global Machines')
    .select();

  if (error) {
    console.error("❌ Error updating category:", error);
  } else {
    console.log("✅ Successfully patched Global Machines:", data);
  }
}

patchGlobalMachines().catch(console.error);
