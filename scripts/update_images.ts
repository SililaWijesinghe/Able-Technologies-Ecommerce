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

async function updateImages() {
  console.log("🔄 Updating Categories with Unsplash URLs...");

  // Update Categories
  await supabase.from('categories').update({ 
    icon_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500' 
  }).eq('name', 'Local Machines');

  await supabase.from('categories').update({ 
    icon_url: 'https://images.unsplash.com/photo-1563990112129-a9a721df2a23?auto=format&fit=crop&w=500' 
  }).eq('name', 'Global Machines');

  await supabase.from('categories').update({ 
    icon_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500' 
  }).eq('name', 'Spare Parts');

  console.log("🔄 Updating Products with Unsplash URLs...");

  // Product 1
  const p1Url = 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800';
  await supabase.from('products').update({ image_urls: [p1Url] }).eq('name', 'Pneumatic Pad Printing Machine');
  
  // Product 2
  const p2Url = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800';
  await supabase.from('products').update({ image_urls: [p2Url] }).eq('name', 'Industrial Robotic Arm 6 Axis');

  // Product 3
  const p3Url = 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800';
  await supabase.from('products').update({ image_urls: [p3Url] }).eq('name', 'Air Cylinder ISO 15552');

  // Also update product_images table to be safe, since the API does a join
  const { data: products } = await supabase.from('products').select('id, name');
  if (products) {
    for (const product of products) {
        let url = '';
        if (product.name === 'Pneumatic Pad Printing Machine') url = p1Url;
        if (product.name === 'Industrial Robotic Arm 6 Axis') url = p2Url;
        if (product.name === 'Air Cylinder ISO 15552') url = p3Url;
        
        if (url) {
            // Delete old images
            await supabase.from('product_images').delete().eq('product_id', product.id);
            // Insert new image
            await supabase.from('product_images').insert({
                product_id: product.id,
                image_url: url,
                display_order: 0
            });
        }
    }
  }

  console.log("✅ Images updated successfully!");
}

updateImages().catch(console.error);
