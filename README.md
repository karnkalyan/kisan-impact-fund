# Kisan Impact Fund website

A production-ready corporate website for Kisan Impact Fund, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide icons. It uses local, typed content and requires no database, authentication or paid API.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Create a production build with `npm run build` and preview it with `npm run start`.

## Pages

- `/` — home
- `/about`
- `/investment-model`
- `/portfolio`
- `/impact`
- `/farmers`
- `/leadership`
- `/insights`
- `/contact`
- `/legal`

Sitemap and robots files are generated at `/sitemap.xml` and `/robots.txt`.

## Edit site content

- Shared statistics, leadership, portfolio and FAQs: `app/data.ts`
- Page copy, forms and components: `app/Site.tsx`
- Company metadata and structured data: `app/layout.tsx`
- Route metadata and social cards: `app/[[...slug]]/page.tsx`
- Visual system and responsive behavior: `app/globals.css`

To add a portfolio company, add a typed record to `ventures` in `app/data.ts`. To update a board member, change the relevant `leaders` entry and place the approved portrait in `public/images/leadership`. To publish an article, replace the demonstration entries in the Insights section with approved data; a future content array can follow the same pattern as `ventures`.

## Images

Supplied photography is stored in `public/images/leadership`. The three `Gemini_Generated_*` files and the sustainable-agriculture presentation image are currently used as approved supplied page backgrounds. `public/og.png` is the social sharing card.

Keep filenames stable or update their references in `app/Site.tsx`. Compress new photographs before publishing, preserve natural proportions, and use descriptive alternative text. See `IMAGE-REPLACEMENT-GUIDE.md`.

## Language

The public website is English-only. If a Nepali edition is approved later, add reviewed translations as a separate locale architecture; never machine-publish unreviewed legal or investment language.

## Forms

Forms validate in the browser and show a success state without transmitting or storing information. To connect a backend later, replace each `onSubmit` demonstration handler with an approved secure endpoint, add server-side validation, consent records, spam protection, privacy disclosures, retention rules and success/error handling. Do not add online investment transactions to these forms.

## Deployment

- Sites/Cloudflare: use the included `.openai/hosting.json` and the existing Vinext build.
- Vercel: import the repository and use the standard Next.js settings.
- Netlify: use its Next.js adapter and `npm run build`.
- Static hosting: the content has no backend dependencies; if switching from Vinext, configure Next.js static export and confirm the catch-all routes are emitted as individual paths.

Before any public deployment, complete `LEGAL-REVIEW-CHECKLIST.md`, replace every “pending approval” contact or policy field, verify the canonical domain, and have authorized representatives approve financial, corporate and regulatory statements.

## Verification

```bash
npm run build
npm run lint
```

The responsive system targets 360, 768, 1024 and 1440-pixel viewports, includes reduced-motion behavior, keyboard focus states, semantic headings, labels and screen-reader descriptions for data visuals.
