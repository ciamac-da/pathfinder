'use client';
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Title } from '@/lib/types';
import styles from '@/components/TitleSelector/TitleSelector.module.scss';

const LABEL_KEY: Record<Title, string> = {
    director: 'directorLabel',
    senior: 'seniorLabel',
    intermediate: 'intermediateLabel',
    junior: 'juniorLabel',
};
const ORDER: Title[] = ['director', 'senior', 'intermediate', 'junior'];

export const TitleSelector: React.FC<{
    value: Title;
    onChange: (t: Title) => void;
}> = ({ value, onChange }) => (
    <TitleSelectorInner value={value} onChange={onChange} />
);

const TitleSelectorInner: React.FC<{
    value: Title;
    onChange: (t: Title) => void;
}> = ({ value, onChange }) => {
    const { t } = useI18n();
    return (
        <div className={styles.titleSelector}>
            {ORDER.map((tt) => (
                <button
                    key={tt}
                    className={`${styles.titlePill} ${
                        value === tt ? styles.active : ''
                    }`}
                    onClick={() => onChange(tt)}
                >
                    {t(LABEL_KEY[tt])}
                </button>
            ))}
        </div>
    );
};
