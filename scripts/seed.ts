import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Seeding Database...");

  // 1. Settings
  console.log("⚙️  Seeding Store Settings...");
  const { error: settingsError } = await supabase.from('store_settings').upsert({
    id: 1,
    whatsapp_number: '+1-555-019-8372',
    support_email: 'support@abletechnologies.com',
    updated_at: new Date().toISOString()
  });
  
  if (settingsError) console.error("Error with settings:", settingsError);

  // 2. Categories
  console.log("📂 Seeding Categories...");
  const categoriesToInsert = [
    { name: 'Local Machines', icon_url: 'https://via.placeholder.com/400/0b1042/FFFFFF?text=Local+Machines' },
    { name: 'Global Machines', icon_url: 'https://via.placeholder.com/400/0b1042/FFFFFF?text=Global+Machines' },
    { name: 'Spare Parts', icon_url: 'https://via.placeholder.com/400/0b1042/FFFFFF?text=Spare+Parts' },
    { name: 'Gauges', icon_url: 'https://via.placeholder.com/400/0b1042/FFFFFF?text=Gauges' },
    { name: 'Glue', icon_url: 'https://via.placeholder.com/400/0b1042/FFFFFF?text=Glue' }
  ];

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .insert(categoriesToInsert)
    .select();

  if (catError) {
    console.error("Error inserting categories:", catError);
    return;
  }

  // 3. Products
  console.log("📦 Seeding Products...");
  const localMachineId = categories.find(c => c.name === 'Local Machines')?.id;
  const globalMachineId = categories.find(c => c.name === 'Global Machines')?.id;
  const sparePartsId = categories.find(c => c.name === 'Spare Parts')?.id;

  const productsToInsert = [
    {
      name: 'Pneumatic Pad Printing Machine',
      specs: { description: 'High quality pad printing machine designed for industrial precision.' },
      price: 485000.00,
      stock: 10,
      stock_status: 'IN_STOCK',
      category_id: localMachineId,
      image_urls: ['https://via.placeholder.com/400/0b1042/FFFFFF?text=Pneumatic+Pad+Printing+Machine']
    },
    {
      name: 'Industrial Robotic Arm 6 Axis',
      specs: { description: 'Advanced 6-Axis robotic arm for high-speed automated manufacturing lines.' },
      price: 1850000.00,
      stock: 5,
      stock_status: 'IN_STOCK',
      category_id: globalMachineId,
      image_urls: ['https://via.placeholder.com/400/0b1042/FFFFFF?text=Industrial+Robotic+Arm+6+Axis']
    },
    {
      name: 'Air Cylinder ISO 15552',
      specs: { description: 'Standard heavy-duty pneumatic air cylinder for robust automation.' },
      price: 12500.00,
      stock: 50,
      stock_status: 'IN_STOCK',
      category_id: sparePartsId,
      image_urls: ['https://via.placeholder.com/400/0b1042/FFFFFF?text=Air+Cylinder+ISO+15552']
    }
  ];

  const { data: products, error: prodError } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select();

  if (prodError) {
    console.error("Error inserting products:", prodError);
    return;
  }

  // 4. Product Images
  console.log("🖼️  Seeding Product Images...");
  for (const product of products) {
    // Delete existing images for this product just in case to prevent duplicates without unique constraints
    await supabase.from('product_images').delete().eq('product_id', product.id);
    
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: `https://via.placeholder.com/400/0b1042/FFFFFF?text=${encodeURIComponent(product.name.split(' ').join('+'))}`,
      display_order: 0
    });
  }

  console.log("✅ Seeding completed successfully!");
}

seed().catch(console.error);
