'use client';

import React from 'react';
import { MatrixItem, Title } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import styles from './ItemRoleGrid.module.scss';
import { useI18n } from '@/lib/i18n';
import { localizeString, localizeToString } from '@/lib/localize';

const ORDER: Title[] = ['director', 'senior', 'intermediate', 'junior'];
const LABEL_KEY: Record<Title, string> = {
    director: 'directorLabel',
    senior: 'seniorLabel',
    intermediate: 'intermediateLabel',
    junior: 'juniorLabel',
};

export const ItemRoleGrid: React.FC<{
    item: MatrixItem;
    sectionId: string;
    onCycle: (sectionId: string, itemId: string, title: Title) => void;
}> = ({ item, sectionId, onCycle }) => {
    const { t, locale } = useI18n();

    const roles = ORDER.filter((role) => {
        const d = item.descriptions?.[role];
        return d !== null && d !== undefined && String(d).trim() !== '';
    });

    return (
        <div className={styles['role-grid']}>
            {roles.map((role) => (
                <div className={styles['role-cell']} key={role}>
                    <div className={styles['role-head']}>
                        <div className={styles.headInline}>
                            <strong>{t(LABEL_KEY[role])}</strong>
                            <StatusBadge
                                status={item.statusByTitle[role]}
                                onClick={() =>
                                    onCycle(sectionId, item.id, role)
                                }
                                hint={t('chooseDifferent')}
                            />
                        </div>
                    </div>

                    <div className={styles['role-body']}>
                        <div className={styles.shortTitle}>
                            {deriveShort(
                                localizeString(
                                    item.descriptions?.[role],
                                    locale
                                )
                            ) || localizeToString(item.label as string, locale)}
                        </div>
                        <div className={styles.description}>
                            {localizeString(
                                item.descriptions?.[role],
                                locale
                            ) ?? ''}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

function deriveShort(text?: string) {
    if (!text) return undefined;
    const s = text.trim();
    if (!s) return undefined;
    if (s.includes(':')) return s.split(':', 1)[0].trim();
    if (s.includes('.')) return s.split('.', 1)[0].trim();
    return s.slice(0, 80).trim();
}

export default ItemRoleGrid;
