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

const backupPath = dataPath + '.locale.bak.' + Date.now();
fs.writeFileSync(backupPath, raw, 'utf8');

function ensureLocalizedString(v) {
  if (v === undefined || v === null) return v;
  if (typeof v === 'string') return { en: v, de: v };
  // already localized object
  return v;
}

const transformed = data.map((section) => {
  const newSection = { ...section };
  newSection.title = ensureLocalizedString(section.title);
  if (Array.isArray(section.items)) {
    newSection.items = section.items.map((item) => {
      const newItem = { ...item };
      newItem.label = ensureLocalizedString(item.label);
      if (item.descriptions && typeof item.descriptions === 'object') {
        const d = {};
        for (const k of Object.keys(item.descriptions)) {
          d[k] = ensureLocalizedString(item.descriptions[k]);
        }
        newItem.descriptions = d;
      }
      return newItem;
    });
  }
  return newSection;
});

fs.writeFileSync(dataPath, JSON.stringify(transformed, null, 4) + '\n', 'utf8');

process.exit(0);
