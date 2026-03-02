# They Live Site

Static multi-page website built with Vite for deployment as plain static files.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output is written to `dist/`.

## GitHub Actions automation

This repository includes two workflows:

- **CI** (`.github/workflows/ci.yml`)
  - Runs on every pull request and pushes to `main`
  - Installs dependencies with `npm ci`
  - Verifies the production build with `npm run build`
- **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`)
  - Runs automatically on pushes to `main` (and manually via workflow dispatch)
  - Builds the site and deploys `dist/` to GitHub Pages

## One-time GitHub setup for auto deploy

1. In your GitHub repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. (Optional, for custom domain) Keep the `CNAME` file in the repo and set DNS records to point to GitHub Pages.
4. Push to `main`; deployment runs automatically and publishes the site.

## Deploy static files manually (optional)

1. Run `npm run build`.
2. Upload the contents of `dist/` to any static file host.
3. Ensure your domain points to the host and serves `index.html` at the root.

## Pages

- `/` Home
- `/theory.html` The Theory
- `/evidence.html` Evidence
- `/history.html` History
- `/facilities.html` Facilities
- `/recruitment.html` Recruitment
- `/witness-reports.html` Witness Reports
- `/methodology.html` Methodology
- `/glossary.html` Glossary
- `/whitepaper.html` Whitepaper
- `/archive.html` Archive
