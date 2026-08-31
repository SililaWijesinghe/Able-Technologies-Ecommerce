const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(
  'import { useEffect, useState, useRef } from \'react\';',
  'import { useEffect, useState } from \'react\';'
);

content = content.replace(
  '  ChevronDown, \n',
  ''
);

fs.writeFileSync('src/components/Header.tsx', content);
