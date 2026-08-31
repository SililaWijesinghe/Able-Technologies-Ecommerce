const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  "import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';",
  "import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';"
);
content = content.replace(
  "function StorefrontLayout() {",
  "function StorefrontLayout() {\n  const location = useLocation();\n  const isHome = location.pathname === '/';\n"
);
content = content.replace(
  "<Outlet />",
  "<main className={!isHome ? 'pt-[220px] bg-[#04081c]' : ''}>\n        <Outlet />\n      </main>"
);
fs.writeFileSync('src/App.tsx', content);
