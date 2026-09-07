const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

const regex = /(low_stock_threshold: parseInt\(formData\.low_stock_threshold\) \|\| 5,)([\s\S]*?)(status: formData\.status)/;
if (code.match(regex)) {
  code = code.replace(regex, "$1\n        image_url: primaryImageUrl,\n        image_urls: finalImageUrls,\n        $3");
  console.log("Patched payload using regex capture.");
} else {
  console.log("Still failed.");
}

fs.writeFileSync('src/pages/admin/EditProduct.tsx', code);
