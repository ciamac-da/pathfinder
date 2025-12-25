import fs from 'fs';
import path from 'path';

const DATA = path.resolve(__dirname, '..', 'public', 'data.json');
if (!fs.existsSync(DATA)) {
  console.error('public/data.json not found');
  process.exit(1);
}

const raw = fs.readFileSync(DATA, 'utf8');
const parsed = JSON.parse(raw);
const bak = `${DATA}.bak.${Date.now()}`;
fs.copyFileSync(DATA, bak);

let changed = 0;
for (const section of parsed) {
  if (section.title && typeof section.title === 'object') {
    if (!section.title.en || section.title.en === '') {
      section.title.en = section.title.de || '';
      changed++;
    }
  } else if (typeof section.title === 'string') {
    section.title = { en: section.title, de: section.title };
    changed++;
  }
  for (const item of section.items || []) {
    if (item.label && typeof item.label === 'object') {
      if (!item.label.en || item.label.en === '') {
        item.label.en = item.label.de || '';
        changed++;
      }
    } else if (typeof item.label === 'string') {
      item.label = { en: item.label, de: item.label };
      changed++;
    }

    if (!item.descriptions) item.descriptions = {};
    for (const role of ['director','senior','intermediate','junior']) {
      const d = item.descriptions[role];
      if (d && typeof d === 'object') {
        if (!d.en || d.en === '') {
          d.en = d.de || '';
          changed++;
        }
      } else if (typeof d === 'string') {
        item.descriptions[role] = { en: d, de: d };
        changed++;
      } else {
      }
    }
  }
}

if (changed > 0) {
  fs.writeFileSync(DATA, JSON.stringify(parsed, null, 2), 'utf8');
  console.info(`Updated ${changed} fields in public/data.json`);
} 
