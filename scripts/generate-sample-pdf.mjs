import exportMatrixPdf from '../lib/exportPdf.js';

// Small sample matrix matching expected shape
const sample = [
  {
    id: 'sample-section',
    title: { en: 'Sample Section', de: 'Beispiel' },
    items: [
      {
        id: 'sample-1',
        label: { en: 'Sample Item 1', de: 'Beispiel 1' },
        descriptions: { director: { en: 'Director description', de: 'Direktor Beschreibung' } },
        subline: { en: 'User comment EN', de: 'Benutzerkommentar DE' },
        statusByTitle: { director: 'normal', senior: 'neutral', intermediate: 'neutral', junior: 'neutral' }
      },
      {
        id: 'sample-2',
        label: { en: 'Sample Item 2', de: 'Beispiel 2' },
        descriptions: { director: { en: 'Another description', de: 'Andere Beschreibung' } },
        subline: { en: '', de: '' },
        statusByTitle: { director: 'bad', senior: 'neutral', intermediate: 'neutral', junior: 'neutral' }
      }
    ]
  }
];

(async function () {
  try {
    await exportMatrixPdf(sample, 'director', 'en');
    console.log('Sample PDF generated (should save to disk if run in a browser-like env).');
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
})();
