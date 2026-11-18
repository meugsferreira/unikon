import { useEffect, useRef, useState } from 'react';
import { ContactLink, Logo, WhatsAppIcon } from '../components/ui';
import { NAV } from '../data/site';

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu do celular: foco vai para o 1º item; Esc fecha e devolve o foco ao botão.
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid || open ? 'border-b border-white/10 bg-steel-950/95 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-18 items-center justify-between gap-6">
        <a href="#inicio" aria-label="UNIKON, página inicial" onClick={() => setOpen(false)}>
          <Logo light />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principal">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-steel-200 transition hover:bg-white/5 hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ContactLink to="tel" className="text-sm font-semibold text-white hover:underline">
            Ligar<span className="sr-only"> para a UNIKON</span>
          </ContactLink>
          <ContactLink to="whatsapp" className="btn btn-go py-2.5">
            <WhatsAppIcon /> Orçamento<span className="sr-only"> pelo WhatsApp</span>
          </ContactLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <nav ref={menuRef} id="menu-mobile" hidden={!open} className="container-x pb-6 lg:hidden" aria-label="Menu principal">
        <ul className="flex flex-col gap-1">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-steel-100 hover:bg-white/5">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <ContactLink to="whatsapp" className="btn btn-go mt-3 w-full">
          <WhatsAppIcon /> Pedir orçamento no WhatsApp
        </ContactLink>
      </nav>
    </header>
  );
}
