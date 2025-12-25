'use client';

import React from 'react';
import styles from '@/components/_shared/Footer/Footer.module.scss';
import { useI18n } from '@/lib/i18n';

export const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    const { t } = useI18n();
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <small className={styles.copy}>
                    {`${year} — © ${t('developedBy')}`}
                </small>
            </div>
        </footer>
    );
};

export default Footer;
