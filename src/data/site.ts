import { IMAGES, type SiteImage } from './images';

/**
 * Dados do site usados pela página E pelo SEO (scripts/seo.ts monta as meta tags,
 * o JSON-LD e o sitemap a partir daqui). Mudou aqui, muda nos dois lugares.
 */
export const SITE = {
  name: 'UNIKON',
  // Endereço final do site. Pode ser trocado na hora do build com SITE_URL=https://...
  url: 'https://www.unikon.com.br',
  title: 'UNIKON | Monitoramento de Alarmes e Câmeras 24 horas',
  description:
    'Monitoramento de alarmes e câmeras de segurança 24h, 7 dias por semana, 365 dias por ano. Rastreadores e telefone via satélite SPOT. Peça seu orçamento.',
  locale: 'pt_BR',
  lang: 'pt-BR',
  themeColor: '#172433',
  // foto de compartilhamento (WhatsApp, Facebook…): versão de 1200px gerada por scripts/otimizar-imagens.mjs
  ogImage: '/img/otim/hero-cameras-1200.jpg',
  ogImageSize: [1200, 797] as const,
  // logo para o Google (quadrado, fundo branco, PNG), gerado por scripts/gerar-logo.mjs
  logo: '/marca/unikon-logo-quadrado.png',
  // Preencha para melhorar o SEO local (aparecer no Google Maps / "perto de mim"):
  address: null as null | { street: string; city: string; region: string; postalCode: string },
  areaServed: 'BR',
  sameAs: [] as string[], // Instagram, Facebook, Google Meu Negócio…
};

/**
 * Contatos ANTISPAM: ficam embaralhados no código (base64 de trás para frente) para que robôs que varrem sites atrás
 * de telefones e e-mails não achem nada. Não vão para o HTML nem para o SEO; na página só viram link quando uma pessoa
 * toca, passa o mouse, usa o teclado ou clica (ContactLink e RevealContacts em components/ui.tsx).
 *
 * Para trocar um contato, gere o valor novo com:
 *   node -e "console.log(Buffer.from('NOVO').toString('base64').split('').reverse().join(''))"
 */
const unveil = (s: string) => atob(s.split('').reverse().join(''));
const PHONE = '==QMyUTMzQzM4kTMxUTN'; // número com DDI, só dígitos
const PHONE_LABEL = '==QMyUTMtMDNzgjL5ASKxEDK';
const EMAIL_COMERCIAL = '=InYu02bj5ibvtWauVHQsFWajJXZt92Y';
const EMAIL_CONTATO = 'yJmLt92Yu42brlmb1B0b0FGdu92Y';

export type ContactKind = 'whatsapp' | 'tel' | 'email' | 'email-contato';

export const CONTACT = {
  phoneLabel: () => unveil(PHONE_LABEL),
  emailComercial: () => unveil(EMAIL_COMERCIAL),
  emailContato: () => unveil(EMAIL_CONTATO),
  /** Endereço do link; `text` é a mensagem já preenchida (WhatsApp) ou o corpo/assunto (e-mail). */
  href(kind: ContactKind, opts: { text?: string; subject?: string } = {}): string {
    const q = (o: Record<string, string | undefined>) => {
      const s = Object.entries(o).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join('&');
      return s ? `?${s}` : '';
    };
    if (kind === 'whatsapp') return `https://wa.me/${unveil(PHONE)}${q({ text: opts.text })}`;
    if (kind === 'tel') return `tel:+${unveil(PHONE)}`;
    const email = kind === 'email' ? unveil(EMAIL_COMERCIAL) : unveil(EMAIL_CONTATO);
    return `mailto:${email}${q({ subject: opts.subject, body: opts.text })}`;
  },
};

/** Títulos das seções: H1 (hero) e H2. Cada um tem um id usado como âncora, no menu e no SEO. */
export const SECTIONS = {
  hero: {
    id: 'inicio',
    title: 'Sua segurança monitorada 24 horas',
    text: 'Alarmes, câmeras e rastreamento via satélite com uma central que não para: 24 horas por dia, 7 dias por semana, 365 dias por ano. Sistemas modernos, simples de usar, e um projeto feito para o seu imóvel.',
  },
  services: {
    id: 'servicos',
    eyebrow: 'O que fazemos',
    title: 'Proteção completa, de ponta a ponta',
    text: 'Somos uma empresa tradicional no mercado de segurança eletrônica. Do projeto ao monitoramento, você tem uma solução só.',
  },
  how: { id: 'como-funciona', eyebrow: 'Como funciona', title: 'Do projeto à resposta, sem pontos cegos', text: '' },
  extras: {
    id: 'servicos-extras',
    eyebrow: 'Serviços extras',
    title: 'Vá além do alarme',
    text: 'Combine opcionais ao monitoramento básico e monte o nível de proteção ideal para sua casa ou empresa.',
  },
  products: {
    id: 'produtos',
    eyebrow: 'Equipamentos',
    title: 'Tecnologia que trabalha por você',
    text: 'Os sistemas de alarme e CFTV que utilizamos são modernos e muito fáceis de operar.',
  },
  spot: {
    id: 'satelite',
    eyebrow: 'Linha SPOT · via satélite',
    title: 'Seguro onde o celular não chega',
    text: 'Rastreadores e telefone via satélite para trilhas e passeios por terra, mar e ar. Acompanhe tudo pelo site ou pelo app SPOT.',
  },
  contact: {
    id: 'contato',
    eyebrow: 'Fale com a gente',
    title: 'Peça seu orçamento sem compromisso',
    text: 'Conte o que você precisa proteger. Nossa equipe monta a solução que melhor atende sua casa ou empresa.',
  },
} as const;

