import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';
import { site } from './src/config/site';
import { codeTransformers } from './src/lib/shiki';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.resolve(siteRoot, '..');

// RepoCode reads files from core/ and clients/ with node:fs at build time. Vite does not watch
// them, so in dev this plugin adds them to the watcher and reloads the page when they change.
function watchRepoSources(): Plugin {
  const dirs = ['core', 'clients'].map((dir) => path.join(repoRoot, dir));
  return {
    name: 'watch-repo-sources',
    configureServer(server) {
      server.watcher.add(dirs);
      server.watcher.on('change', (file) => {
        if (dirs.some((dir) => file.startsWith(dir + path.sep))) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  site: site.url,
  base: site.base,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      transformers: codeTransformers(),
    },
  },
  vite: {
    plugins: [tailwindcss(), watchRepoSources()],
    define: {
      __REPO_ROOT__: JSON.stringify(repoRoot),
      __SITE_ROOT__: JSON.stringify(siteRoot),
      __INCLUDE_DRAFTS__: JSON.stringify(process.env.SITE_DRAFTS === '1'),
    },
  },
});
