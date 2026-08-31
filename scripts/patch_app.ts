import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!content.includes('ToastProvider')) {
  content = content.replace(
    "import { AuthProvider, useAuth } from './context/AuthContext';",
    "import { AuthProvider, useAuth } from './context/AuthContext';\nimport { ToastProvider } from './context/ToastContext';"
  );
  
  // Wrap with ToastProvider
  content = content.replace(
    "<AuthProvider>",
    "<ToastProvider>\n    <AuthProvider>"
  );
  content = content.replace(
    "</AuthProvider>",
    "</AuthProvider>\n    </ToastProvider>"
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
