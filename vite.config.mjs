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
  base: '/',
  build: {
    outDir: './dist',
    rollupOptions: {
      input: inputs,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  // Generate asset manifest for Workers
  plugins: [{
    name: 'asset-manifest',
    closeBundle() {
      const manifest = {};
      const distDir = './dist';
      
      function walkDir(currentDir) {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
          const fullPath = path.join(currentDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            walkDir(fullPath);
          } else if (stat.isFile()) {
            const relativePath = path.relative(distDir, fullPath).split(path.sep).join('/');
            manifest[relativePath] = `/${relativePath}`;
          }
        }
      }
      
      walkDir(distDir);
      fs.writeFileSync('./dist/__static-content-manifest.json', JSON.stringify(manifest, null, 2));
    }
  }]
});
