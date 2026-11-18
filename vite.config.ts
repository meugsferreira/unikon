import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { seoPlugin } from './scripts/seo';

export default defineConfig({
  // pasta do site: "/" no domínio próprio; no GitHub Pages o workflow passa BASE_PATH=/<repositório>/
  base: (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), seoPlugin()],
  server: {
    port: 5175,
    // WSL/pasta do Windows (/mnt/c) não avisa mudanças de arquivo: checa a cada 300 ms
    watch: { usePolling: true, interval: 300 },
  },
});
