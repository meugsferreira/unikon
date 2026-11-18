import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ImgHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { SiteImage } from '../data/images';
import IMAGE_SIZES from '../data/image-sizes.json';
import { CONTACT, type ContactKind, type IconName } from '../data/site';

/**
 * Endereço de um arquivo de public/ respeitando a pasta do site: "/" no domínio próprio, "/<repositório>/" no GitHub
 * Pages (BASE_PATH no build, ver vite.config.ts). Use sempre asset('/img/...') em vez de '/img/...' direto.
 */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

/**
 * Logotipo: UNIKON na fonte Nasalization, como arte vetorial em public/logo-unikon.svg
 * (gerada por scripts/gerar-logo.mjs). Enquanto o SVG não existir, mostra a palavra em texto.
 */
export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const [svgOk, setSvgOk] = useState(true);
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {svgOk ? (
        <img src={asset('/logo-unikon.svg')} alt="UNIKON" className="h-6 w-auto sm:h-7" onError={() => setSvgOk(false)} />
      ) : (
        <span className="font-display text-[28px] font-extrabold leading-none tracking-[0.06em] text-brand-500">UNIKON</span>
      )}
      <span className={`hidden border-l pl-2.5 font-display text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] sm:block ${light ? 'border-white/20 text-steel-100' : 'border-steel-300 text-steel-300'}`}>
        Segurança
        <br />
        eletrônica
      </span>
    </span>
  );
}

/** Larguras das versões otimizadas de cada foto (gerado por scripts/otimizar-imagens.mjs). */
const OPTIMIZED: Record<string, { w: number; h: number; widths: number[] }> = IMAGE_SIZES;

/** Padrão de `sizes` para fotos de cartão (4 colunas no computador, 2 no tablet, 1 no celular). */
const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw';

/**
 * Foto do site. Com as versões otimizadas (public/img/otim), vira um <picture>: o navegador escolhe AVIF → WebP → JPEG
 * e a largura certa para a tela (`sizes` diz quanto da tela a foto ocupa). Largura/altura reservam o espaço.
 * Reserva: se algo falhar, usa a foto original (public/img) e, por último, a da origem.
 */
export function Img({
  image,
  decorative = false,
  sizes = CARD_SIZES,
  className = '',
  ...rest
}: { image: SiteImage; decorative?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'srcSet'>) {
  const file = image.local.split('/').pop() ?? '';
  const opt = OPTIMIZED[file];
  const [step, setStep] = useState<'otim' | 'local' | 'remote'>(opt ? 'otim' : 'local');
  // otimizada → original local → origem (só se houver uma origem, sempre https)
  const next = () => setStep((s) => (s === 'otim' ? 'local' : image.remote ? 'remote' : s));
  const common = { alt: decorative ? '' : image.alt, loading: 'lazy' as const, decoding: 'async' as const, className, ...rest };

  if (step !== 'otim' || !opt) {
    const src = step === 'remote' && image.remote ? image.remote : asset(image.local);
    return <img src={src} onError={step === 'local' ? next : undefined} {...common} />;
  }
  const base = asset(`/img/otim/${file.replace(/\.[^.]+$/, '')}`);
  const set = (ext: string) => opt.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  return (
    // display: contents → o <picture> não interfere no layout; as classes continuam valendo no <img>
    <picture className="contents">
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`${base}-${opt.w}.jpg`} srcSet={set('jpg')} sizes={sizes} width={opt.w} height={opt.h} onError={next} {...common} />
    </picture>
  );
}

const PATHS: Record<IconName, string> = {
  shield: 'M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3z M9 12l2 2 4-4',
  camera: 'M3 8l11-4 2 5-11 4-2-5z M16 9l4 1 M8 13l1 5h3 M14 8.5a.5.5 0 100 1',
  satellite: 'M13 7l4 4 M9.5 9.5l5 5 M7 11l-3 3 3 3 3-3 M14 4l3-3 3 3-3 3 M5 21a4 4 0 014-4 M3 21a8 8 0 018-8',
  car: 'M5 17h14v-4l-2-5H7l-2 5v4z M7 17v2 M17 17v2 M5 13h14 M8 15h.01 M16 15h.01',
  message: 'M4 5h16v11H8l-4 4V5z M8 9h8 M8 12h5',
  signal: 'M4 20v-3 M9 20v-7 M14 20v-11 M19 20V5',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 9a3 3 0 100 6 3 3 0 000-6z',
  report: 'M6 3h9l4 4v14H6V3z M14 3v5h5 M9 13h7 M9 17h5',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  wifi: 'M2 9a15 15 0 0120 0 M5 12.5a10 10 0 0114 0 M8.5 16a5 5 0 017 0 M12 19.5h.01',
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4l2-2z M10 20a2 2 0 004 0',
};