export const NAV = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#satelite', label: 'Rastreadores SPOT' },
  { href: '#contato', label: 'Contato' },
];

export type IconName = 'shield' | 'camera' | 'satellite' | 'car' | 'message' | 'signal' | 'clock' | 'eye' | 'report' | 'phone' | 'wifi' | 'bell';

export const SERVICES: { icon: IconName; title: string; text: string; bullets: string[]; image: SiteImage }[] = [
  {
    icon: 'shield',
    title: 'Monitoramento de alarmes',
    text: 'Nossa central recebe todos os sinais do seu alarme e age conforme os procedimentos que você define: avisa você e, quando preciso, aciona a polícia.',
    bullets: ['Arme, desarme, disparos e pânico', 'Teste automático a cada 24 h', 'Falha de energia e bateria fraca', 'Relatório completo pela internet'],
    image: IMAGES.kitAlarme,
  },
  {
    icon: 'camera',
    title: 'Câmeras e CFTV',
    text: 'Circuito fechado de TV com gravação 24 h, em alta definição, analógico ou IP. Veja as imagens no monitor, computador, celular ou tablet.',
    bullets: ['Gravação local e/ou remota', 'Cabo coaxial, rede local ou internet', 'Imagens ao vivo no seu celular', 'Visualização por disparo do alarme'],
    image: IMAGES.dvr,
  },
  {
    icon: 'satellite',
    title: 'Rastreamento via satélite',
    text: 'Rastreadores e telefone via satélite SPOT para trilhas e passeios por terra, mar e ar, onde o celular não pega.',
    bullets: ['Localização em tempo real no app', 'Avisos por SMS ou e-mail', 'Para barcos, jetskis, motos e veículos', 'Telefone satelital SpotPhone'],
    image: IMAGES.spot,
  },
];

export const EXTRAS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'car', title: 'Veículo de apoio', text: 'Viatura vai até o local e informa à central o grau da ocorrência.' },
  { icon: 'message', title: 'Avisos por SMS e e-mail', text: 'Saiba na hora quem armou ou desarmou, e quando houver disparo.' },
  { icon: 'signal', title: 'Módulo GPRS', text: 'Comunicação pelo chip celular como backup da linha e da internet.' },
  { icon: 'clock', title: 'Controle de horário', text: 'Alerta se o alarme for armado ou desarmado fora do horário combinado.' },
  { icon: 'eye', title: 'Imagens por disparo', text: 'A central vê as câmeras no momento do disparo e confirma a ocorrência.' },
  { icon: 'report', title: 'Relatório online', text: 'Todos os sinais e ações dos operadores, com login e senha só seus.' },
];

export const STEPS = [
  { title: 'Projeto sob medida', text: 'Cada projeto é elaborado para o seu caso: tecnologia, funcionalidade e design.' },
  { title: 'Instalação', text: 'Alarmes, sensores, câmeras e cerca elétrica instalados por equipe especializada.' },
  { title: 'Monitoramento 24 h', text: 'O sistema conversa com a central por linha, GPRS ou internet, com redundância.' },
  { title: 'Resposta imediata', text: 'A central segue seus procedimentos: avisa você, envia apoio ou aciona a polícia.' },
];

export const PRODUCTS: { title: string; text: string; image: SiteImage }[] = [
  { title: 'Centrais e teclados', text: 'Sistemas modernos e fáceis de operar.', image: IMAGES.teclado },
  { title: 'Sensores', text: 'Presença (infravermelho/micro-ondas), fumaça, temperatura e barreiras perimetrais.', image: IMAGES.kitAlarme },
  { title: 'Câmeras', text: 'Alta definição, analógicas e IP, internas e externas.', image: IMAGES.cameraBullet },
  { title: 'Gravadores digitais', text: 'CFTV com gravação 24 h, local ou remota.', image: IMAGES.dvr },
  { title: 'Cerca elétrica', text: 'Proteção perimetral integrada ao alarme.', image: IMAGES.cerca },
  { title: 'Comunicação GPRS', text: 'Módulos com chip celular para backup da comunicação.', image: IMAGES.modulo },
  { title: 'Acesso pelo celular', text: 'Veja suas câmeras em smartphones e tablets.', image: IMAGES.celular },
  { title: 'Projeto para o seu imóvel', text: 'Sensores, sirenes e sinalizadores posicionados para cobrir cada ambiente.', image: IMAGES.casa },
];

export const SPOT = [
  { title: 'SPOT Gen3', text: 'Rastreador satelital pessoal e para barcos, veículos, jetskis e quadriciclos. Crie sua aventura e compartilhe com amigos.', image: IMAGES.spot },
  { title: 'SPOT Trace', text: 'Avisa por SMS ou e-mail quando detecta movimento. Veja o caminho percorrido no site ou no app SPOT.', image: IMAGES.spotTrace },
  { title: 'SpotPhone', text: 'Telefone satelital para onde o celular não tem cobertura: barco, trilha, cruzeiro, motocicleta.', image: IMAGES.spotPhone },
];
