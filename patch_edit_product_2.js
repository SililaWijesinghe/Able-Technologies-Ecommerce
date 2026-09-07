const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

// 1. Populate State on Load
const populateRegex = /is_customizable: data\.is_customizable \|\| false\s*\}\);/g;
if (code.match(populateRegex)) {
  code = code.replace(populateRegex, 
    "is_customizable: data.is_customizable || false\n        });\n        \n        const imgs = data.image_urls && data.image_urls.length > 0 ? data.image_urls : (data.image_url ? [data.image_url] : []);\n        setExistingImages(imgs);"
  );
  console.log("Patched setFormData logic");
} else {
  console.log("Could not find setFormData logic");
}

// 2. Upgrade the Save Logic
// First, check where upload logic is. It might be single file still.
// Let's replace the whole handleUpdate block containing file upload.
const uploadLogicRegex = /\/\/ 0\.5 Handle File Upload[\s\S]*?(?=\/\/ 1\. Update Product)/g;
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

// Update the updatePayload
const payloadRegex = /image_url: finalImageUrl(?:,\s*image_urls: finalImageUrl \? \[finalImageUrl\] : \[\],)?/g;
const payloadReplacement = `image_url: primaryImageUrl,
          image_urls: finalImageUrls,`;

if (code.match(payloadRegex)) {
  code = code.replace(payloadRegex, payloadReplacement);
  console.log("Patched payload logic");
} else {
  console.log("Could not find payload logic");
  
  // Might be:
  // image_url: finalImageUrl,
  // image_urls: finalImageUrl ? [finalImageUrl] : [],
  const fallbackRegex = /image_url:\s*finalImageUrl,[\s\S]*?(?=status:)/;
  if(code.match(fallbackRegex)) {
     code = code.replace(fallbackRegex, payloadReplacement + "\n          ");
     console.log("Patched fallback payload logic");
  }
}

fs.writeFileSync('src/pages/admin/EditProduct.tsx', code);
