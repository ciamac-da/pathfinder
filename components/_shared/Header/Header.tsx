'use client';

import React from 'react';
import styles from '@/components/_shared/Header/Header.module.scss';
import LangDropdown from '@/components/LangDropdown/LangDropdown';
import { useI18n } from '@/lib/i18n';

const Header: React.FC<{ title?: string }> = ({ title }) => {
    const { locale, setLocale, t } = useI18n();
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <h1 className={styles.title}>{title ?? t('title')}</h1>
                <div className={styles.langWrap}>
                    <LangDropdown
                        value={locale}
                        onChange={(v) => setLocale(v)}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
