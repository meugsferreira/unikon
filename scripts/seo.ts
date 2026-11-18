/**
 * SEO da UNIKON, gerado no Node (Vite) a partir de src/data/site.ts:
 *
 *  - <head>: title, description, canonical, robots, Open Graph, Twitter e JSON-LD (schema.org)
 *  - <noscript>: o conteúdo essencial para quem não roda JavaScript
 *  - /robots.txt (todos os robôs liberados) e /sitemap.xml (com as imagens)
 *
 * ANTISPAM: telefone e e-mails NÃO entram aqui (nem no JSON-LD nem no <noscript>). Eles ficam embaralhados em
 * CONTACT (src/data/site.ts) e só aparecem na página quando uma pessoa interage. Para o Google mostrar o telefone
 * na busca, use o Perfil da Empresa no Google (Google Business Profile).
 *
 * Os textos dos H1/H2 (SECTIONS) e dos H3 (SERVICES, EXTRAS, PRODUCTS, SPOT) usados na página
 * são os MESMOS que vão para o JSON-LD, com âncoras (#servicos, #produtos…) apontando para as seções.
 * Tudo entra no HTML estático do build, então o Google lê sem precisar executar o React.
 *
 * Endereço do site: SITE.url, ou SITE_URL=https://... na hora do `npm run build`.
 */
import type { Plugin } from 'vite';
import IMAGE_SIZES from '../src/data/image-sizes.json';
import { EXTRAS, PRODUCTS, SECTIONS, SERVICES, SITE, SPOT } from '../src/data/site';

type Json = Record<string, unknown>;

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

/**
 * PREVIEW=1 no build (o workflow do GitHub Pages usa): versão de visualização, que NÃO pode ir para o Google
 * (concorreria com o site oficial). Sai com noindex e robots.txt bloqueando tudo.
 */
const PREVIEW = env.PREVIEW === '1';

