const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

// The upload logic regex:
const uploadLogicRegex = /\/\/ 0\.5 Handle File Upload[\s\S]*?(?=\/\/ Determine Price)/;
const uploadLogicStr = `// 0.5 Handle File Upload
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
      
      const finalImageUrls = [...existingImages, ...uploadedUrls];
      const primaryImageUrl = finalImageUrls[0] || '';

      `;

if (code.match(uploadLogicRegex)) {
  code = code.replace(uploadLogicRegex, uploadLogicStr);
  console.log("Patched upload logic");
} else {
  console.log("Could not find upload logic");
}

// Payload Regex:
const payloadRegex = /low_stock_threshold: parseInt\(formData\.low_stock_threshold\) \|\| 5,\s*image_url: finalImageUrl,\s*image_urls: finalImageUrl \? \[finalImageUrl\] : \[\],/g;
const payloadReplacement = `low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        image_url: primaryImageUrl,
        image_urls: finalImageUrls,`;
        
if (code.match(payloadRegex)) {
  code = code.replace(payloadRegex, payloadReplacement);
  console.log("Patched payload");
} else {
  console.log("Could not find payload, trying alternative...");
  const altPayloadRegex = /low_stock_threshold: parseInt\(formData\.low_stock_threshold\) \|\| 5,[\s\S]*?(?=status: formData\.status,)/;
  if(code.match(altPayloadRegex)) {
      code = code.replace(altPayloadRegex, payloadReplacement + "\n        ");
      console.log("Patched alt payload");
  }
}

fs.writeFileSync('src/pages/admin/EditProduct.tsx', code);
