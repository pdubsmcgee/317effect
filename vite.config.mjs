import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function collectHtml(dir, root = dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(full, root, list);
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      list.push([rel === 'index.html' ? 'index' : rel.replace(/\.html$/, '').replace(/\//g, '_'), full]);
    }
  }
  return list;
}

const inputs = Object.fromEntries(collectHtml(process.cwd()));

export default defineConfig({
  base: '/317effect/',
  build: {
    rollupOptions: { input: inputs }
  }
});