/**
 * Política de segurança (CSP) do site publicado. O GitHub Pages não deixa configurar cabeçalhos HTTP, então vai como
 * <meta> (vale para tudo, menos frame-ancestors). Só no build: o modo dev do Vite usa scripts inline.
 * Se incluir um serviço externo (formulário, mapa, analytics), libere o domínio dele aqui.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://images.unsplash.com",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escXml = escAttr;

export function createSeo(siteUrl: string = env.SITE_URL || SITE.url) {
  const base = siteUrl.replace(/\/$/, '');
  const abs = (p: string) => (p.startsWith('http') ? p : `${base}${p.startsWith('/') ? '' : '/'}${p}`);
  const anchor = (id: string) => `${base}/#${id}`;

  // ---------- JSON-LD ----------
  function jsonLd(): Json {
    const orgId = `${base}/#empresa`;
    const isLocal = Boolean(SITE.address);

    const service = (name: string, description: string, sectionId: string) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description, serviceType: name, provider: { '@id': orgId }, url: anchor(sectionId) },
    });
    const product = (name: string, description: string, image: string, sectionId: string, brand?: string) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name,
        description,
        image: abs(image),
        url: anchor(sectionId),
        ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
      },
    });

    const organization: Json = {
      '@type': isLocal ? 'LocalBusiness' : 'Organization',
      '@id': orgId,
      name: SITE.name,
      url: `${base}/`,
      description: SITE.description,
      logo: { '@type': 'ImageObject', url: abs(SITE.logo) },
      image: abs(SITE.ogImage),
      areaServed: SITE.areaServed,
      knowsAbout: [...SERVICES.map((s) => s.title), ...EXTRAS.map((e) => e.title)],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços e produtos UNIKON',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: SECTIONS.services.title,
            url: anchor(SECTIONS.services.id),
            itemListElement: SERVICES.map((s) => service(s.title, s.text, SECTIONS.services.id)),
          },
          {
            '@type': 'OfferCatalog',
            name: SECTIONS.extras.title,
            url: anchor(SECTIONS.extras.id),
            itemListElement: EXTRAS.map((e) => service(e.title, e.text, SECTIONS.extras.id)),
          },
          {
            '@type': 'OfferCatalog',
            name: SECTIONS.products.title,
            url: anchor(SECTIONS.products.id),
            itemListElement: PRODUCTS.map((p) => product(p.title, p.text, p.image.local, SECTIONS.products.id)),
          },
          {
            '@type': 'OfferCatalog',
            name: SECTIONS.spot.title,
            url: anchor(SECTIONS.spot.id),
            itemListElement: SPOT.map((p) => product(p.title, p.text, p.image.local, SECTIONS.spot.id, 'SPOT')),
          },
        ],
      },
      ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
      ...(SITE.address
        ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: SITE.address.street,
              addressLocality: SITE.address.city,
              addressRegion: SITE.address.region,
              postalCode: SITE.address.postalCode,
              addressCountry: 'BR',
            },
            // a central de monitoramento funciona 24×7
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59',
            },
          }
        : {}),
    };

    const website: Json = {
      '@type': 'WebSite',
      '@id': `${base}/#site`,
      url: `${base}/`,
      name: SITE.name,
      inLanguage: SITE.lang,
      publisher: { '@id': orgId },
    };

    // A página e suas seções (os mesmos H1/H2 do site, com as âncoras)
    const webpage: Json = {
      '@type': 'WebPage',
      '@id': `${base}/#pagina`,
      url: `${base}/`,
      name: SITE.title,
      headline: SECTIONS.hero.title,
      description: SITE.description,
      inLanguage: SITE.lang,
      isPartOf: { '@id': `${base}/#site` },
      about: { '@id': orgId },
      primaryImageOfPage: { '@type': 'ImageObject', url: abs(SITE.ogImage) },
      hasPart: Object.values(SECTIONS).map((s) => ({
        '@type': 'WebPageElement',
        '@id': anchor(s.id),
        name: s.title,
        url: anchor(s.id),
        ...(s.text ? { description: s.text } : {}),
      })),
    };

    return { '@context': 'https://schema.org', '@graph': [organization, website, webpage] };
  }

  /** Pré-carrega a foto do topo (a maior da tela inicial) em AVIF, com as mesmas larguras do <Img>. */
  function heroPreload(publicBase: string): string {
    const meta = (IMAGE_SIZES as Record<string, { widths: number[] }>)['hero-cameras.jpg'];
    if (!meta) return '';
    const set = meta.widths.map((w) => `${publicBase}img/otim/hero-cameras-${w}.avif ${w}w`).join(', ');
    return `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="100vw" fetchpriority="high" />`;
  }

  // ---------- <head> ----------
  /** `publicBase`: pasta do site no servidor ("/" ou "/<repositório>/"); `build`: inclui a CSP. */
  function head({ publicBase = '/', build = false }: { publicBase?: string; build?: boolean } = {}): string {
    const og = abs(SITE.ogImage);
    const json = JSON.stringify(jsonLd()).replace(/</g, '\\u003c');
    return [
      // segurança primeiro (a CSP precisa vir antes de qualquer recurso); a CSP só no build
      ...(build ? [`<meta http-equiv="Content-Security-Policy" content="${CSP}" />`] : []),
      // não manda o endereço completo da página para outros sites
      `<meta name="referrer" content="strict-origin-when-cross-origin" />`,
      `<title>${escAttr(SITE.title)}</title>`,
      `<meta name="description" content="${escAttr(SITE.description)}" />`,
      `<link rel="canonical" href="${base}/" />`,
      PREVIEW
        ? `<meta name="robots" content="noindex, nofollow" />`
        : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
      `<meta name="theme-color" content="${SITE.themeColor}" />`,
      `<meta name="format-detection" content="telephone=yes" />`,
      `<link rel="alternate" hreflang="${SITE.lang}" href="${base}/" />`,
      // Open Graph (WhatsApp, Facebook, LinkedIn)
      `<meta property="og:type" content="website" />`,
      `<meta property="og:locale" content="${SITE.locale}" />`,
      `<meta property="og:site_name" content="${SITE.name}" />`,
      `<meta property="og:url" content="${base}/" />`,
      `<meta property="og:title" content="${escAttr(SITE.title)}" />`,
      `<meta property="og:description" content="${escAttr(SITE.description)}" />`,
      `<meta property="og:image" content="${og}" />`,
      `<meta property="og:image:type" content="image/jpeg" />`,
      `<meta property="og:image:width" content="${SITE.ogImageSize[0]}" />`,
      `<meta property="og:image:height" content="${SITE.ogImageSize[1]}" />`,
      `<meta property="og:image:alt" content="Câmeras de segurança instaladas em parede" />`,
      // Twitter / X
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escAttr(SITE.title)}" />`,
      `<meta name="twitter:description" content="${escAttr(SITE.description)}" />`,
      `<meta name="twitter:image" content="${og}" />`,
      // foto do topo: começa a baixar já, no formato moderno (quem não entende AVIF ignora e usa o <picture>)
      heroPreload(publicBase),
      // dados estruturados
      `<script type="application/ld+json">${json}</script>`,
    ]
      .map((t) => `    ${t}`)
      .join('\n');
  }

  /** Conteúdo mínimo sem JavaScript (leitores antigos, robôs simples). */
  function noscript(): string {
    const li = (items: { title: string; text: string }[]) => items.map((i) => `<li><h3>${escXml(i.title)}</h3><p>${escXml(i.text)}</p></li>`).join('');
    return `<noscript>
      <header><p>${SITE.name}</p></header>
      <main>
        <h1>${escXml(SECTIONS.hero.title)}</h1>
        <p>${escXml(SECTIONS.hero.text)}</p>
        <section><h2>${escXml(SECTIONS.services.title)}</h2><ul>${li(SERVICES)}</ul></section>
        <section><h2>${escXml(SECTIONS.extras.title)}</h2><ul>${li(EXTRAS)}</ul></section>
        <section><h2>${escXml(SECTIONS.products.title)}</h2><ul>${li(PRODUCTS)}</ul></section>
        <section><h2>${escXml(SECTIONS.spot.title)}</h2><ul>${li(SPOT)}</ul></section>
        <section><h2>${escXml(SECTIONS.contact.title)}</h2>
          <p>Para ver o telefone, o WhatsApp e os e-mails, ative o JavaScript do navegador.</p>
        </section>
      </main>
    </noscript>`;
  }

  function robots(): string {
    if (PREVIEW) return `# Versão de visualização: não indexar\nUser-agent: *\nDisallow: /\n`;
    return `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  }

  function sitemap(): string {
    const today = new Date().toISOString().slice(0, 10);
    const images = [SITE.ogImage, ...SERVICES.map((s) => s.image.local), ...PRODUCTS.map((p) => p.image.local), ...SPOT.map((s) => s.image.local)];
    const imageTags = [...new Set(images)].map((i) => `    <image:image><image:loc>${escXml(abs(i))}</image:loc></image:image>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
${imageTags}
  </url>
</urlset>
`;
  }

  return { base, jsonLd, head, noscript, robots, sitemap };
}

/** Plugin do Vite: injeta o SEO no index.html e publica robots.txt e sitemap.xml (dev e build). */
export function seoPlugin(): Plugin {
  const seo = createSeo();
  let publicBase = '/';
  let build = false;
  return {
    name: 'unikon-seo',
    configResolved(config) {
      publicBase = config.base;
      build = config.command === 'build';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!--seo:head-->', seo.head({ publicBase, build })).replace('<!--seo:noscript-->', seo.noscript());
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // sem @types/node, o tipo da requisição não traz `url`
        const url = (req as { url?: string }).url;
        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(seo.robots());
        } else if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(seo.sitemap());
        } else next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: seo.robots() });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: seo.sitemap() });
    },
  };
}
