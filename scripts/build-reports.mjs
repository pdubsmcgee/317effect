import fs from 'node:fs/promises';
import path from 'node:path';

const contentDir = path.resolve('content/reports');
const outputDirs = [path.resolve('data'), path.resolve('public/data')];
const detailsRoot = path.resolve('residue-reports');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Report is missing frontmatter block');
  const [, head, body] = match;
  const meta = {};
  for (const line of head.split('\n')) {
    const keyValue = line.match(/^(\w+):\s*(.*)$/);
    if (!keyValue) continue;
    const [, key, valueRaw] = keyValue;
    meta[key] = valueRaw.startsWith('[')
      ? valueRaw.slice(1, -1).split(',').map((item) => item.trim().replace(/^"|"$/g, ''))
      : valueRaw.replace(/^"|"$/g, '');
  }
  return { meta, body: body.trim() };
}

const markdownToHtml = (md) => md.split(/\n\n+/).map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`).join('\n');

function detailHtml(report) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${report.title}</title><link rel="stylesheet" href="/assets/styles.css"></head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container nav"><a class="brand" href="/">3:17 Counter-Archive</a><nav class="links" aria-label="Primary"><a href="/">Home</a><a href="/global-synchronization/">Counter Model</a><a href="/echo-mapping/">Pattern Mapping</a><a href="/residue-reports/">Case Reviews</a><a href="/field-guide/">Method Guide</a><a href="/status/">Status</a><a href="/about/">About</a></nav></div></header>
<main id="main" class="container"><article class="panel"><h1>${report.title}</h1><p class="meta">${report.date} · ${report.timestamp}</p><p>${report.summary}</p><div class="report-tags"><span class="badge ${report.severity}">${report.severity}</span>${report.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div><section class="section">${report.html}</section></article></main>
<footer><div class="container"><a href="/residue-reports/">← Back to reports index</a></div></footer><script type="module" src="/assets/app.js"></script></body></html>`;
}

const files = (await fs.readdir(contentDir)).filter((name) => name.endsWith('.md'));
const reports = [];
for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(contentDir, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  reports.push({ ...meta, slug, html: markdownToHtml(body) });
}
reports.sort((a, b) => new Date(b.date) - new Date(a.date));

for (const dir of outputDirs) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'reports.json'), JSON.stringify(reports.map(({ html, ...rest }) => rest), null, 2));
}

for (const report of reports) {
  const dir = path.join(detailsRoot, report.slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), detailHtml(report));
}

console.log(`Generated ${reports.length} report entries.`);
