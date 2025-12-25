import { MatrixSection, Title, Status, MatrixItem } from '@/lib/types';

const STORAGE_KEY = 'pathfinder-matrix';

const DEFAULT_STATUS: Record<Title, Status> = {
    director: 'neutral',
    senior: 'neutral',
    intermediate: 'neutral',
    junior: 'neutral',
};

function normalizeStatus(s: unknown): Status {
    // Treat legacy 'normal' as 'neutral'
    if (s === 'normal') return 'neutral';
    if (s === 'bad' || s === 'good' || s === 'neutral' || s === 'normal')
        return s as Status;
    return 'neutral';
}

function normalizeItem(i: unknown): MatrixItem {
    // If the item already has the new shape, return it (but keep only expected fields)
    if (
        i &&
        typeof i === 'object' &&
        'statusByTitle' in i &&
        typeof (i as { statusByTitle?: unknown }).statusByTitle === 'object'
    ) {
        const item = i as {
            id?: unknown;
            label?: unknown;
            statusByTitle: Record<Title, Status>;
            descriptions?: unknown;
            subline?: unknown;
        };
        return {
            id: String(item.id ?? ''),
            label:
                typeof item.label === 'object' && item.label !== null
                    ? (item.label as unknown as string)
                    : String(item.label ?? ''),
            descriptions:
                typeof item.descriptions === 'object' &&
                item.descriptions !== null
                    ? (item.descriptions as Partial<Record<Title, string>>)
                    : undefined,
            subline:
                typeof item.subline === 'string'
                    ? item.subline
                    : typeof item.subline === 'object' && item.subline !== null
                    ? String(item.subline)
                    : undefined,
            statusByTitle: {
                director:
                    normalizeStatus(item.statusByTitle.director) ??
                    DEFAULT_STATUS.director,
                senior:
                    normalizeStatus(item.statusByTitle.senior) ??
                    DEFAULT_STATUS.senior,
                intermediate:
                    normalizeStatus(item.statusByTitle.intermediate) ??
                    DEFAULT_STATUS.intermediate,
                junior:
                    normalizeStatus(item.statusByTitle.junior) ??
                    DEFAULT_STATUS.junior,
            },
        };
    }

    // Old shape: had a single `status` property — migrate it to all titles
    const status: Status = normalizeStatus(
        typeof i === 'object' && i !== null && 'status' in i
            ? (i as { status?: Status }).status
            : undefined
    );

    return {
        id:
            typeof i === 'object' && i !== null && 'id' in i
                ? String((i as { id?: unknown }).id ?? '')
                : '',
        label:
            typeof i === 'object' && i !== null && 'label' in i
                ? typeof (i as { label?: unknown }).label === 'object'
                    ? String((i as { label?: unknown }).label)
                    : String((i as { label?: unknown }).label ?? '')
                : '',
        subline:
            typeof i === 'object' && i !== null && 'subline' in i
                ? typeof (i as { subline?: unknown }).subline === 'object' &&
                  (i as { subline?: unknown }).subline !== null
                    ? String((i as { subline?: unknown }).subline)
                    : String((i as { subline?: unknown }).subline ?? '')
                : undefined,
        // If older item had descriptions, preserve them when possible
        descriptions:
            typeof i === 'object' && i !== null && 'descriptions' in i
                ? ((i as { descriptions?: unknown }).descriptions as
                      | Partial<Record<Title, string>>
                      | undefined)
                : undefined,
        statusByTitle: {
            director: status,
            senior: status,
            intermediate: status,
            junior: status,
        },
    };
}

function normalizeSection(s: unknown): MatrixSection {
    return {
        id:
            typeof s === 'object' && s !== null && 'id' in s
                ? String((s as { id?: unknown }).id ?? '')
                : '',
        title:
            typeof s === 'object' && s !== null && 'title' in s
                ? typeof (s as { title?: unknown }).title === 'object' &&
                  (s as { title?: unknown }).title !== null
                    ? String((s as { title?: unknown }).title)
                    : String((s as { title?: unknown }).title ?? '')
                : '',
        items:
            typeof s === 'object' &&
            s !== null &&
            'items' in s &&
            Array.isArray((s as { items?: unknown }).items)
                ? ((s as { items?: unknown }).items as unknown[]).map(
                      normalizeItem
                  )
                : [],
    };
}

export function loadSections(): MatrixSection[] | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const normalized = parsed.map(normalizeSection);
        // Migration: if the parsed raw JSON used plain strings or mixed shapes,
        // ensure we save the normalized (localized) shape back to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch {
            // ignore write errors
        }
        return normalized;
    } catch {
        return null;
    }
}

export function saveSections(sections: MatrixSection[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

const SUMMARY_KEY = 'pathfinder-summary';

export function loadSummary(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SUMMARY_KEY);
}

export function saveSummary(text: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SUMMARY_KEY, text);
}
