// Otimiza as fotos de public/img (baixadas por baixar-imagens.mjs) para AVIF, WebP e JPEG progressivo, em várias
// larguras, e grava em public/img/otim/. O componente <Img> usa <picture>: o navegador escolhe o formato mais moderno
// que entende (AVIF → WebP → JPEG) e a largura certa para a tela (srcset/sizes).
//
// Também grava src/data/image-sizes.json (largura/altura de cada foto e larguras geradas), que o <Img> usa para
// montar o srcset e reservar o espaço da foto (sem a página "pular" enquanto carrega).
//
// Roda sozinho no `npm run dev` e no `npm run build` (só refaz o que mudou). `npm run imagens` força refazer tudo.
// Precisa do sharp (devDependency); sem ele, o site usa as fotos originais.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public/img');
const OUT = path.join(SRC, 'otim');
const MANIFEST = path.join(ROOT, 'src/data/image-sizes.json');

/** Larguras geradas (só as menores que o original, mais o próprio original). */
const WIDTHS = [480, 800, 1200, 1800];
/** Qualidade: AVIF e WebP com perdas leves (invisíveis em foto); JPEG com mozjpeg, progressivo. */
const Q = { avif: { quality: 55, effort: 6 }, webp: { quality: 80, effort: 6, smartSubsample: true }, jpg: { quality: 80, mozjpeg: true, progressive: true } };

const force = process.argv.includes('--force');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[otimizar] sharp não instalado: o site usa as fotos originais. Rode "npm install".');
  process.exit(0);
}

const mtime = async (p) => (await fs.stat(p).catch(() => null))?.mtimeMs ?? 0;

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const manifest = {};
let made = 0;
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(SRC, file);
  const meta = await sharp(src).metadata();
  // fotos com orientação EXIF: largura/altura já "em pé"
  const [w, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const widths = [...WIDTHS.filter((x) => x < w), w];
  manifest[file] = { w, h, widths };

  const base = file.replace(/\.[^.]+$/, '');
  const srcTime = await mtime(src);
  before += (await fs.stat(src)).size;
  for (const width of widths) {
    for (const ext of ['avif', 'webp', 'jpg']) {
      const out = path.join(OUT, `${base}-${width}.${ext}`);
      if (!force && (await mtime(out)) > srcTime) {
        if (width === w && ext === 'avif') after += (await fs.stat(out)).size;
        continue;
      }
      let img = sharp(src).rotate().resize({ width, withoutEnlargement: true });
      img = ext === 'avif' ? img.avif(Q.avif) : ext === 'webp' ? img.webp(Q.webp) : img.jpeg(Q.jpg);
      const info = await img.toFile(out);
      if (width === w && ext === 'avif') after += info.size;
      made++;
    }
  }
}

await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(
  `[otimizar] ${files.length} fotos, ${made} arquivo(s) novo(s) em public/img/otim. ` +
    `Tamanho cheio: JPEG original ${kb(before)} → AVIF ${kb(after)}`,
);