export function Icon({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {PATHS[name].split(' M').map((d, i) => (
        <path key={i} d={i ? `M${d}` : d} />
      ))}
    </svg>
  );
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.5a9.5 9.5 0 01-4.8-1.3l-.3-.2-3.6.9 1-3.5-.2-.4A9.5 9.5 0 1112 21.5zM12 .5a11.5 11.5 0 00-9.9 17.3L.5 23.5l5.9-1.5A11.5 11.5 0 1012 .5z" />
    </svg>
  );
}

/** id do H2 de uma seção (usado no aria-labelledby da <section>). */
export const headingId = (sectionId: string) => `${sectionId}-titulo`;

/**
 * Título padrão de seção: chamada + H2 + texto. Recebe um item de SECTIONS
 * (os mesmos textos vão para o SEO).
 */
export function SectionHeading({
  section,
  light = false,
  center = false,
}: {
  section: { id: string; eyebrow?: string; title: string; text?: string };
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {section.eyebrow && <p className={light ? 'eyebrow-dark' : 'eyebrow'}>{section.eyebrow}</p>}
      <h2 id={headingId(section.id)} className={`h2 mt-3 ${light ? 'text-white' : 'text-steel-900'}`}>
        {section.title}
      </h2>
      {section.text && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-steel-200' : 'text-steel-600'}`}>{section.text}</p>}
    </div>
  );
}

/** Texto só para leitores de tela. */
export const SrOnly = ({ children }: { children: ReactNode }) => <span className="sr-only">{children}</span>;

/** Link que abre em nova aba e AVISA o leitor de tela disso. */
export function ExtLink({ children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <SrOnly> (abre em nova aba)</SrOnly>
    </a>
  );
}

/**
 * Link de contato ANTISPAM: no HTML o link aponta para #contato; o endereço real (wa.me, tel:, mailto:) só entra
 * quando uma pessoa passa o mouse, toca, foca pelo teclado ou clica. Robôs que só leem a página não acham o número.
 * WhatsApp abre em nova aba (e avisa o leitor de tela, como o ExtLink).
 */
export function ContactLink({
  to,
  text,
  subject,
  children,
  ...rest
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target'> & { to: ContactKind; text?: string; subject?: string }) {
  const [href, setHref] = useState<string>();
  const real = () => CONTACT.href(to, { text, subject });
  const arm = () => setHref(real());
  const external = to === 'whatsapp';
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href) return; // já tem o endereço real: o navegador segue o link normalmente
    e.preventDefault(); // ex.: leitor de tela que "clica" sem focar antes
    const url = real();
    setHref(url);
    if (external) window.open(url, '_blank', 'noopener');
    else window.location.href = url;
  };
  return (
    <a
      {...rest}
      href={href ?? '#contato'}
      onPointerEnter={arm}
      onTouchStart={arm}
      onFocus={arm}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <SrOnly> (abre em nova aba)</SrOnly>}
    </a>
  );
}

/**
 * Telefone e e-mails por escrito, só depois de um clique em "Mostrar telefone e e-mails" (robôs não clicam).
 * Depois do clique, o foco vai para o primeiro contato, para quem usa teclado ou leitor de tela.
 */
export function RevealContacts({ className = '', buttonClassName = '', linkClassName = '' }: { className?: string; buttonClassName?: string; linkClassName?: string }) {
  const [shown, setShown] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (shown) listRef.current?.querySelector('a')?.focus();
  }, [shown]);

  if (!shown) {
    return (
      <button type="button" className={buttonClassName} onClick={() => setShown(true)}>
        Mostrar telefone e e-mails
      </button>
    );
  }
  const items = [
    { label: 'Telefone e WhatsApp', value: CONTACT.phoneLabel(), href: CONTACT.href('tel'), num: true },
    { label: 'Comercial', value: CONTACT.emailComercial(), href: CONTACT.href('email') },
    { label: 'Contato', value: CONTACT.emailContato(), href: CONTACT.href('email-contato') },
  ];
  return (
    <ul ref={listRef} className={className}>
      {items.map((i) => (
        <li key={i.label}>
          <span className="block text-xs opacity-75">{i.label}</span>
          <a href={i.href} className={`${linkClassName} ${i.num ? 'tabular-nums' : ''}`}>
            {i.value}
          </a>
        </li>
      ))}
    </ul>
  );
}
