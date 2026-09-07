const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AddProduct.tsx', 'utf8');

const targetUploadBlock = `      // 0.5 Handle File Upload
      let finalImageUrl = formData.image_url;
      if (uploadMethod === 'file' && selectedFile) {
        const category = categories.find(c => c.id === formData.category);
        const folder = category?.slug || category?.name || 'uncategorized';
        const timestamp = Date.now();
        const fileName = \`\${timestamp}_\${selectedFile.name.replace(/[^a-zA-Z0-9.\\-_]/g, '_')}\`;
        const dynamicPath = \`\${folder}/\${fileName}\`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(dynamicPath, selectedFile);
          
        if (uploadError) {
          throw new Error('STORAGE_ERROR: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(dynamicPath);

        finalImageUrl = publicUrlData.publicUrl;
      }`;

const replacementUploadBlock = `      // 0.5 Handle File Upload
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const category = categories.find(c => c.id === formData.category);
        const folder = category?.slug || category?.name || 'uncategorized';
        const uploadPromises = newFiles.map(async (file) => {
          const timestamp = Date.now();
          const fileName = \`\${timestamp}_\${file.name.replace(/[^a-zA-Z0-9.\\-_]/g, '_')}\`;
          const dynamicPath = \`\${folder}/\${fileName}\`;
          const { error: uploadError } = await supabase.storage.from('uploads').upload(dynamicPath, file);
          
          if (uploadError) throw new Error('STORAGE_ERROR: ' + uploadError.message);
          
          const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(dynamicPath);
          return publicUrlData.publicUrl;
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }
      
      const primaryImageUrl = uploadedUrls[0] || '';`;

code = code.replace(targetUploadBlock, replacementUploadBlock);

const targetPayload = `      // 2. Insert Product
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        stock: parseInt(formData.stock) || 0,
        category_id: formData.category,
        brand_id: formData.brand_id || null,
        sku: formData.sku || null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        
        is_service: formData.is_service,`;

const replacementPayload = `      // 2. Insert Product
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        stock: parseInt(formData.stock) || 0,
        category_id: formData.category,
        brand_id: formData.brand_id || null,
        sku: formData.sku || null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        
        image_url: primaryImageUrl,
        image_urls: uploadedUrls,
        
        is_service: formData.is_service,`;

code = code.replace(targetPayload, replacementPayload);

fs.writeFileSync('src/pages/admin/AddProduct.tsx', code);
console.log('Patched upload logic');
