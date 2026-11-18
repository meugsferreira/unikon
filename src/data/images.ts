/**
 * Todas as imagens do site. `local` fica em public/img (baixado por
 * scripts/baixar-imagens.mjs no `npm run dev`/`build`); `remote` é a origem e
 * serve de reserva se o arquivo local não existir, SÓ quando é https.
 *
 * As fotos do site antigo (unikon.com.br só abre em http) não têm reserva: num site https o navegador bloquearia
 * a imagem http ("conteúdo misto") e mostraria o alerta de "não seguro". O 1º argumento de site() é usado pelo
 * baixar-imagens.mjs, na hora do build.
 */
export type SiteImage = { local: string; remote?: string; alt: string; credit?: string };

const site = (_origem: string, file: string, alt: string): SiteImage => ({
  local: `/img/${file}`,
  alt,
});

const unsplash = (id: string, file: string, alt: string, credit: string): SiteImage => ({
  local: `/img/${file}`,
  remote: `https://images.unsplash.com/${id}?fm=jpg&q=75&w=1800&auto=format&fit=crop`,
  alt,
  credit,
});

export const IMAGES = {
  // Fotos livres (Unsplash License)
  hero: unsplash('photo-1563920443079-783e5c786b83', 'hero-cameras.jpg', 'Duas câmeras de segurança instaladas em parede', 'Miłosz Klinowski / Unsplash'),
  camera: unsplash('photo-1474301105119-cdc36a303335', 'camera-externa.jpg', 'Câmera de segurança externa em foco', 'Rishabh Varshney / Unsplash'),

  // Fotos do site atual da UNIKON
  teclado: site('Produtos_files/images_(1).jpg', 'teclado-alarme.jpg', 'Teclados de central de alarme'),
  kitAlarme: site('Produtos_files/alarmes.jpg', 'kit-alarme.jpg', 'Central de alarme com sensores e controle'),
  celular: site('Produtos_files/Celular.jpg', 'app-celular.jpg', 'Câmeras visualizadas no celular'),
  cameraBullet: site('Produtos_files/Camera.jpg', 'camera-bullet.jpg', 'Câmera de segurança tipo bullet'),
  cerca: site('Produtos_files/Cerca_Eletrica_5966.jpg', 'cerca-eletrica.jpg', 'Cerca elétrica instalada em muro'),
  dvr: site('Produtos_files/images.jpg', 'dvr-cameras.jpg', 'Gravador digital e câmeras de CFTV'),
  modulo: site('Produtos_files/Nancomm.jpg', 'modulo-comunicacao.jpg', 'Módulo de comunicação GPRS para alarmes'),
  spot: site('Produtos_files/Spot.jpg', 'spot-gen3.jpg', 'Rastreador satelital SPOT'),
  spotPhone: site('index_files/SpotPhone2.jpg', 'spot-phone.jpg', 'Telefone satelital SpotPhone'),
  spotTrace: site('ProdutosSPOT_files/Trace.jpg', 'spot-trace.jpg', 'Rastreador SPOT Trace'),
  monitoramento: site('index_files/monitoramento.jpg', 'central-monitoramento.jpg', 'Central de monitoramento'),
  casa: site('index_files/alarmecasa.jpg', 'alarme-casa.jpg', 'Residência protegida por alarme'),
} satisfies Record<string, SiteImage>;
