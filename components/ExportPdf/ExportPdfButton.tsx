'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import styles from '@/components/ExportPdf/ExportPdfButton.module.scss';
import exportMatrixPdf from '@/lib/exportPdf';
import { MatrixSection, Title } from '@/lib/types';
import { useI18n, Locale } from '@/lib/i18n';

interface Props {
    sections: MatrixSection[];
    title: Title;
    locale: Locale;
    onAfterExport?: () => void;
    onResetAll?: () => void;
    summary?: string;
}

export default function ExportPdfButton({
    sections,
    title,
    locale,
    onAfterExport,
    onResetAll,
    summary,
}: Props) {
    const [loading, setLoading] = useState(false);
    const { t } = useI18n();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showExportResetConfirm, setShowExportResetConfirm] = useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            await exportMatrixPdf(sections, title, locale, summary);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <button
                className={styles.export}
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? t('exporting') : t('exportPdf')}
            </button>
            <button
                className={styles.export}
                onClick={() => setShowExportResetConfirm(true)}
                disabled={loading}
            >
                {t('exportAndReset')}
            </button>
            <button
                className={styles.export}
                onClick={() => setShowResetConfirm(true)}
                disabled={loading}
            >
                {t('resetAll') ?? 'Reset All'}
            </button>
            {showExportResetConfirm ? (
                <ConfirmModal
                    title={t('exportAndReset')}
                    message={t('confirmExportAndReset') ?? t('confirmReset')}
                    cancelLabel={t('no')}
                    confirmLabel={t('yes')}
                    onCancel={() => setShowExportResetConfirm(false)}
                    onConfirm={async () => {
                        setShowExportResetConfirm(false);
                        setLoading(true);
                        try {
                            await exportMatrixPdf(
                                sections,
                                title,
                                locale,
                                summary
                            );
                            try {
                                onAfterExport?.();
                            } catch {}
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            ) : null}
            {showResetConfirm ? (
                <ConfirmModal
                    title={t('resetAll') ?? 'Reset All'}
                    message={
                        t('confirmResetAll') ??
                        'Are you sure you want to reset all answers to defaults? This cannot be undone.'
                    }
                    cancelLabel={t('no')}
                    confirmLabel={t('yes')}
                    onCancel={() => setShowResetConfirm(false)}
                    onConfirm={() => {
                        setShowResetConfirm(false);
                        try {
                            onResetAll?.();
                        } catch {
                            /* swallow */
                        }
                    }}
                />
            ) : null}
        </div>
    );
}
