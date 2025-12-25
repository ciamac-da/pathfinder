import styles from './ConfirmModal.module.scss';
import { useI18n } from '@/lib/i18n';

export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
}: {
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}) {
    const { t } = useI18n();
    const confirmText = confirmLabel ?? t('exportAndReset');
    const cancelText = cancelLabel ?? t('cancelBtn');
    return (
        <div className={styles.overlay} role="dialog" aria-modal>
            <div className={styles.dialog}>
                {title ? <div className={styles.title}>{title}</div> : null}
                {message ? (
                    <div className={styles.message}>{message}</div>
                ) : null}
                <div className={styles.actions}>
                    <button className={styles.btn} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
