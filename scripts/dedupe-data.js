import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, '..', 'public', 'data.json');
if (!fs.existsSync(dataPath)) {
  console.error('public/data.json not found');
  process.exit(1);
}

const raw = fs.readFileSync(dataPath, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse public/data.json:', e.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('Expected an array at the top level of public/data.json');
  process.exit(1);
}

// Backup
const backupPath = dataPath + '.bak.' + Date.now();
fs.writeFileSync(backupPath, raw, 'utf8');

const seen = Object.create(null);
const deduped = data.map((section) => {
  const base = String(section.id ?? '');
  const count = (seen[base] = (seen[base] || 0) + 1);
  if (count === 1) return { ...section, id: base };
  const newId = `${base}-${count}`;
  return { ...section, id: newId };
});

fs.writeFileSync(dataPath, JSON.stringify(deduped, null, 4) + '\n', 'utf8');

const duplicates = Object.keys(seen).filter((k) => seen[k] > 1);
if (duplicates.length) {
  console.error('Found duplicate section ids and renamed them:', duplicates);
}

process.exit(0);
