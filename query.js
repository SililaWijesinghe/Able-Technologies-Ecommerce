const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('products').select('id, name, category, category_id').limit(5);
  console.log("Products:", JSON.stringify(data, null, 2));
}
test();
