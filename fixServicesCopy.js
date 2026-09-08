const fs = require('fs');
let file = 'src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

// The image uses "On-Time Delivery"
content = content.replace(
  /\{ icon: Clock, title: "Reliable Service", desc: "Professional and dependable" \}/g,
  '{ icon: Clock, title: "On-Time Delivery", desc: "Reliable service" }'
);

// High Precision uses Diamond icon. Lucide react has "Diamond".
if (!content.includes('Diamond')) {
  content = content.replace(/import \{ /, 'import { Diamond, ');
}

content = content.replace(
  /\{ icon: Layers, title: "High Precision"/g,
  '{ icon: Diamond, title: "High Precision"'
);

// The fourth image says "METAL CUTTING", "Mild Steel, Aluminum, Stainless Steel"
// Wait, in my laser cutting gallery, I only had 3 images. Let me check the prompt.
// "SERVICES CARD: Metal Cutting... Leather Cutting... Name Engraving"
// RIGHT SIDE - IMAGE GALLERY:
// PRECISION CUTTING, LEATHER CUTTING, NAME ENGRAVING, METAL CUTTING
// That's 4 images. My script generated 1 large + 2 small = 3 images.
fs.writeFileSync(file, content);
