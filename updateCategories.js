const fs = require('fs');
let file = 'src/pages/admin/Categories.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const \[editForm, setEditForm\] = useState\(\{ id: '', name: '', description: '', slug: '', icon_url: '' \}\);/g,
  "const [editForm, setEditForm] = useState({ id: '', name: '', description: '', slug: '', icon_url: '', parent_id: '' });"
);

content = content.replace(
  /const \[addForm, setAddForm\] = useState\(\{ name: '', description: '', slug: '', icon_url: '' \}\);/g,
  "const [addForm, setAddForm] = useState({ name: '', description: '', slug: '', icon_url: '', parent_id: '' });"
);

content = content.replace(
  /setAddForm\(\{ name: '', description: '', slug: '', icon_url: '' \}\);/g,
  "setAddForm({ name: '', description: '', slug: '', icon_url: '', parent_id: '' });"
);

// We need to inject the parent_id dropdown in both add modal and edit modal.
const parentDropdownAdd = `
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Parent Category</label>
                 <select 
                    value={addForm.parent_id || ''} 
                    onChange={(e) => setAddForm({ ...addForm, parent_id: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm font-medium"
                 >
                   <option value="">-- None (Top Level) --</option>
                   {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                 </select>
               </div>
`;

const parentDropdownEdit = `
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Parent Category</label>
                 <select 
                    value={editForm.parent_id || ''} 
                    onChange={(e) => setEditForm({ ...editForm, parent_id: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm font-medium"
                 >
                   <option value="">-- None (Top Level) --</option>
                   {categories.filter(c => c.id !== editForm.id).map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                 </select>
               </div>
`;

content = content.replace(
  /<div>\s*<label className="block mb-1 text-sm font-semibold text-gray-700">Description<\/label>/g,
  (match) => parentDropdownAdd + '\n               ' + match
);

fs.writeFileSync(file, content);
