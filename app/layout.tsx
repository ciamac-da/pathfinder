import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
    title: 'Pathfinder Matrix Dashboard',
    description: 'Toggle RAG status for Software Engineering matrix items',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <I18nProvider initial="en">{children}</I18nProvider>
            </body>
        </html>
    );
}
