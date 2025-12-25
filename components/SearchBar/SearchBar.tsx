'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/components/SearchBar/SearchBar.module.scss';
import { useI18n } from '@/lib/i18n';

interface Props {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    const { t } = useI18n();
    const [local, setLocal] = useState(value);

    useEffect(() => setLocal(value), [value]);

    useEffect(() => {
        const id = setTimeout(() => {
            if (local !== value) onChange(local);
        }, 220);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local]);

    return (
        <div className={styles.search}>
            <input
                type="text"
                placeholder={placeholder ?? t('searchPlaceholder')}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
            />
        </div>
    );
}
