'use client';

import React from 'react';
import styles from '@/components/_shared/NotFound/NotFound.module.scss';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export const NotFound: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('notFoundTitle')}</h1>
            <p className={styles.message}>{t('notFoundMessage')}</p>
            <Link className={styles.home} href="/">
                {t('goHome')}
            </Link>
        </div>
    );
};

export default NotFound;
