const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('products').select('*').limit(2);
  console.log("Products:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}
test();
