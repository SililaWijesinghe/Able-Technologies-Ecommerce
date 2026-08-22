const fs = require('fs');
let text = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const lines = text.split('\n');
const footerIndex = lines.findIndex(line => line.includes('<Footer />'));
if (footerIndex !== -1) {
    const end = lines.findIndex(line => line.includes('</>'));
    lines.splice(footerIndex, end - footerIndex);
    fs.writeFileSync('src/pages/Home.tsx', lines.join('\n'));
}
