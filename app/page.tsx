'use client';

import { useEffect, useMemo, useState } from 'react';
import { MatrixSection, Title } from '@/lib/types';
import { SectionTabs } from '@/components/SectionTabs/SectionTabs';
import { nextStatus } from '@/components/StatusBadge/StatusBadge';
import { TitleSelector } from '@/components/TitleSelector/TitleSelector';
import ItemCard from '@/components/ItemCard/ItemCard';
import Header from '@/components/_shared/Header/Header';
import Footer from '@/components/_shared/Footer/Footer';
import {
    loadSections,
    saveSections,
    loadSummary,
    saveSummary,
} from '@/utils/storage';
import '../styles/globals.scss';
import { useI18n } from '@/lib/i18n';
import { localizeToString } from '@/lib/localize';
import SearchBar from '@/components/SearchBar/SearchBar';
import ExportPdfButton from '@/components/ExportPdf/ExportPdfButton';
import Spinner from '@/components/_shared/Spinner/Spinner';
import styles from './Page.module.scss';

export default function Page() {
    // State: don't read localStorage during render (avoid hydration mismatch)
    const [sections, setSections] = useState<MatrixSection[] | null>(null);
    const [active, setActive] = useState<string>('');
    const [query, setQuery] = useState('');
    const [title, setTitle] = useState<Title>('senior');
    const [summary, setSummary] = useState<string>('');
    const [ showLoading, setShowLoading ] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setShowLoading(false), 1000);
        return () => clearTimeout(timer);
    }   , []);
    // First load: attempt to bootstrap from localStorage in an effect (client-only).
    useEffect(() => {
        const s = loadSummary();
        if (s) setSummary(s);

        const fromStorage = loadSections();
        if (fromStorage && fromStorage.length > 0) {
            // If any persisted values look like a stringified object (for
            // example "[object Object]") we backfill titles, item labels
            // and descriptions from the canonical `/data.json` file.
            const looksLikeObjectString = (v: unknown) =>
                typeof v === 'string' && String(v).trim().startsWith('[object');

            const needsBackfill = fromStorage.some(
                (s) =>
                    looksLikeObjectString(s.title) ||
                    s.items.some(
                        (it) =>
                            looksLikeObjectString(it.label) ||
                            (!!it.descriptions &&
                                (Object.values(it.descriptions).some(
                                    looksLikeObjectString
                                ) as boolean))
                    )
            );

            if (!needsBackfill) {
                setSections(fromStorage);
                setActive(fromStorage[0]?.id ?? '');
                return;
            }

            fetch('/data.json')
                .then((r) => (r.ok ? r.json() : Promise.reject()))
                .then((data: MatrixSection[]) => {
                    const fixed = fromStorage.map((s) => {
                        const sourceSection = data.find((d) => d.id === s.id);
                        const fixedItems = s.items.map((it) => {
                            const srcItem = sourceSection?.items.find(
                                (si) => si.id === it.id
                            );
                            const fixedLabel = looksLikeObjectString(it.label)
                                ? localizeToString(
                                      srcItem?.label ?? it.label,
                                      locale
                                  )
                                : localizeToString(it.label, locale);
                            const fixedDescriptions = (it.descriptions ??
                                {}) as Record<Title, string>;
                            if (srcItem && srcItem.descriptions) {
                                (
                                    Object.keys(fixedDescriptions) as Title[]
                                ).forEach((k) => {
                                    if (
                                        looksLikeObjectString(
                                            fixedDescriptions[k]
                                        )
                                    ) {
                                        fixedDescriptions[k] = localizeToString(
                                            srcItem.descriptions?.[k] ??
                                                fixedDescriptions[k],
                                            locale
                                        );
                                    }
                                });
                            }
                            return {
                                ...it,
                                label: fixedLabel,
                                descriptions: fixedDescriptions,
                            };
                        });

                        const fixedTitle = looksLikeObjectString(s.title)
                            ? sourceSection?.title ?? s.title
                            : s.title;

                        return { ...s, title: fixedTitle, items: fixedItems };
                    });

                    setSections(fixed);
                    setActive(fixed[0]?.id ?? '');
                    try {
                        saveSections(fixed);
                    } catch {
                        // ignore write errors
                    }
                })
                .catch(() => {
                    // If we couldn't fetch replacement data, fall back to stored
                    setSections(fromStorage);
                    setActive(fromStorage[0]?.id ?? '');
                });
            return;
        }

        fetch('/data.json')
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data: MatrixSection[]) => {
                setSections(data);
                setActive(data[0]?.id ?? '');
                saveSections(data);
            })
            .catch(() => setSections([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist on change
    useEffect(() => {
        if (sections) saveSections(sections);
        try {
            saveSummary(summary);
        } catch {
            // ignore
        }
    }, [sections, summary]);

    const activeSection =
        sections && sections.length > 0
            ? sections.find((s) => s.id === active) ?? sections[0]
            : undefined;

    const { t, locale } = useI18n();

    const filteredItems = useMemo(() => {
        if (!activeSection) return [];
        const q = query.trim().toLowerCase();
        const base = !q
            ? activeSection.items
            : activeSection.items.filter((i) =>
                  (localizeToString(i.label as string, locale) ?? '')
                      .toLowerCase()
                      .includes(q)
              );

        // Filter out items that don't have a description for the currently
        // selected role (title). If descriptions[title] is null/undefined/empty
        // we hide the card for that role.
        return base.filter((i) => {
            const d = i.descriptions?.[title];
            return d !== null && d !== undefined && String(d).trim() !== '';
        });
    }, [activeSection, query, title, locale]);

    if (showLoading || !sections || !sections.length) {
        return <Spinner />
    }

    // Cycle status for selected role
    function cycleStatus(sectionId: string, itemId: string, t: Title) {
        setSections((prev) =>
            prev!.map((s) =>
                s.id === sectionId
                    ? {
                          ...s,
                          items: s.items.map((i) =>
                              i.id === itemId
                                  ? {
                                        ...i,
                                        statusByTitle: {
                                            ...i.statusByTitle,
                                            [t]: nextStatus(i.statusByTitle[t]),
                                        },
                                    }
                                  : i
                          ),
                      }
                    : s
            )
        );
    }
    // Set per-title description (why we selected this status)
    function setDescription(
        sectionId: string,
        itemId: string,
        t: Title,
        text: string
    ) {
        setSections((prev) =>
            prev!.map((s) =>
                s.id === sectionId
                    ? {
                          ...s,
                          items: s.items.map((i) =>
                              i.id === itemId
                                  ? {
                                        ...i,
                                        descriptions: {
                                            ...(i.descriptions ?? {}),
                                            [t]: text,
                                        },
                                    }
                                  : i
                          ),
                      }
                    : s
            )
        );
    }

    // Set item's subline (additional freeform info stored on the item)
    function setSubline(
        sectionId: string,
        itemId: string,
        text: string | Record<string, string>
    ) {
        setSections((prev) =>
            prev!.map((s) =>
                s.id === sectionId
                    ? {
                          ...s,
                          items: s.items.map((i) =>
                              i.id === itemId ? { ...i, subline: text } : i
                          ),
                      }
                    : s
            )
        );
    }

    return (
        <>
            <main className="page-with-fixed-header">
                <Header />

                <div className={styles.firstContainer}>
                    <TitleSelector value={title} onChange={setTitle} />
                    <ExportPdfButton
                        sections={sections}
                        title={title}
                        locale={locale}
                        summary={summary}
                        onAfterExport={async () => {
                            // reload canonical data.json and replace current sections
                            try {
                                const r = await fetch('/data.json');
                                if (!r.ok) throw new Error('fetch failed');
                                const data: MatrixSection[] = await r.json();
                                setSections(data);
                                setActive(data[0]?.id ?? '');
                                try {
                                    saveSections(data);
                                } catch {
                                    // ignore write errors
                                }
                            } catch {
                                // ignore errors — don't disrupt user
                            }
                        }}
                        onResetAll={async () => {
                            try {
                                const r = await fetch('/data.json');
                                if (!r.ok) throw new Error('fetch failed');
                                const data: MatrixSection[] = await r.json();
                                setSections(data);
                                setActive(data[0]?.id ?? '');
                                try {
                                    saveSections(data);
                                } catch {
                                    // ignore write errors
                                }
                            } catch {
                                // ignore errors — don't disrupt user
                            }
                        }}
                    />
                </div>

                <div className="topbar">
                    <SectionTabs
                        sections={sections}
                        activeId={active}
                        onChange={setActive}
                    />
                    <SearchBar value={query} onChange={setQuery} />
                </div>

                {active === 'summary' ? (
                    <div style={{ padding: 16 }}>
                        <textarea
                            className={styles.summaryBox}
                            value={summary}
                            placeholder={t('summaryPlaceholder')}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="grid">
                        {filteredItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                sectionId={activeSection!.id}
                                title={title}
                                onCycle={cycleStatus}
                                onSetDescription={setDescription}
                                onSetSubline={setSubline}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
