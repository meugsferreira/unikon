import { headingId, Icon, Img, SectionHeading } from '../components/ui';
import { EXTRAS, SECTIONS, SERVICES, STEPS } from '../data/site';

export function Services() {
  return (
    <section id={SECTIONS.services.id} aria-labelledby={headingId(SECTIONS.services.id)} className="bg-steel-50 py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading section={SECTIONS.services} />

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="flex">
            <article
              aria-labelledby={`servico-${i}`}
              className="group flex w-full flex-col overflow-hidden rounded-2xl border border-steel-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-steel-300 hover:shadow-xl hover:shadow-steel-900/10"
            >
              <div className="relative h-44 overflow-hidden bg-white">
                <Img image={s.image} sizes="(min-width: 1024px) 33vw, 100vw" className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105" />
                <span className="absolute left-5 top-5 font-display text-5xl font-bold text-steel-100" aria-hidden>
                  0{i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col border-t border-steel-100 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-steel-900 text-white transition group-hover:bg-signal-500" aria-hidden>
                    <Icon name={s.icon} />
                  </span>
                  <h3 id={`servico-${i}`} className="font-display text-2xl font-bold uppercase tracking-tight text-steel-900">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-4 text-steel-600">{s.text}</p>
                <ul className="mt-5 space-y-2 text-sm text-steel-700">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id={SECTIONS.how.id} aria-labelledby={headingId(SECTIONS.how.id)} className="metal relative overflow-hidden py-24 text-white sm:py-28">
      <div className="grid-lines absolute inset-0" aria-hidden />
      <div className="container-x relative">
        <SectionHeading light section={SECTIONS.how} />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-steel-950/60 p-7 backdrop-blur">
              <span className="font-display text-5xl font-bold text-signal-400" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-300">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid items-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-7 lg:grid-cols-[1fr_auto]">
          <div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Comunicação com redundância</h3>
            <p className="mt-2 text-steel-300">
              Seu alarme fala com a nossa central por mais de um caminho. Se um cair, o outro assume.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3" aria-label="Formas de comunicação com a central">
            {(
              [
                ['phone', 'Linha telefônica'],
                ['signal', 'GPRS (chip celular)'],
                ['wifi', 'Internet banda larga'],
              ] as const
            ).map(([icon, label]) => (
              <li key={label} className="flex items-center gap-2 rounded-lg border border-white/15 bg-steel-950/50 px-4 py-2.5 text-sm font-medium">
                <Icon name={icon} className="h-5 w-5 text-signal-400" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Extras() {
  return (
    <section id={SECTIONS.extras.id} aria-labelledby={headingId(SECTIONS.extras.id)} className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading section={SECTIONS.extras} />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {EXTRAS.map((e) => (
            <li key={e.title} className="group rounded-2xl border border-steel-200 p-6 transition hover:border-signal-500/40 hover:bg-steel-50">
              <Icon name={e.icon} className="h-8 w-8 text-steel-500 transition group-hover:text-signal-500" />
              <h3 className="mt-4 text-lg font-semibold text-steel-900">{e.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-steel-600">{e.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
