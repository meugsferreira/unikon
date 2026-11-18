// Gera a marca UNIKON: o "U", a palavra UNIKON e UNIKON + "Segurança eletrônica", em SVG (vetor, o original) e em
// PNG, WebP e AVIF em vários tamanhos, além dos ícones do site (favicon, celular, Android) e do logo quadrado do Google.
//
// Fontes (as mesmas do site):
//  - UNIKON e U: Nasalization (Typodermic). A "Typodermic Desktop License" é gratuita para uso comercial mas NÃO
//    permite webfont nem distribuir a fonte: este script baixa o .otf só na memória e grava apenas desenhos vetoriais
//    (uma arte de logo, sem caracteres reaproveitáveis). Nenhum arquivo de fonte vai para o site.
//  - "SEGURANÇA ELETRÔNICA": Barlow Condensed SemiBold (Google Fonts, licença OFL), a mesma do subtítulo do topo do site,
//    com o mesmo espaçamento (0.18em) e a mesma proporção (texto de 10px ao lado do logo de 28px).
//
// Saída:
//  - public/logo-unikon.svg e logo-unikon-branco.svg  (usados no topo do site)
//  - public/marca/  unikon-u*, unikon*, unikon-seguranca-eletronica* (ao lado) e -empilhado (embaixo, mesma largura)
//                   (.svg + .png/.webp/.avif em 3 larguras)
//                   unikon-logo-quadrado.png  (logo para o Google: fundo branco, 1200×1200)
//  - public/favicon.ico (16/32/48), favicon.svg, apple-touch-icon.png (180), icon-192.png, icon-512.png,
//    icon-maskable-512.png e site.webmanifest
//
// Uso: roda sozinho no `npm run dev` se faltar algum arquivo. `npm run logo` força gerar tudo de novo.
// Os PNG/WebP/AVIF precisam do sharp (devDependency); sem ele, gera só os SVG.
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const MARCA = path.join(PUB, 'marca');
const NASALIZATION_ZIP = 'https://dl.dafont.com/dl/?f=nasalization';
const BARLOW = 'https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-SemiBold.ttf';

// cores do site (src/index.css)
const C = {
  red: '#E3261B', // brand-500
  white: '#FFFFFF',
  steel100: '#E1E8F0',
  steel300: '#9DB2C8',
  steel500: '#4F7193',
  steel900: '#172433', // fundo do ícone (= theme-color)
};

/** Larguras dos arquivos de imagem de cada desenho (o SVG é o original, serve para qualquer tamanho). */
const WIDE_WIDTHS = [600, 1200, 2400];
const SQUARE_SIZES = [256, 512, 1024];

