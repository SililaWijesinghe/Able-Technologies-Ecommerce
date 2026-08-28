import fs from 'fs';
let content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

// Fix the map return
content = content.replace(
  "                  </button>\n                  </div>\n  );\n              })}",
  "                  </button>\n                );\n              })}"
);

fs.writeFileSync('src/pages/Shop.tsx', content);
