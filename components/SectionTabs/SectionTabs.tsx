'use client';

import React from 'react';
import { MatrixSection } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import styles from '@/components/SectionTabs/SectionTabs.module.scss';

interface Props {
    sections: MatrixSection[];
    activeId: string;
    onChange: (id: string) => void;
}

export const SectionTabs: React.FC<Props> = ({
    sections,
    activeId,
    onChange,
}) => {
    const { locale } = useI18n();
    return (
        <div className={styles.tabs}>
            {sections.map((s, idx) => (
                <button
                    key={`${s.id}-${idx}`}
                    className={`${styles.tab} ${
                        activeId === s.id ? styles.active : ''
                    }`}
                    onClick={() => onChange(s.id)}
                >
                    {(() => {
                        const raw = s.title as
                            | Record<string, string>
                            | string
                            | undefined;
                        if (raw && typeof raw === 'object') {
                            const en = raw.en ?? '';
                            if (locale === 'en') {
                                return en && en.trim() !== ''
                                    ? String(en)
                                    : String(s.id);
                            }
                            return raw[locale] ?? en ?? String(s.id);
                        }
                        return String(raw ?? s.id);
                    })()}
                </button>
            ))}
            <button
                key="summary-tab"
                className={`${styles.tab} ${activeId === 'summary' ? styles.active : ''}`}
                onClick={() => onChange('summary')}
            >
                {locale === 'de' ? 'Zusammenfassung' : 'Summary'}
            </button>
        </div>
    );
};