const force = process.argv.includes('--force');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Extrai o primeiro .otf/.ttf de um .zip (formato ZIP padrão, sem dependências). */
export function extractFont(zip) {
  const EOCD = 0x06054b50;
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) {
    if (zip.readUInt32LE(i) === EOCD) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('arquivo baixado não é um .zip válido');
  const count = zip.readUInt16LE(eocd + 10);
  let p = zip.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (zip.readUInt32LE(p) !== 0x02014b50) throw new Error('zip corrompido');
    const method = zip.readUInt16LE(p + 10);
    const compSize = zip.readUInt32LE(p + 20);
    const nameLen = zip.readUInt16LE(p + 28);
    const extraLen = zip.readUInt16LE(p + 30);
    const commentLen = zip.readUInt16LE(p + 32);
    const local = zip.readUInt32LE(p + 42);
    const name = zip.subarray(p + 46, p + 46 + nameLen).toString('utf8');
    if (/\.(otf|ttf)$/i.test(name)) {
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      const data = zip.subarray(start, start + compSize);
      if (method === 0) return { name, data };
      if (method === 8) return { name, data: zlib.inflateRawSync(data) };
      throw new Error(`compressão ${method} não suportada`);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('nenhuma fonte .otf/.ttf dentro do zip');
}

/** Monta um .ico com PNGs dentro (aceito por todos os navegadores e pelo Windows). */
export function buildIco(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // planos
    header.writeUInt16LE(32, e + 6); // bits por pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

const toArrayBuffer = (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);

async function download(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`download ${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Caminho de um texto com espaçamento entre letras (tracking em em), como o `tracking-[0.18em]` do CSS. */
function trackedPath(opentype, font, text, x, y, size, tracking) {
  const out = new opentype.Path();
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  let cx = x;
  glyphs.forEach((g, i) => {
    out.extend(g.getPath(cx, y, size));
    cx += g.advanceWidth * scale + tracking * size;
    if (glyphs[i + 1]) cx += font.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return out;
}

const svgDoc = (vb, body, label, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map((n) => +n.toFixed(2)).join(' ')}"${size ? ` width="${size[0]}" height="${size[1]}"` : ''} role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;

async function main() {
  const required = ['logo-unikon.svg', 'favicon.ico', 'site.webmanifest', 'marca/unikon-seguranca-eletronica.svg', 'marca/unikon-seguranca-eletronica-empilhado.svg', 'marca/unikon-logo-quadrado.png'];
  if (!force && (await Promise.all(required.map((f) => exists(path.join(PUB, f))))).every(Boolean)) {
    console.log('[logo] já existe (npm run logo para gerar de novo)');
    return;
  }

  let opentype;
  try {
    opentype = (await import('opentype.js')).default;
  } catch {
    console.warn('[logo] rode "npm install" antes (falta opentype.js). Usando o logo em texto por enquanto.');
    return;
  }
  let sharp = null;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('[logo] sharp não instalado: gerando só os SVG (sem PNG/WebP/AVIF nem favicon.ico).');
  }

  const [nasZip, barlowBuf] = await Promise.all([download(NASALIZATION_ZIP), download(BARLOW)]);
  const nas = extractFont(nasZip);
  const fontLogo = opentype.parse(toArrayBuffer(nas.data));
  const fontTag = opentype.parse(toArrayBuffer(barlowBuf));

  // ---------- desenhos (tudo vira caminho vetorial: é arte, não texto) ----------
  const word = fontLogo.getPath('UNIKON', 0, 0, 100, { kerning: true });
  const wb = word.getBoundingBox();
  const wordD = word.toPathData(2);

  const u = fontLogo.getPath('U', 0, 0, 100);
  const ub = u.getBoundingBox();
  const uD = u.toPathData(2);

  // Lockup como no topo do site: logo com 28px de altura, gap 10px, linha de 1px, 10px, texto 10px em 2 linhas
  // (leading 1.25), tudo centralizado na vertical. Unidade: "px do site" × k, com k = altura do logo / 28.
  const k = (wb.y2 - wb.y1) / 28;
  const tagSize = 10 * k;
  const lineH = 12.5 * k;
  const blockH = lineH * 2;
  const capH = ((fontTag.tables.os2?.sCapHeight || fontTag.unitsPerEm * 0.7) / fontTag.unitsPerEm) * tagSize;
  const midY = (wb.y1 + wb.y2) / 2;
  const blockTop = midY - blockH / 2;
  const divX = wb.x2 + 10 * k;
  const textX = divX + 1 * k + 10 * k;
  const lines = ['SEGURANÇA', 'ELETRÔNICA'].map((t, i) => {
    const baseline = blockTop + lineH * i + (lineH - capH) / 2 + capH;
    return trackedPath(opentype, fontTag, t, textX, baseline, tagSize, 0.18);
  });
  const tagD = lines.map((p) => p.toPathData(2)).join('');
  const tagRight = Math.max(...lines.map((p) => p.getBoundingBox().x2));
  const tagBoxes = lines.map((p) => p.getBoundingBox());

  // Versão EMPILHADA: UNIKON em cima e "SEGURANÇA ELETRÔNICA" numa linha embaixo, centralizado e com a MESMA largura
  // da palavra (a tinta da 1ª e da última letra encosta nas bordas do U e do N). Espaçamento fixo; o tamanho do texto
  // é calculado para fechar a largura exata. Espaço entre as linhas: STACK_GAP × altura da palavra.
  const STACK_TEXT = 'SEGURANÇA ELETRÔNICA';
  const STACK_TRACK = 0.3; // em
  const STACK_GAP = 0.3;
  const wordW = wb.x2 - wb.x1;
  const wordH = wb.y2 - wb.y1;
  const probe = trackedPath(opentype, fontTag, STACK_TEXT, 0, 0, 100, STACK_TRACK).getBoundingBox();
  const stackSize = (100 * wordW) / (probe.x2 - probe.x1);
  const stackCapH = ((fontTag.tables.os2?.sCapHeight || fontTag.unitsPerEm * 0.7) / fontTag.unitsPerEm) * stackSize;
  const stackBaseline = wb.y2 + STACK_GAP * wordH + stackCapH;
  const stackLine = trackedPath(opentype, fontTag, STACK_TEXT, wb.x1 - (probe.x1 * stackSize) / 100, stackBaseline, stackSize, STACK_TRACK);
  const stackD = stackLine.toPathData(2);
  const sb = stackLine.getBoundingBox();

  const pad = 2;
  const box = (x1, y1, x2, y2) => [x1 - pad, y1 - pad, x2 - x1 + pad * 2, y2 - y1 + pad * 2];
  const wordVB = box(wb.x1, wb.y1, wb.x2, wb.y2);
  const lockVB = box(wb.x1, Math.min(wb.y1, blockTop, ...tagBoxes.map((b) => b.y1)), tagRight, Math.max(wb.y2, blockTop + blockH, ...tagBoxes.map((b) => b.y2)));
  const stackVB = box(wb.x1, Math.min(wb.y1, sb.y1), wb.x2, sb.y2);
  // U num quadrado (sobra igual dos lados), para servir de ícone
  const uSide = Math.max(ub.x2 - ub.x1, ub.y2 - ub.y1) + pad * 2;
  const uVB = [(ub.x1 + ub.x2) / 2 - uSide / 2, (ub.y1 + ub.y2) / 2 - uSide / 2, uSide, uSide];

  const LOCK_LABEL = 'UNIKON Segurança eletrônica';
  const designs = {
    'unikon-u': { vb: uVB, label: 'UNIKON', body: (c) => `<path fill="${c.mark}" d="${uD}"/>` },
    unikon: { vb: wordVB, label: 'UNIKON', body: (c) => `<path fill="${c.mark}" d="${wordD}"/>` },
    'unikon-seguranca-eletronica': {
      vb: lockVB,
      label: LOCK_LABEL,
      body: (c) =>
        `<path fill="${c.mark}" d="${wordD}"/><rect x="${divX.toFixed(2)}" y="${blockTop.toFixed(2)}" width="${k.toFixed(2)}" height="${blockH.toFixed(2)}" fill="${c.divider}"${c.dividerOpacity ? ` fill-opacity="${c.dividerOpacity}"` : ''}/><path fill="${c.tag}" d="${tagD}"/>`,
    },
    'unikon-seguranca-eletronica-empilhado': {
      vb: stackVB,
      label: LOCK_LABEL,
      body: (c) => `<path fill="${c.mark}" d="${wordD}"/><path fill="${c.tag}" d="${stackD}"/>`,
    },
  };
  console.log(
    `[logo] empilhado: texto ${stackSize.toFixed(1)} (palavra 100), bordas: U ${wb.x1.toFixed(2)}/${sb.x1.toFixed(2)}, N ${wb.x2.toFixed(2)}/${sb.x2.toFixed(2)}`,
  );
  // cores: para fundo claro (vermelho + subtítulo steel-500) e "branco" para fundo escuro, iguais ao topo do site
  const themes = {
    '': { mark: C.red, tag: C.steel500, divider: C.steel300 },
    '-branco': { mark: C.white, tag: C.steel100, // subtítulo claro: 15:1 sobre #0c141f
                 divider: C.white, dividerOpacity: 0.2 },
  };

  await fs.mkdir(MARCA, { recursive: true });
  const written = [];
  const write = async (rel, data) => {
    await fs.writeFile(path.join(PUB, rel), data);
    written.push({ rel, bytes: Buffer.byteLength(data) });
  };

  // ---------- SVG + PNG/WebP/AVIF ----------
  for (const [name, d] of Object.entries(designs)) {
    for (const [suffix, colors] of Object.entries(themes)) {
      const base = `${name}${suffix}`;
      await write(`marca/${base}.svg`, svgDoc(d.vb, d.body(colors), d.label));
      if (!sharp) continue;
      const square = name === 'unikon-u';
      for (const w of square ? SQUARE_SIZES : WIDE_WIDTHS) {
        const h = Math.round((w * d.vb[3]) / d.vb[2]);
        const png = await sharp(Buffer.from(svgDoc(d.vb, d.body(colors), d.label, [w, h])))
          .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
          .toBuffer();
        await write(`marca/${base}-${w}.png`, png);
        // logos têm bordas nítidas e transparência: WebP sem perdas e AVIF de alta qualidade
        await write(`marca/${base}-${w}.webp`, await sharp(png).webp({ lossless: true, effort: 6 }).toBuffer());
        await write(`marca/${base}-${w}.avif`, await sharp(png).avif({ quality: 80, effort: 6, chromaSubsampling: '4:4:4' }).toBuffer());
      }
    }
  }
  // usados no topo do site (mesmos nomes de antes)
  await write('logo-unikon.svg', svgDoc(wordVB, designs.unikon.body(themes['']), 'UNIKON'));
  await write('logo-unikon-branco.svg', svgDoc(wordVB, designs.unikon.body(themes['-branco']), 'UNIKON'));

  // ---------- ícones do site: U vermelho no quadrado azul-escuro ----------
  // `fill` = quanto do quadrado o U ocupa; o "maskable" (Android) deixa o U na zona segura central (80%)
  const icon = (size, { fill = 0.62, radius = 0 } = {}) => {
    const s = 100;
    const scale = (s * fill) / uSide;
    const tx = s / 2 - (uVB[0] + uSide / 2) * scale;
    const ty = s / 2 - (uVB[1] + uSide / 2) * scale;
    const bg = `<rect width="${s}" height="${s}"${radius ? ` rx="${radius}"` : ''} fill="${C.steel900}"/>`;
    const mark = `<path fill="${C.red}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})" d="${uD}"/>`;
    return svgDoc([0, 0, s, s], bg + mark, 'UNIKON', size ? [size, size] : undefined);
  };
  await write('favicon.svg', icon(0, { radius: 22 }));
  if (sharp) {
    const png = async (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
    // nos tamanhos pequenos o U fica maior, para continuar legível na aba do navegador
    const ico = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(icon(size, { fill: 0.74, radius: 22 })) })));
    await write('favicon.ico', buildIco(ico));
    await write('apple-touch-icon.png', await png(icon(180))); // o iPhone arredonda sozinho: quadrado cheio
    await write('icon-192.png', await png(icon(192, { radius: 22 })));
    await write('icon-512.png', await png(icon(512, { radius: 22 })));
    await write('icon-maskable-512.png', await png(icon(512, { fill: 0.5 })));

    // logo para o Google (JSON-LD): quadrado, fundo branco, palavra no centro com margem
    const S = 1200;
    const ww = S * 0.8;
    const wh = (ww * wordVB[3]) / wordVB[2];
    const inner = svgDoc(wordVB, designs.unikon.body(themes['']), 'UNIKON', [Math.round(ww), Math.round(wh)]);
    const wordPng = await sharp(Buffer.from(inner)).png().toBuffer();
    const squarePng = await sharp({ create: { width: S, height: S, channels: 3, background: '#FFFFFF' } })
      .composite([{ input: wordPng, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
    await write('marca/unikon-logo-quadrado.png', squarePng);
  }

  const manifest = {
    name: 'UNIKON Segurança eletrônica',
    short_name: 'UNIKON',
    lang: 'pt-BR',
    start_url: '.', // relativo: funciona no domínio e na subpasta do GitHub Pages
    display: 'browser',
    background_color: C.steel900,
    theme_color: C.steel900,
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  await write('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`[logo] gerado a partir de ${nas.name} + Barlow Condensed SemiBold: ${written.length} arquivos`);
  if (process.argv.includes('--verbose')) for (const w of written) console.log(`  ${w.rel.padEnd(52)} ${kb(w.bytes)}`);
}

// só roda quando chamado direto (extractFont/buildIco podem ser importados em testes)
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => console.warn(`[logo] não foi possível gerar agora (${e.message}). Usando o logo em texto.`));
}
