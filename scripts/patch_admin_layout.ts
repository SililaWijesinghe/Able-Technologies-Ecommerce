import fs from 'fs';
let content = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

if (!content.includes('NavigatedGuide')) {
  content = content.replace(
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';",
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';\nimport NavigatedGuide from '../ui/NavigatedGuide';"
  );
  
  const guideSteps = `
      <NavigatedGuide 
        guideId="admin_tour"
        steps={[
          { targetId: 'admin-add-product', title: 'Add New Products', description: 'Easily add new inventory to your store from here.', position: 'bottom' },
        ]}
      />
  `;
  
  content = content.replace(
    '<Link to="/admin/products/new"',
    '<Link id="admin-add-product" to="/admin/products/new"'
  );

  content = content.replace(
    "</main>\n    </div>",
    `</main>\n      ${guideSteps}\n    </div>`
  );

  fs.writeFileSync('src/components/layout/AdminLayout.tsx', content);
}
