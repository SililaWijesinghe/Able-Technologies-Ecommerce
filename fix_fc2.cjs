const fs = require('fs');
let text = fs.readFileSync('src/components/FloatingControls.tsx', 'utf8');
text = text.replace(/<Link to="\/" className="flex flex-col items-center p-2 metallic-red-text">([\s\S]*?)<\/a>/g, '<Link to="/" className="flex flex-col items-center p-2 metallic-red-text">$1</Link>');
text = text.replace("import { MessageCircle", "import { Link } from 'react-router-dom';\nimport { MessageCircle");
fs.writeFileSync('src/components/FloatingControls.tsx', text);
