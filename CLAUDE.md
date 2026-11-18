# UNIKON: site

Site da UNIKON (monitoramento de alarmes e câmeras, rastreadores e telefone via satélite SPOT). Até agora: só a
**home** (uma página). React 19 + Vite + Tailwind v4, sem servidor.

## Rodar
`npm install` e `npm run dev` (http://localhost:5175). O `predev` roda `scripts/baixar-imagens.mjs` (fotos para
`public/img`), `scripts/gerar-logo.mjs` (marca e ícones) e `scripts/otimizar-imagens.mjs` (AVIF/WebP/JPEG em
`public/img/otim` + `src/data/image-sizes.json`). Precisa do **sharp** (devDependency, instalar pelo WSL).
Node 20+ (recomendado 22).

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (5175) |
| `npm run build` | `tsc` + build em `dist/` (o `prebuild` roda os 3 scripts acima) |
| `npm run preview` | Abre o build localmente |
| `npm run logo` | Regera toda a marca e os ícones |
| `npm run imagens` | Regera todas as versões otimizadas das fotos |

## Estrutura
```
src/data/site.ts         textos, seções, serviços, produtos, CONTACT (fonte única do site e do SEO)
src/data/images.ts       lista de fotos (site() = site antigo, unsplash() = Unsplash)
src/data/image-sizes.json  gerado por otimizar-imagens.mjs (larguras de cada foto)
src/sections/            Header, Hero, Services, Products, Contact (+ Footer, WhatsAppFab)
src/components/ui.tsx    Logo, Img, ContactLink, RevealContacts, ExtLink, SectionHeading, asset()
scripts/seo.ts           plugin do Vite: head, JSON-LD, noscript, robots.txt, sitemap.xml, CSP, preload da foto do topo
scripts/gerar-logo.mjs   marca (public/marca/) e ícones (raiz de public/)
scripts/baixar-imagens.mjs   download das fotos para public/img (gitignored)
scripts/otimizar-imagens.mjs AVIF/WebP/JPEG em public/img/otim (gitignored)
.github/workflows/pages.yml  visualização no GitHub Pages
```

| O quê | Onde |
|---|---|
| Textos, serviços, produtos, SPOT, menu | `src/data/site.ts` |
| Telefone, WhatsApp, e-mails | `CONTACT` em `src/data/site.ts` (embaralhados, ver Antispam) |
| Fotos | `src/data/images.ts` |
| Cores | `src/index.css` (`@theme`) |
| Domínio | `SITE.url`, ou `SITE_URL=https://... npm run build` |

