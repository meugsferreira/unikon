import { ContactLink, Icon, Img, WhatsAppIcon } from '../components/ui';
import { IMAGES } from '../data/images';
import { SECTIONS } from '../data/site';

export function Hero() {
  return (
    <section id={SECTIONS.hero.id} aria-labelledby="inicio-titulo" className="metal relative isolate overflow-hidden pb-20 pt-32 text-white sm:pt-40 lg:pb-28">
      {/* foto de fundo com véu azul metálico */}
      <Img image={IMAGES.hero} decorative loading="eager" fetchPriority="high" sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-steel-950 via-steel-950/85 to-steel-900/40" />
      <div className="grid-lines absolute inset-0 -z-10" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-steel-100 backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
            </span>
            Central de monitoramento ativa agora
          </p>

          {/* H1 único da página; o texto vem de SECTIONS.hero (o mesmo do SEO) */}
          <h1 id="inicio-titulo" className="mt-6 font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl">
            {SECTIONS.hero.title.replace(/ 24 horas$/, '')} <span className="text-brand-400">24 horas.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-200">{SECTIONS.hero.text}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ContactLink to="whatsapp" className="btn btn-go h-13 px-7 text-base">
              <WhatsAppIcon /> Pedir orçamento<span className="sr-only"> pelo WhatsApp</span>
            </ContactLink>
            <a href="#servicos" className="btn btn-glass h-13 px-7 text-base">
              Conhecer os serviços
            </a>
          </div>

          {/* dt = rótulo, dd = valor; visualmente o valor vem em cima. `spoken` é o que o leitor de tela fala. */}
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
            {[
              { v: '24×7×365', spoken: '24 horas, 7 dias por semana, 365 dias por ano', l: 'Central ativa' },
              { v: 'HD', spoken: 'Alta definição', l: 'Analógico e IP' },
              { v: '3 vias', spoken: '3 vias de comunicação', l: 'Linha, GPRS, internet' },
            ].map((s) => (
              <div key={s.l} className="flex flex-col-reverse">
                <dt className="mt-1 text-[11px] uppercase leading-snug tracking-wide text-steel-300 sm:text-xs">{s.l}</dt>
                <dd className="font-display text-2xl font-bold whitespace-nowrap text-white sm:text-3xl">
                  <span aria-hidden>{s.v}</span>
                  <span className="sr-only">{s.spoken}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <MonitorPanel />
      </div>
    </section>
  );
}

/** Ilustração: painel da central de monitoramento com eventos típicos. */
function MonitorPanel() {
  const events: { icon: 'shield' | 'bell' | 'eye' | 'wifi'; text: string; place: string; time: string; tone: string }[] = [
    { icon: 'shield', text: 'Sistema armado', place: 'Residência · Zona Sul', time: '22:14', tone: 'text-signal-400' },
    { icon: 'wifi', text: 'Teste automático OK', place: 'Comércio · Centro', time: '22:10', tone: 'text-emerald-400' },
    { icon: 'bell', text: 'Disparo zona 3 verificado', place: 'Galpão · Zona Oeste', time: '21:57', tone: 'text-brand-400' },
    { icon: 'eye', text: 'Imagens confirmadas', place: 'Galpão · Zona Oeste', time: '21:58', tone: 'text-steel-200' },
  ];
  return (
    <div className="relative hidden lg:block" aria-hidden>
      <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-signal-500/10 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-steel-900/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-steel-200">Central UNIKON</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> online
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/5">
          <div className="relative aspect-video overflow-hidden bg-steel-950">
            <Img image={IMAGES.camera} decorative sizes="(min-width: 1024px) 280px, 50vw" className="h-full w-full object-cover opacity-80 grayscale" />
            <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white">CAM 01</span>
            <span className="absolute right-2 top-2 flex items-center gap-1 font-mono text-[10px] text-brand-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
              REC
            </span>
          </div>
          <div className="relative aspect-video overflow-hidden bg-steel-950">
            <Img image={IMAGES.hero} decorative sizes="(min-width: 1024px) 280px, 50vw" className="h-full w-full object-cover opacity-70 grayscale" />
            <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white">CAM 02</span>
          </div>
        </div>
        <ul className="divide-y divide-white/5">
          {events.map((e) => (
            <li key={e.text + e.time} className="flex items-center gap-3 px-5 py-3">
              <Icon name={e.icon} className={`h-5 w-5 shrink-0 ${e.tone}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{e.text}</span>
                <span className="text-xs text-steel-400">{e.place}</span>
              </span>
              <span className="font-mono text-xs tabular-nums text-steel-400">{e.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
