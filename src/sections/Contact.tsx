import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { ContactLink, headingId, Icon, Logo, RevealContacts, SectionHeading, WhatsAppIcon } from '../components/ui';
import { CONTACT, NAV, SECTIONS } from '../data/site';

const INTERESTS = ['Monitoramento de alarmes', 'Câmeras e CFTV', 'Cerca elétrica', 'Rastreadores e telefone via satélite (SPOT)', 'Outro assunto'];

/**
 * Formulário de orçamento. Por enquanto envia pelo WhatsApp (ou e-mail), já com a mensagem preenchida: nada vai para
 * um servidor, então robôs não conseguem mandar spam por ele. Ao trocar por envio pelo servidor, ver CLAUDE.md (antispam).
 */
export function Contact() {
  const [f, setF] = useState({ name: '', phone: '', email: '', interest: INTERESTS[0], kind: 'Residência', message: '' });
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const noteId = useId();

  const text = [
    `Olá, UNIKON! Quero um orçamento.`,
    `Nome: ${f.name}`,
    f.phone && `Telefone: ${f.phone}`,
    f.email && `E-mail: ${f.email}`,
    `Interesse: ${f.interest}`,
    `Imóvel: ${f.kind}`,
    f.message && `Mensagem: ${f.message}`,
  ]
    .filter(Boolean)
    .join('\n');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(CONTACT.href('whatsapp', { text }), '_blank', 'noopener');
    // anunciado pelo leitor de tela (região aria-live)
    setStatus('Abrimos o WhatsApp numa nova aba com a sua mensagem pronta. É só tocar em enviar.');
  };

  return (
    <section id={SECTIONS.contact.id} aria-labelledby={headingId(SECTIONS.contact.id)} className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading section={SECTIONS.contact} />
          <h3 className="sr-only">Canais de atendimento</h3>
          <ul className="mt-10 space-y-4">
            <li>
              <ContactLink
                to="whatsapp"
                className="group flex items-center gap-4 rounded-2xl border border-steel-200 p-5 transition hover:border-emerald-600/50 hover:bg-emerald-50/50"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white" aria-hidden>
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-steel-600">WhatsApp e telefone</span>
                  <span className="text-lg font-semibold text-steel-900">Conversar agora</span>
                </span>
              </ContactLink>
            </li>
            <li>
              <ContactLink to="email" className="flex items-center gap-4 rounded-2xl border border-steel-200 p-5 transition hover:border-steel-400 hover:bg-steel-50">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-steel-900 text-white" aria-hidden>
                  <Icon name="message" />
                </span>
                <span>
                  <span className="block text-sm text-steel-600">E-mail comercial</span>
                  <span className="text-lg font-semibold text-steel-900">Escrever para o comercial</span>
                </span>
              </ContactLink>
            </li>
            <li className="flex items-center gap-4 rounded-2xl bg-steel-50 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-signal-500 text-white" aria-hidden>
                <Icon name="clock" />
              </span>
              <span>
                <span className="block text-sm text-steel-600">Central de monitoramento</span>
                <span className="text-lg font-semibold text-steel-900">
                  <span aria-hidden>24 h · 7 dias · 365 dias</span>
                  <span className="sr-only">24 horas por dia, 7 dias por semana, 365 dias por ano</span>
                </span>
              </span>
            </li>
          </ul>
          <RevealContacts
            className="mt-5 space-y-3 text-steel-900"
            buttonClassName="mt-5 text-sm font-semibold text-steel-700 underline underline-offset-4 hover:text-steel-900"
            linkClassName="font-semibold hover:underline"
          />
        </div>

        <form onSubmit={submit} aria-labelledby="form-orcamento-titulo" aria-describedby={noteId} className="rounded-3xl border border-steel-200 bg-steel-50/60 p-6 shadow-sm sm:p-8">
          <h3 id="form-orcamento-titulo" className="font-display text-2xl font-bold uppercase tracking-tight text-steel-900">
            Formulário de orçamento
          </h3>
          <p className="mt-1 text-sm text-steel-600">
            Campos com <span aria-hidden="true">*</span>
            <span className="sr-only">asterisco</span> são obrigatórios.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nome" required className="sm:col-span-2">
              {(id) => <input id={id} className="input" required aria-required="true" value={f.name} onChange={set('name')} autoComplete="name" />}
            </Field>
            <Field label="Telefone / WhatsApp">
              {(id) => <input id={id} className="input" type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />}
            </Field>
            <Field label="E-mail">
              {(id) => <input id={id} className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" />}
            </Field>
            <Field label="Tenho interesse em">
              {(id) => (
                <select id={id} className="input" value={f.interest} onChange={set('interest')}>
                  {INTERESTS.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              )}
            </Field>

            {/* grupo de opções: fieldset + legend (o leitor de tela anuncia "Para, grupo") */}
            <fieldset>
              <legend className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-steel-600">Para</legend>
              <div className="flex gap-2">
                {['Residência', 'Empresa'].map((k) => (
                  <label
                    key={k}
                    className={`flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal-400 ${
                      f.kind === k ? 'border-steel-800 bg-steel-900 text-white' : 'border-steel-300 bg-white text-steel-700 hover:border-steel-400'
                    }`}
                  >
                    <input type="radio" className="sr-only" name="kind" value={k} checked={f.kind === k} onChange={set('kind')} />
                    {k}
                  </label>
                ))}
              </div>
            </fieldset>

            <Field label="Mensagem (opcional)" className="sm:col-span-2" hint="Ex.: casa térrea com 3 portas, quero câmeras na frente e nos fundos.">
              {(id, hintId) => <textarea id={id} aria-describedby={hintId} className="input min-h-28" value={f.message} onChange={set('message')} />}
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn btn-go h-12 flex-1 text-base">
              <WhatsAppIcon /> Enviar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
            </button>
            <ContactLink to="email" subject={`Orçamento: ${f.interest}`} text={text} className="btn btn-steel h-12">
              Enviar por e-mail
            </ContactLink>
          </div>
          <p id={noteId} className="mt-3 text-xs text-steel-600">
            Seus dados são usados só para responder este pedido. O envio abre o WhatsApp ou o seu e-mail com a mensagem já preenchida.
          </p>
          <p role="status" aria-live="polite" className={status ? 'mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900' : 'sr-only'}>
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

/** Rótulo ligado ao campo por id (htmlFor) e dica ligada por aria-describedby. */
function Field({
  label,
  required = false,
  hint,
  className = '',
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: (id: string, hintId?: string) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-dica` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-steel-600">
        {label}
        {required && (
          <span className="text-brand-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children(id, hintId)}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-steel-600">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-steel-950 py-14 text-steel-300">
      <div className="container-x grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">Monitoramento de alarmes e de câmeras de segurança, rastreadores e telefone via satélite.</p>
        </div>
        <nav aria-labelledby="rodape-nav">
          <h2 id="rodape-nav" className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Navegação
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Contato</h2>
          <div className="mt-4 space-y-3 text-sm">
            <ContactLink to="whatsapp" className="inline-flex items-center gap-2 font-semibold text-white hover:underline">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </ContactLink>
            <RevealContacts
              className="space-y-3"
              buttonClassName="block text-left underline underline-offset-4 hover:text-white"
              linkClassName="hover:text-white hover:underline"
            />
          </div>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-xs text-steel-400">
        <p>
          © {new Date().getFullYear()} UNIKON. Todos os direitos reservados.
        </p>
        <p>Fotos de câmeras: Miłosz Klinowski e Rishabh Varshney / Unsplash</p>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <ContactLink
      to="whatsapp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-900/30 transition hover:scale-110 hover:bg-emerald-800"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">Falar com a UNIKON no WhatsApp</span>
    </ContactLink>
  );
}
