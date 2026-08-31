import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

if (!content.includes('useToast')) {
  content = content.replace(
    "import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react';",
    "import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react';\nimport { useToast } from '../../context/ToastContext';"
  );
  
  content = content.replace(
    "export default function AdminLogin() {",
    "export default function AdminLogin() {\n  const toast = useToast();"
  );
  
  content = content.replace(
    "setError('Please enter both email and password.');",
    "setError('Please enter both email and password.');\n      toast.warning('Please enter both email and password.');"
  );
  
  content = content.replace(
    "throw new Error(authError?.message || 'Invalid login credentials.');",
    "throw new Error(authError?.message || 'Invalid login credentials.');"
  );

  content = content.replace(
    "} catch (err: any) {",
    "} catch (err: any) {\n      toast.error(err.message || 'Login failed');"
  );
  
  content = content.replace(
    "navigate('/admin');",
    "toast.success('Login successful');\n        navigate('/admin');"
  );

  fs.writeFileSync('src/pages/admin/AdminLogin.tsx', content);
}
