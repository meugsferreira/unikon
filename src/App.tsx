import { Contact, Footer, WhatsAppFab } from './sections/Contact';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Products, Satellite } from './sections/Products';
import { Extras, HowItWorks, Services } from './sections/Services';

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-steel-900 focus:shadow-xl"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Services />
        <HowItWorks />
        <Extras />
        <Products />
        <Satellite />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
