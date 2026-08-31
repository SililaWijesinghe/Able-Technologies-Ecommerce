const fs = require('fs');

const adminDir = 'src/pages/admin';
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

files.forEach(file => {
  let path = `${adminDir}/${file}`;
  let content = fs.readFileSync(path, 'utf8');

  // Let's reset the content to git HEAD first to avoid multiple replacements ruining it.
  // Actually, I can't easily reset, but I haven't modified other files yet.
});
