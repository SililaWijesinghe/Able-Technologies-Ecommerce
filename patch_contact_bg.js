const fs = require('fs');
let code = fs.readFileSync('src/components/contact/ContactFormSection.tsx', 'utf8');

const regex = /<div className="bg-\[#0b1042\] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden h-full">/;
const replacement = `<div className="bg-gradient-to-br from-[#0b1042] via-[#161c57] to-[#060a2b] bg-[length:200%_200%] animate-gradient rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden h-full">`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/contact/ContactFormSection.tsx', code);
  console.log("Patched contact info box background.");
} else {
  console.log("Could not find contact info box div.");
}
