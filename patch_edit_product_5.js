const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

const regex = /low_stock_threshold: parseInt\(formData\.low_stock_threshold\) \|\| 5,/;
if (code.match(regex)) {
  code = code.replace(regex, "low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,\n        image_url: primaryImageUrl,\n        image_urls: finalImageUrls,");
  console.log("Patched payload.");
} else {
  console.log("Failed.");
}

fs.writeFileSync('src/pages/admin/EditProduct.tsx', code);
