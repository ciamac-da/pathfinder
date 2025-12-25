import { MatrixSection } from '@/lib/types';

const defaultStatus = {
    director: 'normal',
    senior: 'normal',
    intermediate: 'normal',
    junior: 'normal',
} as const;

export const initialSections: MatrixSection[] = [
    {
        id: 'tooling',
        title: 'Tooling',
        items: [
            {
                id: 'git',
                label: 'Versionsverwaltung (Git)',
                statusByTitle: { ...defaultStatus },
                // Optional: wire exact text from the sheet per title later
                // descriptions: {
                //   director: '...',
                //   senior: '...',
                //   intermediate: '...',
                //   junior: '...',
                // },
            },
            {
                id: 'ide',
                label: 'Entwicklungsumgebung',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'build',
                label: 'Build Tools (Maven, Gradle, NPM, …)',
                statusByTitle: { ...defaultStatus },
            },
        ],
    },
    {
        id: 'programming',
        title: 'Programmierung',
        items: [
            {
                id: 'rules',
                label: 'Programmier-Regeln',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'docs',
                label: 'Dokumentation',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'metrics',
                label: 'Metriken (Wartbarkeit, Komplexität, …)',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'tests',
                label: 'Tests',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'security',
                label: 'Sicherheit',
                statusByTitle: { ...defaultStatus },
            },
            {
                id: 'resilience-code',
                label: 'Widerstandsfähigkeit (Code)',
                statusByTitle: { ...defaultStatus },
            },
        ],
    },
    // ... (architecture, operations, misc, intrapreneurship, culture, ownership, self-management, communication, client, people-leadership)
];
