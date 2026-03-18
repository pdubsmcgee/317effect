# The 3:17 Interference Archive

A satirical, static multi-page website styled as a government-adjacent research archive.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output is written to `dist/` and includes generated report detail pages.

## Content model: residue reports

Reports are authored in Markdown files under `content/reports/` with frontmatter:

- `title`
- `date`
- `severity` (`low` / `medium` / `high`)
- `timestamp`
- `tags` (array)
- `summary`

Example workflow for a new report:

1. Add `content/reports/my-report-slug.md`.
2. Fill frontmatter + report body.
3. Run `npm run build:reports` (or just `npm run build`).
4. Commit the Markdown source and generated output (`data/reports.json` + `residue-reports/<slug>/index.html`).

## Pages

- `/` Home
- `/global-synchronization/`
- `/echo-mapping/`
- `/residue-reports/` (list)
- `/residue-reports/<slug>/` (detail)
- `/status/`
- `/about/`

## Deployment (GitHub Pages)

The repo includes workflows:

- `.github/workflows/ci.yml` for build verification
- `.github/workflows/deploy-pages.yml` for automatic Pages deploy from `main`

One-time setup:

1. GitHub repository → **Settings** → **Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` and the deployment workflow publishes `dist/`
