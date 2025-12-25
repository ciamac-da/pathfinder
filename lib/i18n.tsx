'use client';

import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en' | 'de';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
    en: {
        title: 'Pathfinder',
        loading: 'Loading…',
        exporting: 'Exporting…',
        exportAndReset: 'Export & Reset',
        confirmReset:
            'Export complete. Do you want to reset all answers to defaults? This cannot be undone.',
        searchPlaceholder: 'Search items…',
        exportPdf: 'Export PDF',
        selectTitle: 'Select title',
        addMoreInfo: 'Add more info',
        saveBtn: 'Save',
        cancelBtn: 'Cancel',
        addInfoPlaceholder: 'Add a comment here...',
        statusHint: 'Click to cycle status',
        directorLabel: 'Director',
        seniorLabel: 'Senior',
        intermediateLabel: 'Intermediate',
        juniorLabel: 'Junior',
        chooseDifferent: 'choose a different one',
        developedBy: 'Developed by Ciamac Davoudi (Dipl.-Ing.)',
        notFoundTitle: 'Page not found',
        notFoundMessage: 'Sorry, the page you requested does not exist.',
        goHome: 'Go to homepage',
        resetAll: 'Reset All',
        confirmResetAll: 'Are you sure you want to reset all answers to defaults? This cannot be undone.',
        confirmExportAndReset: 'Export complete. Do you want to reset all answers to defaults now? This will export the current data and then reset answers. This cannot be undone.',
        summaryTab: 'Summary',
        summaryPlaceholder: 'Add a summary or longer comment here...',
        yes: 'Yes',
        no: 'No',
    },
    de: {
        title: 'Pathfinder',
        loading: 'Lädt…',
        exporting: 'Exportiert…',
        exportAndReset: 'Exportieren & Zurücksetzen',
        confirmReset:
            'Export abgeschlossen. Möchtest du alle Antworten auf die Standardwerte zurücksetzen? Dies kann nicht rückgängig gemacht werden.',
        searchPlaceholder: 'Elemente durchsuchen…',
        exportPdf: 'PDF exportieren',
        selectTitle: 'Titel auswählen',
        addMoreInfo: 'Mehr Informationen hinzufügen',
        saveBtn: 'Speichern',
        cancelBtn: 'Abbrechen',
        addInfoPlaceholder: 'Füge hier einen Kommentar hinzu...',
        statusHint: 'Klicke hier, um einen Status auszuwählen',
        directorLabel: 'Direktor',
        seniorLabel: 'Senior',
        intermediateLabel: 'Intermediate',
        juniorLabel: 'Junior',
        chooseDifferent: 'anders wählen',
        developedBy: 'Entwickelt von Ciamac Davoudi (Dipl.-Ing.)',
        notFoundTitle: 'Seite nicht gefunden',
        notFoundMessage: 'Entschuldigung, die angeforderte Seite existiert nicht.',
        goHome: 'Zur Startseite',
        resetAll: 'Alle zurücksetzen',
        confirmResetAll: 'Möchtest du wirklich alle Antworten auf die Standardwerte zurücksetzen? Dies kann nicht rückgängig gemacht werden.',
        confirmExportAndReset: 'Export abgeschlossen. Möchtest du jetzt alle Antworten auf die Standardwerte zurücksetzen? Dies exportiert die aktuellen Daten und setzt dann die Antworten zurück. Dies kann nicht rückgängig gemacht werden.',
        summaryTab: 'Zusammenfassung',
        summaryPlaceholder: 'Füge hier eine Zusammenfassung oder einen längeren Kommentar ein...',
        yes: 'Ja',
        no: 'Nein',
    },
};

const I18nContext = createContext<{
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (k: string) => string;
}>({
    locale: 'en',
    setLocale: () => {},
    t: (k: string) => k,
});

export const I18nProvider: React.FC<{
    initial?: Locale;
    children?: React.ReactNode;
}> = ({ initial = 'en', children }) => {
    const [locale, setLocale] = useState<Locale>(initial);
    const t = (k: string) =>
        TRANSLATIONS[locale][k] ?? TRANSLATIONS['en'][k] ?? k;
    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export function useI18n() {
    return useContext(I18nContext);
}
