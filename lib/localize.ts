import { Locale } from './i18n';
import { LocalizedString } from './types';

export function localizeString(
    value: LocalizedString | undefined,
    locale: Locale
) {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    return value[locale] ?? value['en'] ?? undefined;
}

export function localizeMaybe(
    value: LocalizedString | undefined,
    locale: Locale
) {
    return localizeString(value, locale);
}

// Always return a string safe for rendering (never an object)
export function localizeToString(
    value: LocalizedString | undefined,
    locale: Locale
) {
    const v = localizeString(value, locale);
    if (v !== undefined && v !== null) return String(v);
    if (value && typeof value === 'object') {
        try {
            const valObj = value as Record<string, unknown>;
            if (valObj.en) return String(valObj.en);
            if (valObj[locale]) return String(valObj[locale]);
        } catch {
        }
    }
    return '';
}

export default localizeString;
