// lib/types.ts
import type { Locale } from './i18n';

export type Status = 'normal' | 'bad' | 'good' | 'neutral';
export type Title = 'director' | 'senior' | 'intermediate' | 'junior';

export type LocalizedString = string | Partial<Record<Locale, string>>;

export interface MatrixItem {
    id: string;
    label: LocalizedString; // short name for the row (derived from Excel)
    subline?: LocalizedString; // optional longer description (localized)
    statusByTitle: Record<Title, Status>; // RAG per role
    descriptions?: Partial<Record<Title, LocalizedString>>;
}

export interface MatrixSection {
    id: string; // e.g., 'client', 'tooling'
    title: LocalizedString; // e.g., 'Client Management' (localized)
    items: MatrixItem[];
}
