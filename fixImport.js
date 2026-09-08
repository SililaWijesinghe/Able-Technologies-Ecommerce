const fs = require('fs');
let file = 'src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove Diamond from motion/react
content = content.replace(/import \{ Diamond, motion \} from 'motion\/react';/g, "import { motion } from 'motion/react';");

// add Diamond to lucide-react
content = content.replace(/import \{ ChevronRight/g, "import { Diamond, ChevronRight");

fs.writeFileSync(file, content);
