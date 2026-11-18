// Baixa as imagens do site para public/img (só as que ainda não existem).
// Roda sozinho antes do `npm run dev` e do `npm run build`. Se estiver sem
// internet, segue em frente: o site usa a imagem da origem como reserva.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = await fs.readFile(path.join(root, 'src/data/images.ts'), 'utf8');
const outDir = path.join(root, 'public/img');
await fs.mkdir(outDir, { recursive: true });

// extrai (arquivo, url) das chamadas site(...) e unsplash(...)
const jobs = [];
for (const m of src.matchAll(/site\('([^']+)',\s*'([^']+)'/g)) jobs.push({ file: m[2], url: `http://unikon.com.br/${m[1]}` });
for (const m of src.matchAll(/unsplash\('([^']+)',\s*'([^']+)'/g))
  jobs.push({ file: m[2], url: `https://images.unsplash.com/${m[1]}?fm=jpg&q=75&w=1800&auto=format&fit=crop` });

let ok = 0;
let skipped = 0;
const failed = [];
await Promise.all(
  jobs.map(async ({ file, url }) => {
    const dest = path.join(outDir, file);
    try {
      await fs.access(dest);
      skipped++;
      return;
    } catch {}
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      ok++;
    } catch (e) {
      failed.push(`${file} (${e.message})`);
    }
  }),
);

console.log(`[imagens] ${ok} baixada(s), ${skipped} já existia(m)${failed.length ? `, ${failed.length} usando a origem: ${failed.join(', ')}` : ''}`);
