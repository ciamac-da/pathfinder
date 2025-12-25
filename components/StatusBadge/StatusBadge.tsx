'use client';

import React from 'react';
import { Status } from '@/lib/types';
import styles from './StatusBadge.module.scss';

export const STATUS_LABEL: Record<Status, string> = {
    normal: 'Normal',
    bad: 'Bad',
    good: 'Good',
    neutral: 'Neutral',
};

export function nextStatus(s: Status): Status {
    return s === 'normal'
        ? 'bad'
        : s === 'bad'
        ? 'good'
        : s === 'good'
        ? 'neutral'
        : 'normal';
}

export const StatusBadge: React.FC<{
    status: Status;
    onClick?: () => void;
    hint?: string;
}> = ({ status, onClick, hint }) => {
    return (
        <span className={styles.container}>
            <button
                onClick={onClick}
                className={`${styles.button} ${styles[status]}`}
                aria-label={`Status: ${STATUS_LABEL[status]}`}
                title={`Click to cycle status (Normal → Bad → Good → Neutral)`}
            >
                {STATUS_LABEL[status]}
            </button>
            {hint ? <span className={styles.hint}>{hint}</span> : null}
        </span>
    );
};

export const StatusSelect: React.FC<{
    value?: Status | '';
    onChange: (v: Status | '') => void;
}> = ({ value = '', onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => {
                const v = e.target.value as Status | '';
                onChange(v);
            }}
            className={styles.select}
            aria-label="Status select"
        >
            <option value="">Select</option>
            <option value="neutral">Neutral</option>
            <option value="good">Good</option>
            <option value="normal">Normal</option>
            <option value="bad">Bad</option>
        </select>
    );
};
