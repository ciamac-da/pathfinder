'use client';

import React, { useState } from 'react';
import { MatrixItem, Title } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import styles from '@/components/ItemCard/ItemCard.module.scss';
import { useI18n } from '@/lib/i18n';
import { localizeToString } from '@/lib/localize';

type Props = {
    item: MatrixItem;
    sectionId: string;
    title: Title;
    onCycle: (sectionId: string, itemId: string, title: Title) => void;
    onSetDescription: (
        sectionId: string,
        itemId: string,
        title: Title,
        text: string
    ) => void;
    onSetSubline: (
        sectionId: string,
        itemId: string,
        text: string | Record<string, string>
    ) => void;
};

const Card: React.FC<Props> = ({
    item,
    sectionId,
    title,
    onCycle,
    onSetSubline,
}) => {
    const [editing, setEditing] = useState(false);
    const { locale, t } = useI18n();
    const initialSubline =
        localizeToString(
            item.subline as string | Record<string, string>,
            locale
        ) ?? '';
    const [text, setText] = useState(initialSubline);

    const label = (() => {
        const raw = item.label as string | Record<string, string> | undefined;
        if (raw && typeof raw === 'object') {
            const en = raw.en ?? '';
            if (locale === 'en')
                return en && en.trim() !== '' ? en : String(item.id);
            return raw[locale] ?? en ?? String(item.id);
        }
        return String(raw ?? item.id);
    })();

    const desc = (() => {
        const raw = item.descriptions?.[title] as
            | string
            | Record<string, string>
            | undefined;
        if (!raw) return '';
        if (typeof raw === 'string') return raw;
        if (typeof raw === 'object') {
            const en = raw.en ?? '';
            const de = raw.de ?? '';
            if (locale === 'en')
                return en && en.trim() !== '' && en !== de ? en : '';
            return raw[locale] ?? en ?? '';
        }
        return String(raw);
    })();

    function save() {
        // store subline as localized object when locale differs
        const newVal: Record<string, string> =
            item.subline && typeof item.subline === 'object'
                ? {
                      ...(item.subline as Record<string, string>),
                      [locale]: text.trim(),
                  }
                : { [locale]: text.trim() };
        onSetSubline(sectionId, item.id, newVal);
        setEditing(false);
    }

    return (
        <div className={styles.card} key={item.id}>
            <div className={styles.cardTitle}>{label}</div>
            <div className={styles.cardContent}>
                {desc ? (
                    <div style={{ marginTop: 6, color: '#666' }}>{desc}</div>
                ) : null}
                <div className={styles.cardActions}>
                    <StatusBadge
                        status={item.statusByTitle[title]}
                        onClick={() => onCycle(sectionId, item.id, title)}
                        hint={t('statusHint')}
                    />
                </div>

                <div>
                    {editing ? (
                        <div>
                            <textarea
                                className={styles.textArea}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('addInfoPlaceholder')}
                            />
                            <div className={styles.textAreaActions}>
                                <button
                                    className={styles.saveBtn}
                                    onClick={save}
                                >
                                    {t('saveBtn')}
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setEditing(false)}
                                >
                                    {t('cancelBtn')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button
                                className={styles.addInfoBtn}
                                onClick={() => setEditing(true)}
                            >
                                {t('addMoreInfo')}
                            </button>
                            {item.subline ? (
                                <div style={{ marginTop: 6, color: '#444' }}>
                                    {localizeToString(
                                        item.subline as
                                            | string
                                            | Record<string, string>,
                                        locale
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
