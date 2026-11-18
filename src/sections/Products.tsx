import { ContactLink, headingId, Img, SectionHeading, WhatsAppIcon } from '../components/ui';
import { PRODUCTS, SECTIONS, SPOT } from '../data/site';

export function Products() {
  return (
    <section id={SECTIONS.products.id} aria-labelledby={headingId(SECTIONS.products.id)} className="bg-steel-50 py-24 sm:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading section={SECTIONS.products} />
          <ContactLink to="whatsapp" className="btn btn-steel">
            <WhatsAppIcon className="h-5 w-5 text-emerald-700" /> Consultar modelos e preços<span className="sr-only"> pelo WhatsApp</span>
          </ContactLink>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <li key={p.title} className="group overflow-hidden rounded-2xl border border-steel-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-steel-900/10">
              <div className="aspect-[4/3] overflow-hidden bg-white p-5">
                <Img image={p.image} decorative className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t border-steel-100 p-5">
                <h3 className="font-semibold text-steel-900">{p.title}</h3>
                <p className="mt-1 text-sm text-steel-600">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Satellite() {
  return (
    <section id={SECTIONS.spot.id} aria-labelledby={headingId(SECTIONS.spot.id)} className="relative overflow-hidden bg-gradient-to-br from-steel-800 via-steel-900 to-[#0b2a4a] py-24 text-white sm:py-28">
      <div aria-hidden>
        <div className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-signal-400/20" />
        <div className="absolute -right-24 -top-24 h-[22rem] w-[22rem] rounded-full border border-signal-400/20" />
        <div className="absolute -right-8 -top-8 h-[14rem] w-[14rem] rounded-full border border-signal-400/30" />
      </div>

      <div className="container-x relative">
        <SectionHeading light section={SECTIONS.spot} />

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {SPOT.map((s) => (
            <li key={s.title} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-signal-400/50 hover:bg-white/10">
              <div className="h-52 overflow-hidden bg-white p-5">
                <Img image={s.image} decorative className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-200">{s.text}</p>
                <ContactLink
                  to="whatsapp"
                  text={`Olá! Tenho interesse no ${s.title}.`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-signal-400 underline-offset-4 hover:text-white hover:underline"
                >
                  Quero saber mais<span className="sr-only"> sobre o {s.title} pelo WhatsApp</span> <span aria-hidden>→</span>
                </ContactLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
