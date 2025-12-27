Pathfinder — Software Engineering Matrix
## https://pathfinder-mauve.vercel.app/
=====================================

Pathfinder is a small internal React + Next.js application for maintaining a "software engineering matrix": categorized items with per-role RAG (Red/Amber/Green) statuses, per-role descriptions, and optional per-item notes. The app supports English and German translations, persists answers in `localStorage`, and can export the matrix to a PDF (including a final summary page).

Table of contents
- Features
- Quick start
- Development
- Localization
- Data & persistence
- PDF export
- Project structure
- Troubleshooting
- License & credits

Features
--------

- Role-focused RAG statuses: set `director`, `senior`, `intermediate`, and `junior` statuses per item.
- Per-role descriptions and per-item freeform notes (`subline`).
- Summary tab for adding longer comments that are appended as the final page in PDF exports.
- Localized UI: English (`en`) and German (`de`) with runtime switching.
- Export to PDF using `jspdf` + `jspdf-autotable` with per-section pages and programmatically drawn status indicators.
- Persisted state in `localStorage` with migration/backfill logic for older data shapes.

Quick start
-----------

Prerequisites: Node.js (16+ recommended), npm.

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

Development
-----------

- Linting: `npm run lint` (uses `eslint`).
- TypeScript is used across the codebase; check `tsconfig.json` for settings.
- Styling: SCSS modules with shared variables in `styles/abstracts`.

If `npm run dev` fails with a lock error mentioning `.next/dev/lock`, ensure no other `next dev` is running and remove the leftover lock file or kill the running `node` process.

Example commands to find & stop a running dev server:

```bash
# show processes that run next dev
ps aux | grep "next dev" | grep -v grep
# kill a PID reported by the line above
kill <pid>
```

Localization
------------

- The i18n system is a small provider in `lib/i18n.tsx`. Supported locales: `en`, `de`.
- Translations are in `TRANSLATIONS` inside `lib/i18n.tsx`.
- Text fields stored in data (titles, labels, descriptions, subline) can be either a plain string or an object mapping locales to strings (`LocalizedString`). Helper `lib/localize.ts` exposes `localizeToString()` and `localizeString()` to safely render localized values.

Data & persistence
------------------

- Canonical seed data is `public/data.json` used on first load or when `Reset All` is triggered.
- User answers (statuses, descriptions, sublines) are persisted to `localStorage` under the key `pathfinder-matrix`.
- The summary textarea is persisted under `pathfinder-summary`.
- `utils/storage.ts` contains normalization and migration logic to tolerate older shapes (e.g., legacy `status` property) and to coerce localized objects into safe strings for rendering.

PDF export
----------

- Export implemented in `lib/exportPdf.ts` using `jspdf` and `jspdf-autotable`.
- Each matrix section is rendered on its own page with columns: `Item`, `Status` (programmatic circle), `Description`.
- Status colors are chosen by mapping the localized status label back to a canonical key and selecting RGB values from `STATUS_COLOR`.
- The exporter attempts to fit an entire section on a single page by trying smaller font sizes and reduced padding; if it cannot, it falls back to natural page breaks.
- A final summary page is appended when the `summary` text is provided (this is wired into the UI; see `ExportPdfButton` component).

Project structure (high level)
-----------------------------

- `app/` — Next.js (App Router) pages and layout.
  - `page.tsx` — main dashboard UI with the matrix, title selector, search, and `ExportPdfButton`.
  - `layout.tsx` — root layout with `I18nProvider`.
- `components/` — UI components (Header, Footer, ItemCard, SectionTabs, ConfirmModal, ExportPdfButton, etc.).
- `lib/` — helper libraries: `i18n.tsx`, `localize.ts`, `exportPdf.ts`, `types.ts`.
- `utils/` — `storage.ts` localStorage helpers and normalization.
- `public/data.json` — canonical seed data used for resetting and initial load.

Troubleshooting
---------------

- Wrong colors or labels in PDF: ensure the app locale matches the expected export locale. The exporter maps localized status labels back to keys before choosing colors.
- Seeing `[object Object]` in UI: older persisted data may have serialized localized objects; `utils/storage.ts` contains backfill logic to convert these to safe strings on load. If you still see issues, delete the browser `localStorage` entry `pathfinder-matrix` and reload.
- Dev server stuck on lock: stop any running `next dev` processes and remove `.next/dev/lock` if needed.

Customize
---------

- To adjust status colors, edit `STATUS_COLOR` in `lib/exportPdf.ts` to your preferred RGB values.
- To add locales, update `TRANSLATIONS` in `lib/i18n.tsx` and ensure `public/data.json` contains localized strings.

Dependencies
------------

- Next.js 16, React 19
- jsPDF and `jspdf-autotable` for PDF generation
- `xlsx` for import utilities (project contains Excel import components)

Credits
-------

Developed by Ciamac Davoudi (Dipl.-Ing.).

---

If you'd like, I can also:
- Add a short `CONTRIBUTING.md` with steps for adding translations or items.
- Add automated PDF export tests that generate a sample PDF on CI and surface diffs.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
