import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const DATA_PATH = path.resolve(__dirname, '..', 'public', 'data.json');

function backup(filePath) {
  const dest = `${filePath}.bak.${Date.now()}`;
  fs.copyFileSync(filePath, dest);
}

function ensureLocalized(val) {
  if (val === undefined || val === null) return { en: '', de: '' };
  if (typeof val === 'string') return { en: val, de: val };
  if (typeof val === 'object') return { en: val.en ?? '', de: val.de ?? '' };
  return { en: String(val), de: String(val) };
}

async function translateText(text, apiKey) {
  if (!text || text.trim() === '') return '';
  const url = `https://api-free.deepl.com/v2/translate`;
  const params = new URLSearchParams();
  params.append('auth_key', apiKey);
  params.append('text', text);
  params.append('source_lang', 'DE');
  params.append('target_lang', 'EN-US');
  try {
    const res = await fetch(url, { method: 'POST', body: params });
    const json = await res.json();
    if (json && json.translations && json.translations[0] && json.translations[0].text) {
      return json.translations[0].text;
    }
    console.error('Unexpected DeepL response', json);
    return '';
  } catch (err) {
    console.error('Translate error', err.message || err);
    return '';
  }
}

async function main() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error('Missing DEEPL_API_KEY environment variable.');
    process.exit(2);
  }

  if (!fs.existsSync(DATA_PATH)) {
    console.error('public/data.json not found');
    process.exit(1);
  }

  backup(DATA_PATH);
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);

  for (const section of data) {
    section.title = ensureLocalized(section.title);
    for (const item of section.items || []) {
      item.label = ensureLocalized(item.label);
      if (!item.descriptions) item.descriptions = {};
      for (const role of ['director','senior','intermediate','junior']) {
        const cur = ensureLocalized(item.descriptions[role]);
        if (!cur.en || String(cur.en).trim() === '' || cur.en === cur.de) {
          const textToTranslate = cur.de || '';
          if (textToTranslate && textToTranslate.trim() !== '') {
            process.stdout.write(`Translating [${section.id}] ${item.id} ${role}... `);
            const out = await translateText(textToTranslate, apiKey);
            item.descriptions[role] = { en: out || textToTranslate, de: cur.de };
          } else {
            item.descriptions[role] = { en: '', de: cur.de || '' };
          }
          await new Promise((r) => setTimeout(r, 300));
        } else {
          item.descriptions[role] = cur;
        }
      }
      if (item.subline && typeof item.subline === 'string') {
        if (!item.subline_en) {
          process.stdout.write(`Translating subline [${section.id}] ${item.id}... `);
          const out = await translateText(item.subline, apiKey);
          item.subline_en = out || item.subline;
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
