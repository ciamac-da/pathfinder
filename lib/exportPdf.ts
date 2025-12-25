import { MatrixSection, Title } from './types';
import { localizeString, localizeToString } from './localize';

type Locale = 'en' | 'de';

export async function exportMatrixPdf(
    sections: MatrixSection[],
    title: Title,
    locale: Locale,
    summary?: string
) {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const now = new Date();

    const roleLabel = {
        director: 'Director',
        senior: 'Senior',
        intermediate: 'Intermediate',
        junior: 'Junior',
    }[title];

    doc.setFontSize(14);
    doc.text(`Software Engineering Matrix — ${roleLabel}`, 40, 40);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Exported: ${now.toLocaleString()}`, 40, 58);
    doc.setTextColor(0);

    const STATUS_LABEL: Record<string, string> =
        locale === 'de'
            ? {
                  normal: 'Normal',
                  bad: 'Schlecht',
                  good: 'Gut',
                  neutral: 'Neutral',
              }
            : {
                  normal: 'Normal',
                  bad: 'Bad',
                  good: 'Good',
                  neutral: 'Neutral',
              };
    const STATUS_COLOR: Record<string, [number, number, number]> = {
        normal: [250, 173, 20],
        bad: [255, 77, 79],
        good: [82, 196, 26],
        neutral: [255, 255, 255],
    };

    // Reverse lookup from localized label back to status key (handles i18n)
    const STATUS_LABEL_TO_KEY: Record<string, string> = Object.entries(
        STATUS_LABEL
    ).reduce((acc, [k, v]) => {
        acc[v] = k;
        return acc;
    }, {} as Record<string, string>);

    const headItem = locale === 'de' ? 'Item' : 'Item';
    const headStatus = locale === 'de' ? 'Status' : 'Status';
    const headCopy = locale === 'de' ? 'Beschreibung' : 'Description';

    // Render each section on its own page with a per-section table
    sections.forEach((section, idx) => {
        if (idx > 0) doc.addPage();

        // Section title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(
            String(localizeToString(section.title as string, locale)),
            40,
            80
        );
        doc.setFont('helvetica', 'normal');

        const rows: (
            | string
            | { content: string; colSpan?: number; styles?: object }
        )[][] = [];

        for (const item of section.items) {
            const status = item.statusByTitle[title];
            const descr =
                localizeString(
                    item.descriptions?.[title] as string | undefined,
                    locale
                ) ?? '';
            const subline =
                localizeToString(item.subline as string | undefined, locale) ??
                '';
            const merged = [descr, subline].filter(Boolean).join('\n\n');
            rows.push([
                localizeToString(item.label as string, locale),
                STATUS_LABEL[status],
                { content: '', styles: { halign: 'center' } },
                merged,
            ]);
        }

        // Try to fit the whole section on one page by adjusting font size and padding.
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const topY = 100; // where table starts
        const bottomMargin = 40;
        const availableHeight = pageHeight - topY - bottomMargin;

        // Column widths (pts) — 0:150, 1:70, 2:20, 3:auto
        const leftRightMargin = 40 * 2;
        const fixedWidths = 150 + 70 + 20;
        const autoWidth = Math.max(
            50,
            pageWidth - leftRightMargin - fixedWidths
        );

        const estimateLines = (
            text: string,
            colWidth: number,
            fontSize: number
        ) => {
            if (!text) return 0;
            const avgCharWidth = fontSize * 0.5; // rough
            const charsPerLine = Math.max(
                10,
                Math.floor(colWidth / avgCharWidth)
            );
            const lines = text.split('\n').reduce((sum, line) => {
                return sum + Math.max(1, Math.ceil(line.length / charsPerLine));
            }, 0);
            return lines;
        };

        const fontCandidates = [10, 9, 8, 7, 6];
        const paddingFor = (f: number) =>
            f >= 9 ? 6 : f === 8 ? 5 : f === 7 ? 4 : 3;

        let chosenFont = 9;
        let chosenPadding = 6;
        let fitsOnOnePage = false;

        for (const f of fontCandidates) {
            const pad = paddingFor(f);
            const lineHeight = f * 1.15;
            // head row estimate
            const headHeight = lineHeight + pad * 2;
            let total = headHeight;
            for (const item of section.items) {
                const label =
                    localizeToString(item.label as string, locale) || '';
                const descr =
                    localizeString(
                        item.descriptions?.[title] as string | undefined,
                        locale
                    ) || '';
                const subline =
                    localizeToString(
                        item.subline as string | undefined,
                        locale
                    ) || '';
                const merged = [descr, subline].filter(Boolean).join('\n\n');
                const labelLines = Math.max(1, estimateLines(label, 150, f));
                const descrLines = Math.max(
                    1,
                    estimateLines(merged, autoWidth, f)
                );
                const rowsLines = Math.max(labelLines, 1) + descrLines; // conservative
                const rowHeight = rowsLines * lineHeight + pad * 2;
                total += rowHeight;
                if (total > availableHeight) break;
            }
            if (total <= availableHeight) {
                chosenFont = f;
                chosenPadding = pad;
                fitsOnOnePage = true;
                break;
            }
        }

        const tableOpts: Record<string, unknown> = {
            startY: topY,
            head: [[headItem, headStatus, '', headCopy]],
            body: rows,
            styles: {
                fontSize: chosenFont,
                cellPadding: chosenPadding,
                valign: 'top',
            },
            columnStyles: {
                0: { cellWidth: 150 },
                1: { cellWidth: 70 },
                2: { cellWidth: 20 },
                3: { cellWidth: 'auto' },
            },
            didDrawCell: (data: import('jspdf-autotable').CellHookData) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const statusText = (
                        data.row.raw as (
                            | string
                            | { content: string; styles?: unknown }
                        )[]
                    )[1] as string;
                    const statusKey =
                        STATUS_LABEL_TO_KEY[statusText] ?? 'normal';
                    const [r, g, b] =
                        STATUS_COLOR[statusKey] ?? STATUS_COLOR.normal;
                    const { x, y } = data.cell;
                    const cx = x + data.cell.width / 2;
                    const cy = y + data.cell.height / 2;
                    doc.setFillColor(r, g, b);
                    doc.setDrawColor(0, 0, 0);
                    doc.setLineWidth(1);
                    doc.circle(cx, cy, 4, 'FD');
                }
            },
            headStyles: { fillColor: [230, 230, 230] },
        };

        if (fitsOnOnePage) {
            tableOpts.pageBreak = 'avoid';
        } else {
            tableOpts.pageBreak = 'auto';
        }

        autoTable(doc, tableOpts);
    });

    // Sanitize filename parts
    const safe = (s: string) => s.replace(/[^a-zA-Z0-9-_\.]/g, '-');
    const filename = `Pathfinder-Matrix-${safe(roleLabel)}.pdf`;

    // Append summary as final page if provided
    if (summary && String(summary).trim() !== '') {
        doc.addPage();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const sumTitle = locale === 'de' ? 'Zusammenfassung' : 'Summary';
        doc.text(sumTitle, 40, 60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const text = String(summary);
        const split = doc.splitTextToSize(
            text,
            doc.internal.pageSize.getWidth() - 80
        );
        doc.text(split, 40, 80);
    }

    doc.save(filename);
}

export default exportMatrixPdf;