## Decisões de marca e conteúdo
- Conteúdo, telefones e e-mails vêm do site antigo (http://unikon.com.br, só abre em http). Não inventar números
  (anos de mercado, clientes etc.).
- **Logo**: palavra UNIKON na fonte **Nasalization** (Typodermic). A licença gratuita **não** permite webfont nem
  distribuir a fonte, então `gerar-logo.mjs` baixa a fonte só na memória e grava `public/logo-unikon.svg` (vermelho) e
  `logo-unikon-branco.svg` como desenho vetorial. Nunca colocar o arquivo da fonte no projeto. `npm run logo` regera.
- **Marca** (`public/marca/`): U, UNIKON e UNIKON + "Segurança eletrônica" (Barlow Condensed SemiBold, igual ao topo
  do site), cada um em versão normal e `-branco`, em SVG + PNG/WebP/AVIF (600/1200/2400 px; U em 256/512/1024).
  `unikon-logo-quadrado.png` é o logo do JSON-LD (Google). Ícones na raiz de `public/` (favicon.ico/svg,
  apple-touch-icon, icon-192/512, maskable, site.webmanifest). Tudo sai do `gerar-logo.mjs`: não editar à mão.
- **Fotos**: sempre pelo `<Img>` (usa `<picture>` AVIF → WebP → JPEG com srcset); passe `sizes` quando a foto não for
  de cartão. Foto nova: incluir em `images.ts`, rodar `npm run dev` (gera as versões). `npm run imagens` refaz tudo.
- **Cores**: vermelho da marca (`brand-*`) só no logo, nas chamadas acima dos títulos, no "24 horas." do H1 e em
  alertas; **botões de WhatsApp/orçamento são verdes** (`btn-go`, emerald-700); destaques em azul (`signal-*`); fundos
  em azul metálico (`steel-*`). O usuário pediu explicitamente para não usar botão vermelho.
- Fotos grandes do Unsplash (licença livre, crédito no rodapé); fotos de produtos do site antigo. A foto do
  SpotPhone do site antigo mostra um notebook; aguardando uma foto melhor.

## SEO e acessibilidade
- Fonte única: `src/data/site.ts` (`SITE`, `SECTIONS`, `SERVICES`…). `scripts/seo.ts` (plugin do Vite) gera title,
  description, canonical, Open Graph, JSON-LD (empresa, site, página e catálogo com os mesmos textos dos H1/H2/H3),
  `<noscript>`, `/robots.txt` e `/sitemap.xml`.
- **Antispam** (pedido do usuário, prioridade): telefone e e-mails ficam embaralhados em `CONTACT` (`site.ts`) e
  **não** vão para o HTML estático, JSON-LD nem `<noscript>`. Na página, use sempre `ContactLink` (href real só ao
  interagir) e `RevealContacts` ("Mostrar telefone e e-mails"); nunca escrever número/e-mail em texto puro nem usar
  `ExtLink` para WhatsApp. Robôs de busca e de IA continuam liberados (usuário quer ser encontrado em todo lugar).
  Trocar um contato: `node -e "console.log(Buffer.from('NOVO').toString('base64').split('').reverse().join(''))"` e
  colar o resultado na constante correspondente em `site.ts`.
- Formulário hoje não tem servidor (abre WhatsApp/e-mail), então não recebe spam. Ao ligar no servidor: campo isca
  (honeypot), tempo mínimo de preenchimento, Cloudflare Turnstile e limite de envios por IP.
- Acessibilidade verificada: 1 H1, hierarquia H2→H3, seções com `aria-labelledby` (use `SectionHeading` e
  `headingId`), links externos com `ExtLink` (avisa "abre em nova aba"), formulário com rótulos/fieldset/status,
  menu do celular com Esc e foco, contraste AA. Manter esses padrões em componentes novos.
- Pendências do usuário: preencher `SITE.address` e `SITE.sameAs` (SEO local) e confirmar o domínio em `SITE.url`.

## Próximos passos prováveis
Páginas de Serviços, Produtos e Loja; formulário enviando pelo servidor; área do cliente.

## Publicação e segurança
- **GitHub Pages (visualização)**: `.github/workflows/pages.yml` builda com `PREVIEW=1` (noindex + robots.txt
  bloqueando tudo) e `BASE_PATH=/<repo>/`. Ativar em Settings → Pages → Source: GitHub Actions.
- **Site oficial** (hospedagem tipo HostGator, Apache): `npm run build` e enviar o **conteúdo** de `dist/` para a raiz
  (`public_html`). Sai na raiz e indexável. Pendente: `.htaccess` com redirecionamento HTTPS, cabeçalhos de segurança
  (HSTS, CSP, frame-ancestors), cache longo e compressão; fazer quando a hospedagem for contratada.
- **README.md é público** (repositório público): só descrição em texto, sem comandos, estrutura nem detalhes técnicos.
  Detalhes técnicos ficam aqui no CLAUDE.md.
- **Subpasta**: arquivos de `public/` sempre via `asset('/img/...')` (em `components/ui.tsx`), nunca '/img/...' direto.
- **HTTPS**: nada carregado por `http://` no navegador (o site antigo só tem http: as fotos dele são baixadas no build
  e não têm reserva remota). Manter assim para não dar "conteúdo misto".
- **CSP** em `<meta>` (o Pages não aceita cabeçalhos), só no build, em `scripts/seo.ts` (`CSP`). Serviço externo novo
  (formulário, mapa, analytics) precisa ser liberado lá. Proteção contra iframe (frame-ancestors) só com cabeçalho
  HTTP, ou seja, na hospedagem final (Cloudflare).
- `npm audit`: 4 alertas do picomatch (ferramenta do Vite, só no desenvolvimento), sem versão corrigida em 2026-11-18.
