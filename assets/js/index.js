// ========= helpers
document.documentElement.classList.add('js');
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// ========= navbar: drawer + scroll translúcido
const btnHamburger = qs('#btnHamburger');
const drawer = qs('#drawer');
btnHamburger?.addEventListener('click', () => drawer.classList.toggle('is-open'));
function smoothScrollTo(targetId) {
  const el = qs(targetId); if (!el) return;
  const nav = qs('.nav__wrap');
  const y = el.getBoundingClientRect().top + window.pageYOffset - (nav?.offsetHeight || 0) - 10;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
qsa('[data-scrollto]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault(); drawer?.classList.remove('is-open'); smoothScrollTo(href);
    }
  });
});
function setScrolled() { qs('.nav')?.classList.toggle('is-scrolled', window.scrollY > 10); }
setScrolled();
window.addEventListener('scroll', setScrolled);

/* ================== TRADUCCIÓN (Google Translate oculto) ================== */
(function () {
  const SUP = ['es', 'en', 'pt'];
  const langLabel = document.querySelector('#langLabel');
  const langToggleBtn = document.querySelector('#langToggle');
  const langMenu = document.querySelector('#langMenu');

  function ensureGTContainer() {
    let el = document.getElementById('gtEl');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gtEl';
      el.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;';
      document.body.appendChild(el);
    }
  }
  function hideGToolbar() {
    document.querySelectorAll('iframe.goog-te-banner-frame, .goog-te-banner-frame, #goog-gt-tt, .goog-tooltip, .goog-te-balloon-frame').forEach(n => n.remove());
    document.documentElement.style.top = '0px';
    document.body.style.top = '0px';
  }
  function setLabel(lng) { if (langLabel) langLabel.textContent = lng === 'es' ? 'ESP' : lng === 'en' ? 'ENG' : 'POR'; document.documentElement.lang = lng; }
  function setGTCookie(target) {
    const base = location.hostname.replace(/^www\./, '');
    const v = `/es/${target}`;
    const opts = 'path=/; max-age=31536000';
    document.cookie = `googtrans=${v}; ${opts}`;
    document.cookie = `googtrans=${v}; ${opts}; domain=${base}`;
    document.cookie = `googtrans=${v}; ${opts}; domain=.${base}`;
  }
  function clearGTCookie() {
    const base = location.hostname.replace(/^www\./, '');
    const opts = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `googtrans=; ${opts}`;
    document.cookie = `googtrans=; ${opts}; domain=${base}`;
    document.cookie = `googtrans=; ${opts}; domain=.${base}`;
  }

  window.doGTranslate = function (to, fromUser = false) {
    const lang = SUP.includes(to) ? to : 'es';
    setLabel(lang);
    localStorage.setItem('cabvine_lang', lang);

    if (lang === 'es') {
      clearGTCookie();
      setGTCookie('es');
      hideGToolbar();
      if (fromUser) location.reload();
      return;
    }

    const sel = document.querySelector('select.goog-te-combo');
    if (sel) {
      sel.value = lang;
      sel.dispatchEvent(new Event('change'));
      hideGToolbar();
      setTimeout(hideGToolbar, 50);
      setTimeout(hideGToolbar, 300);
      setTimeout(hideGToolbar, 1200);
    } else {
      setGTCookie(lang);
      location.reload();
    }
  };

  window.gteInit = function () {
    ensureGTContainer();
    new google.translate.TranslateElement({ pageLanguage: 'es', includedLanguages: 'en,pt', autoDisplay: false }, 'gtEl');
    hideGToolbar();

    const navLang = (navigator.language || 'es').slice(0, 2);
    const saved = localStorage.getItem('cabvine_lang') || (SUP.includes(navLang) ? navLang : 'es');
    setLabel(saved);

    if (saved === 'es') {
      clearGTCookie();
      setGTCookie('es');
      return;
    }

    const sel = document.querySelector('select.goog-te-combo');
    if (sel) {
      sel.value = saved;
      sel.dispatchEvent(new Event('change'));
      hideGToolbar();
    } else {
      setGTCookie(saved);
      location.reload();
    }
  };

  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=gteInit';
  document.head.appendChild(s);

  document.querySelectorAll('.lang__menu [data-lang]').forEach(i =>
    i.addEventListener('click', (e) => {
      const lng = e.currentTarget.getAttribute('data-lang');
      window.doGTranslate(lng, true);
      if (langMenu) langMenu.style.display = 'none';
      langToggleBtn?.setAttribute('aria-expanded', 'false');
    })
  );

  langToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = langMenu && langMenu.style.display === 'block';
    if (langMenu) langMenu.style.display = open ? 'none' : 'block';
    langToggleBtn.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('click', () => {
    if (langMenu) langMenu.style.display = 'none';
    langToggleBtn?.setAttribute('aria-expanded', 'false');
  });

  window.addEventListener('load', hideGToolbar);
})();

// ========= HERO simple slideshow
const heroSlides = qsa('.hero__slide');
let heroIdx = 0;
setInterval(() => {
  heroSlides[heroIdx]?.classList.remove('is-active');
  heroIdx = (heroIdx + 1) % heroSlides.length;
  heroSlides[heroIdx]?.classList.add('is-active');
}, 8000);

// ========= Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('is-in'), i * 60);
      io.unobserve(e.target);
    }
  });
}, { threshold: .15 });
qsa('[data-animate]').forEach(el => io.observe(el));

/* ======================= BRANDS ribbon ======================= */
const brandsViewport = qs('#brandsViewport');
const brandsTrack = qs('#brandsTrack');
const DEFAULT_BRANDS = [
  { name: 'Alandes', file: 'bodegaAlandes' },
  { name: 'Budeguer', file: 'bodegaBudeguer' },
  { name: 'Casa Vigil', file: 'bodegaCasaVigil' },
  { name: 'Cinco Sentidos', file: 'bodegaCincoSentidos' },
  { name: 'De Ángeles', file: 'bodegaDeAngeles' },
  { name: 'Familia Zaina', file: 'bodegaFamiliaZaina' },
  { name: 'Rolland', file: 'bodegaRolland' },
  { name: 'Sottano', file: 'bodegaSotano' },
  { name: 'Tempus Alba', file: 'bodegaTempusAlba' },
  { name: 'Tikal', file: 'bodegaTikal' },
  { name: 'Tupungato Divino', file: 'bodegaTupungatoDivino' }
];
let BRANDS = [...DEFAULT_BRANDS];

(async () => {
  try {
    const r = await fetch('assets/js/brands.json', { cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      if (Array.isArray(d) && d.length) BRANDS = d;
    }
  } catch {}
  renderBrandLogos();
  last = performance.now();
  requestAnimationFrame(tick);
  updateAlliesMetric();
})();

const EXT = ['.png','.PNG','.jpg','.JPG','.jpeg','.JPEG','.webp','.WEBP','.svg','.SVG'];
const BASES = ['assets/images/Bodegas y Afiliados/','assets/images/brands/svg/','assets/images/brands/'];
const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const variants = n => {
  const s = String(n || '');
  const base = [s, norm(s)];
  const x = new Set();
  base.forEach(v => {
    const v1 = v, v2 = v.replace(/\s+/g,'-'), v3 = v.replace(/\s+/g,'_'), v4 = v.replace(/\s+/g,'');
    [v1, v1.toLowerCase(), v1.toUpperCase(),
     v2, v2.toLowerCase(), v2.toUpperCase(),
     v3, v3.toLowerCase(), v3.toUpperCase(),
     v4, v4.toLowerCase(), v4.toUpperCase()].forEach(z => x.add(z));
  });
  return [...x];
};
const candidates = b => {
  const c = [];
  if (b.file) {
    const hasExt = /\.[a-z0-9]+$/i.test(b.file);
    if (hasExt) { BASES.forEach(base => c.push(`${base}${b.file}`)); }
    else { variants(b.file).forEach(fv => BASES.forEach(base => EXT.forEach(x => c.push(`${base}${fv}${x}`)))); }
  }
  variants(b.name || 'logo').forEach(nv => BASES.forEach(base => EXT.forEach(x => c.push(`${base}${nv}${x}`))));
  return [...new Set(c)];
};
function renderBrandLogos() {
  if (!brandsTrack) return;
  const all = [...BRANDS, ...BRANDS];
  brandsTrack.innerHTML = all.map(b =>
    `<div class="brandLogo"><img decoding="async" loading="lazy" data-candidates="${candidates(b).join('|')}" alt="${b.name || 'Partner'}"></div>`
  ).join('');
  hydrateLogos();
}
function hydrateLogos() {
  qsa('.brandLogo img', brandsTrack).forEach(img => {
    const list = (img.dataset.candidates || '').split('|').filter(Boolean);
    let i = 0;
    const tryNext = () => {
      if (i < list.length) { img.src = list[i++]; }
      else { img.onerror = null; img.src = 'assets/images/hero/heroPicture.jpg'; }
    };
    img.onerror = tryNext; tryNext();
  });
}
let speed = 0.025, offset = 0, last = performance.now();
function tick(now) {
  const dt = now - last; last = now;
  offset -= speed * dt;
  const first = brandsTrack?.firstElementChild;
  if (first) {
    const gap = parseFloat(getComputedStyle(brandsTrack).gap || 0);
    const w = first.getBoundingClientRect().width + gap;
    if (Math.abs(offset) >= w) {
      offset += w;
      brandsTrack.appendChild(brandsTrack.firstElementChild);
    }
    brandsTrack.style.transform = `translateX(${offset}px)`;
    highlightCenter();
  }
  requestAnimationFrame(tick);
}
function highlightCenter() {
  if (!brandsViewport) return;
  const vp = brandsViewport.getBoundingClientRect();
  const cx = vp.left + vp.width / 2;
  let best, dist = 1e9;
  qsa('.brandLogo', brandsTrack).forEach(el => {
    const r = el.getBoundingClientRect();
    const d = Math.abs((r.left + r.width / 2) - cx);
    if (d < dist) { dist = d; best = el; }
  });
  qsa('.brandLogo', brandsTrack).forEach(el => el.classList.toggle('is-center', el === best));
}
function updateAlliesMetric() {
  const el = qs('#mAllies'); if (el) el.textContent = String(BRANDS.length) + '+';
}

/* ====================== REVIEWS slider ====================== */
(function () {
  const INTERVAL_MS = 6000;
  const REVIEWS = [
    { name: "Bruno S.", title: "La mejor guía que podríamos haber pedido!", meta: "sept de 2025 • Pareja", body: "Florencia de CabVine fue absolutamente increíble durante nuestro viaje a Mendoza. Ella es súper cuidadosa con todos los detalles, siempre puntual, y realmente sabe sus cosas sobre las bodegas. Ella nos ayudó a armar el itinerario perfecto y nos dio grandes sugerencias para excursiones y restaurantes. Uno de los momentos más destacados fue definitivamente la gira de los Andes que organizó. Puente del Inca y Parque Aconcagua fueron increíbles, y su conocimiento lo hizo aún mejor. Sinceramente, no podríamos recomendar a nadie más! Si vas a Mendoza, reserva con Florencia a través de CabVine. ¡No te decepcionarás!" },
    { name: "Veronica G", title: "Excelente viaje a Mendoza", meta: "ago de 2025 • Familia", body: "Fue una experiencia maravillosa la atención del chófer muy buena y los llevó y nos mostró todo Mendoza ❤️❤️❤️❤️❤️ súper." },
    { name: "Juanma", title: "Paseo en la ciudad del Sol y del Vino", meta: "ago de 2025 • Pareja", body: "Paseamos por la Plaza Independencia, nos llevó al Cerro de la Gloria. Hermoso todo el día, lo recomiendo. ¡Qué lindo es el Parque San Martín!" },
    { name: "Caio B", title: "Servicio de chofer excepcional con Florencia en Mendoza", meta: "jul de 2025 • Familia", body: "Contratamos el servicio de chofer en Mendoza y fue una experiencia excelente. Florencia es una profesional increíble: siempre puntual, muy educada y con una amabilidad que hace todo el viaje más agradable. Además, su conocimiento de la región y sus recomendaciones hicieron que nuestra estadía fuera aún mejor. Sin duda volveríamos a contratar el servicio y lo recomendamos al 100%." },
    { name: "Cort B", title: "Servicio excepcional + flexibilidad!", meta: "jul de 2025 • Pareja", body: "Florencia no solo es súper conocedora y organizada en la construcción de una experiencia mendocina única sino que probablemente sea la persona más amable y acogedora que hayamos conocido. Mi esposa y yo estábamos pasando tres días en el centro de Mendoza y ella nos ayudó a construir un itinerario increíble. Organizó traslados desde el aeropuerto, hizo reservas en las mejores bodegas de la región e incluso nos consiguió mesa en un restaurante fuera de la ciudad. Cada mañana nos recogía con una sonrisa, compartía historias sobre la región y respondía a todas las preguntas. Tiene relaciones fantásticas con la gente de cada bodega, lo que ayudó a asegurar que tuviéramos una experiencia de primera. La recomendaremos a todos los amigos y familiares que viajen a Mendoza, y cuando regresemos será la primera persona a la que nos acerquemos. ¡Si se dirigen a esta hermosa ciudad, asegúrense de llamar a Florencia en CabVine Travel!" },
    { name: "Sebastián R", title: "El mejor momento, guía súper amable, vistas impresionantes.", meta: "nov de 2024 • Familia", body: "Hicimos un tour de montaña de un día completo: Parque Aconcagua, Puente del Inca y Uspallata. Realmente la pasamos muy bien; fueron muy amables con nosotros y el paisaje es inolvidable." }
  ];

  const viewport = document.getElementById('rvViewport');
  const track = document.getElementById('rvTrack');
  let current = 1, auto = null, perSlide = 3, fallbackTimer = null;
  const mql = window.matchMedia('(max-width:1100px)');
  mql.addEventListener?.('change', rebuild);
  window.addEventListener('resize', debounce(rebuild, 120));
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  const initials = (name) => {
    if (!name) return '';
    const parts = name.replace(/\s+/g, ' ').trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };
  function cardHTML(r) {
    return `
      <article class="rv-card">
        <header class="rv-card__head">
          <div class="rv-user">
            <div class="rv-avatar">${initials(r.name)}</div>
            <div>
              <div class="rv-name">${r.name}</div>
              <div class="rv-meta">${r.meta}</div>
            </div>
          </div>
          <img class="rv-logo--tiny" src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Tripadvisor">
        </header>
        <div class="rv-stars" aria-label="Valoración: 5 de 5">★★★★★</div>
        <h3 class="rv-title">${r.title}</h3>
        <p class="rv-body">${String(r.body).replace(/\n+/g, '<br><br>')}</p>
      </article>
    `;
  }
  function flagClamp(el) { const clipped = (el.scrollHeight - 1) > el.clientHeight; el.classList.toggle('is-clamped', clipped); }
  function flagAllClamps() { qsa('.rv-body', track).forEach(flagClamp); }

  function buildSlides() {
    if (!track) return;
    perSlide = mql.matches ? 1 : 3;
    let pages = Math.ceil(REVIEWS.length / perSlide);
    const slides = [];
    if (pages < 2) {
      const needed = perSlide * 2;
      while (REVIEWS.length < needed) {
        REVIEWS.push(...REVIEWS.slice(0, Math.min(REVIEWS.length, needed - REVIEWS.length)));
      }
      pages = 2;
    }
    for (let p = 0; p < pages; p++) {
      let h = '';
      for (let i = 0; i < perSlide; i++) {
        const idx = (p * perSlide + i) % REVIEWS.length;
        h += cardHTML(REVIEWS[idx]);
      }
      slides.push(`<div class="rv-slide">${h}</div>`);
    }
    const first = slides[0], last = slides[slides.length - 1];
    track.innerHTML = [last, ...slides, first].join('');
    current = 1;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${current * 100}%)`;
    void track.offsetWidth;
    track.style.transition = '';
    requestAnimationFrame(flagAllClamps);
  }
  function onTransitionEnd() {
    clearTimeout(fallbackTimer);
    const total = qsa('.rv-slide', track).length;
    if (current === total - 1) {
      track.style.transition = 'none';
      current = 1;
      track.style.transform = `translateX(-${current * 100}%)`;
      void track.offsetWidth;
      track.style.transition = '';
      requestAnimationFrame(flagAllClamps);
    } else if (current === 0) {
      track.style.transition = 'none';
      current = total - 2;
      track.style.transform = `translateX(-${current * 100}%)`;
      void track.offsetWidth;
      track.style.transition = '';
      requestAnimationFrame(flagAllClamps);
    }
  }
  function next() {
    clearTimeout(fallbackTimer);
    current++;
    track.style.transform = `translateX(-${current * 100}%)`;
    fallbackTimer = setTimeout(onTransitionEnd, 800);
  }
  function start() { stop(); auto = setInterval(next, INTERVAL_MS); }
  function stop() { if (auto) { clearInterval(auto); auto = null; } clearTimeout(fallbackTimer); }
  function rebuild() { stop(); buildSlides(); requestAnimationFrame(flagAllClamps); start(); }

  track?.addEventListener('transitionend', onTransitionEnd);
  viewport?.addEventListener('mouseenter', stop);
  viewport?.addEventListener('mouseleave', start);
  buildSlides();
  start();
})();

/* ====================== MODAL ====================== */
const modal = qs('#modal');
const mMain = qs('#mMain');
const mThumbs = qs('#mThumbs');
const mPrev = qs('#mPrev');
const mNext = qs('#mNext');
const mKicker = qs('#mKicker');
const mTitle = qs('#mTitle');
const mPrice = qs('#mPrice');
const mCaption = qs('#mCaption');
const mPerks = qs('#mPerks');
const mItin = qs('#mItinerary');
const mExtrasWrap = qs('#mExtrasWrap');
const mExtras = qs('#mExtras');
const mSwitch = qs('#mSwitch');
const mRow = qs('#mRow');
const mInfo = qs('#mInfo');

let currentId = null;
let galleryIdx = 0;

function openDialog(dlg) {
  if (!dlg) return;
  dlg.setAttribute('open', '');
  dlg.classList.add('is-open');
  dlg.classList.remove('is-closing');
  document.body.style.overflow = 'hidden';
}
function closeDialog(dlg) {
  if (!dlg?.hasAttribute('open')) return;
  dlg.classList.add('is-closing');
  dlg.classList.remove('is-open');
  setTimeout(() => {
    dlg.removeAttribute('open');
    dlg.classList.remove('is-closing');
    document.body.style.overflow = '';
  }, 220);
}
qs('#mClose')?.addEventListener('click', () => closeDialog(modal));
modal?.addEventListener('click', (e) => {
  const boxEl = qs('.m__box');
  if (!boxEl) return;
  const r = boxEl.getBoundingClientRect();
  const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
  if (!inside) closeDialog(modal);
});
document.addEventListener('keydown', e => {
  if (!modal?.hasAttribute('open')) return;
  if (e.key === 'Escape') closeDialog(modal);
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});

const FALLBACKS = [
  'assets/images/hero/heroPicture.jpg',
  'assets/images/hero/heroPicture2.jpg',
  'assets/images/hero/heroPicture3.jpg',
  'assets/images/hero/heroPicture4.jpg'
];

const PKG_IMGS = {
  1: [
    'assets/images/Bodegas Lujan de cuyo/lujan1.jpg',
    'assets/images/Bodegas Lujan de cuyo/lujan2.jpg',
    'assets/images/Bodegas Lujan de cuyo/lujan3.jpg',
    'assets/images/Bodegas Lujan de cuyo/lujan4.jpg',
    'assets/images/Bodegas Lujan de cuyo/lujanMain.jpg'
  ],
  2: [
    'assets/images/Bodegas Maipú/Bodegas Maipú/maipu1.JPG',
    'assets/images/Bodegas Maipú/Bodegas Maipú/maipu2.JPG',
    'assets/images/Bodegas Maipú/Bodegas Maipú/maipu3.JPG',
    'assets/images/Bodegas Maipú/Bodegas Maipú/maipu4.JPG',
    'assets/images/Bodegas Maipú/Bodegas Maipú/maipuMain.JPG'
  ],
  3: [
    'assets/images/Bodegas Valle de Uco/Bodegas Valle de Uco/valleDeUco1.jpg',
    'assets/images/Bodegas Valle de Uco/Bodegas Valle de Uco/valleDeUco2.jpg',
    'assets/images/Bodegas Valle de Uco/Bodegas Valle de Uco/valleDeUco3.jpg',
    'assets/images/Bodegas Valle de Uco/Bodegas Valle de Uco/valleDeUcoMain.jpg'
  ],
  4: [
    'assets/images/Alta Montaña/altaMontaña1.jpg',
    'assets/images/Alta Montaña/altaMontaña2.png',
    'assets/images/Alta Montaña/altaMontaña3.jpg',
    'assets/images/Alta Montaña/altaMontaña4.jpg',
    'assets/images/Alta Montaña/altaMontaña5.jpg',
    'assets/images/Alta Montaña/altaMontañaMain.jpg'
  ],
  5: [
    'assets/images/Villavicencio/villavicencio1.jpg',
    'assets/images/Villavicencio/villavicencio2.jpg',
    'assets/images/Villavicencio/villavicencio3.jpg',
    'assets/images/Villavicencio/villavicencio4.png',
    'assets/images/Villavicencio/villavicencioMain.jpg'
  ],
  6: [
    'assets/images/City Tour/City Tour/cityTour1.jpg',
    'assets/images/City Tour/City Tour/cityTour2.jpg',
    'assets/images/City Tour/City Tour/cityTour3.jpg',
    'assets/images/City Tour/City Tour/cityTour4.jpg',
    'assets/images/City Tour/City Tour/cityTour5.jpg',
    'assets/images/City Tour/City Tour/cityTourMain.jpg'
  ],
  7: [
    'assets/images/Aventura/Aventura/aventura1.jpg',
    'assets/images/Aventura/Aventura/aventura2.jpg',
    'assets/images/Aventura/Aventura/aventura3.jpg',
    'assets/images/Aventura/Aventura/aventura4.jpg',
    'assets/images/Aventura/Aventura/aventuraMain.jpg'
  ]
};

const WINERIES = {
  1: { classic: ['Budeguer','Piatelli'], deluxe: ['De Ángeles','Sottano'] },
  2: { classic: ['Cinco Sentidos','Tempus Alba'], deluxe: ['Casa Vigil - El Enemigo','Alandes'] },
  3: { classic: ['Zaina','Tupungato Divino'], deluxe: ['Rolland','Tikal'] }
};

/* ======= CONTENIDO AMPLIADO ======= */
const CONTENT = {
  1: {
    title: 'Luján de Cuyo — Clásica / Deluxe',
    kicker: 'FULL DAY',
    variants: {
      classic: {
        price: 'USD 150', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`10:45 Salida del hotel
11:30 Visita y degustación en Bodega Budeguer
13:30 Almuerzo de pasos en Bodega Piatelli`,
        perks: ['Traslados privados','Degustaciones guiadas','Almuerzo de pasos']
      },
      deluxe: {
        price: 'USD 200', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`09:20 Salida del hotel
10:00 Visita y degustación en Bodega De Ángeles
13:00 Almuerzo de pasos en Bodega Sottano`,
        perks: ['Traslados privados','Degustaciones premium','Almuerzo de pasos']
      }
    }
  },
  2: {
    title: 'Maipú — Clásica / Deluxe',
    kicker: 'FULL DAY',
    variants: {
      classic: {
        price: 'USD 150', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`09:20 Salida del hotel
10:00 Visita y degustación en Bodega Cinco Sentidos
13:30 Almuerzo de pasos en Bodega Tempus Alba`,
        perks: ['Traslados privados','Degustaciones guiadas','Almuerzo de pasos']
      },
      deluxe: {
        price: 'USD 200', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`10:50 Salida del hotel
11:30 Visita y degustación en Casa Vigil – El Enemigo
13:30 Almuerzo de pasos en Bodega Alandes (Karim Mussi)`,
        perks: ['Traslados privados','Degustaciones premium','Almuerzo de pasos']
      }
    }
  },
  3: {
    title: 'Valle de Uco — Clásica / Deluxe',
    kicker: 'FULL DAY',
    variants: {
      classic: {
        price: 'USD 150', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`08:30 Salida del hotel
10:00 Visita y degustación en Bodega Zaina (Familia Zaina)
12:30 Almuerzo de pasos en Tupungato Divino`,
        perks: ['Traslados privados','Degustaciones guiadas','Almuerzo de pasos']
      },
      deluxe: {
        price: 'USD 200', caption: 'por persona en base doble (todo incluido)',
        itinerary:
`08:15 Salida aprox. del hotel
10:00 Visita y degustación en Bodega Rolland
12:00 Experiencia biodinámica con almuerzo en Bodega Tikal (Ernesto Catena)`,
        perks: ['Traslados privados','Degustaciones premium','Almuerzo con experiencia biodinámica']
      }
    }
  },
  4: {
    title: 'Cordillera de los Andes (Alta Montaña)',
    kicker: 'FULL DAY',
    single: {
      price: 'USD 125', caption: 'por persona en base doble (desde)',
      itinerary:
`08:30 Salida del hotel
Recorrido panorámico aprox. 400 km (ida y vuelta)
Cacheuta • Potrerillos • Valle de Uspallata • Polvaredas • Penitentes (centro de esquí) • Puente del Inca • Parque Provincial Aconcagua`,
      perks: ['Traslados privados','Paradas fotográficas'],
      extras: ['Ski day','Cristo Redentor (según temporada/condiciones)']
    }
  },
  5: {
    title: 'Reserva Natural Villavicencio',
    kicker: 'HALF DAY',
    single: {
      price: 'USD 85', caption: 'por persona en base doble',
      itinerary:
`Recorrido panorámico aprox. 110 km (ida y vuelta)
Monumento Histórico Canota • Centro de Interpretación de la Reserva
Hotel Villavicencio + jardines y capilla (visita guiada)
Pequeña colación en el antiguo lobby del hotel antes del regreso`,
      perks: ['Traslados privados','Visita guiada','Colación incluida'],
      extras: ['Arborismo','Tirolesa']
    }
  },
  6: {
    title: 'City Tour Privado / Walking City Tour',
    kicker: 'HALF DAY',
    single: {
      price: 'USD 40', caption: 'City Tour privado (por persona en base doble)',
      itinerary:
`Recorrido por los principales atractivos:
Área Fundacional • Plazas (San Martín, Chile, España, Italia, Independencia)
Parque General San Martín (con pequeña colación) • Cerro de la Gloria (historia del monumento)`,
      perks: ['Traslados privados','Paradas fotográficas','Colación en Parque San Martín'],
      extras: [
        'Walking City Tour — USD 25 p/p (base doble)',
        'Ruta a pie: Plaza Independencia (encuentro) • Peatonal Sarmiento • Plaza España • Pasaje San Martín • Plaza San Martín • Av. Las Heras'
      ]
    }
  },
  7: {
    title: 'Experiencias de Aventura',
    kicker: 'MULTI',
    single: {
      price: 'USD 200', caption: 'por persona en base doble (según actividad)',
      itinerary:`Elegí tu experiencia (sujeta a disponibilidad y clima):`,
      perks: ['Traslados/vehículo de asistencia (según actividad)','Guía especializado'],
      extras: [
        'Travesía E-bikes en Potrerillos — USD 200 p/p: Cacheuta + Dique Potrerillos, vistas a Precordillera y Cordón del Plata. Adaptada al nivel, con vehículo de asistencia y paradas estratégicas.',
        'Paseo en bici por bodegas — USD 170 p/p: Chacras de Coria → visita Alta Vista Wines → Vistalba → Rincón Gieco con almuerzo descontracturado (snacks/salsas/sandwiches o picada). Incluye asistencia, pick-up y drop-off.',
        'Paseo en velero (Potrerillos) — USD 180 p/p: Bahías y parajes del dique, charla técnica de navegación, glosario, partes del buque, introducción a propulsión a vela. Servicio a bordo (vino/espumante + snack).',
        'Paseo en globo aerostático — USD 200 p/p: Zona de Junín. Charla informativa y vuelo de ~45 min con vistas de viñedos y olivares.'
      ]
    }
  }
};

function lineBreaks(t) { return String(t || '').trim().replace(/\n{2,}/g, '\n\n').replace(/\n/g, '<br>'); }
function boldWineries(html, names = []) {
  if (!names?.length) return html;
  let out = html;
  names.forEach(name => {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const anyRe = new RegExp(`\\b(?:Bodega\\s+)?${esc}\\b`, 'gi');
    out = out.replace(anyRe, `<strong>${name}</strong>`);
  });
  return out;
}
function renderPerks(perks) {
  const labels = Array.from(new Set(perks));
  mPerks.innerHTML = labels.map(l => `<span class="mperk">${l}</span>`).join('');
}
function toggleSwitch(show) {
  mSwitch.hidden = !show;
  mSwitch.style.display = show ? 'inline-grid' : 'none';
  mRow.classList.toggle('no-switch', !show);
}
function applyData(data, namesForBold = []) {
  qs('.m__amount', mPrice).textContent = data?.price || 'USD';
  mCaption.textContent = data?.caption || '';
  const textHTML = lineBreaks(data?.itinerary || '');
  mItin.innerHTML = boldWineries(textHTML, namesForBold);
  renderPerks(data?.perks || []);
  const hasExtras = Array.isArray(data?.extras) && data.extras.length > 0;
  mExtrasWrap.hidden = !hasExtras;
  mExtrasWrap.style.display = hasExtras ? 'grid' : 'none';
  mExtras.innerHTML = hasExtras ? data.extras.map(x => `<li>${x}</li>`).join('') : '';
  mInfo.animate([{ opacity: .7, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' });
}

function positionSwitchThumb() {
  const active = qs('.m__opt.is-active', mSwitch);
  const thumb = qs('.m__switchThumb', mSwitch);
  if (!active || !thumb) return;
  thumb.style.width = `${active.offsetWidth}px`;
  thumb.style.transform = `translateX(${active.offsetLeft}px)`;
}
function setActiveVariant(btn, id) {
  qsa('.m__opt', mSwitch).forEach(b => b.classList.toggle('is-active', b === btn));
  const sel = btn.dataset.variant;
  applyData(CONTENT[id].variants[sel], WINERIES[id]?.[sel] || []);
  requestAnimationFrame(positionSwitchThumb);
}

function buildThumbs(imgs) {
  mThumbs.innerHTML = imgs.map((src, i) =>
    `<button class="m__thumb ${i === 0 ? 'is-active' : ''}" data-i="${i}" aria-label="Imagen ${i + 1}"><img alt=""></button>`
  ).join('');
  const thumbImgs = qsa('.m__thumb img', mThumbs);
  thumbImgs.forEach((imgEl, i) => loadWithFallback(imgEl, [imgs[i]]));
  qsa('.m__thumb', mThumbs).forEach(btn => {
    btn.addEventListener('click', () => setSlide(Number(btn.dataset.i)), { passive: true });
  });
}
function setSlide(i) {
  const imgs = (PKG_IMGS[currentId] || FALLBACKS);
  galleryIdx = (i + imgs.length) % imgs.length;
  loadWithFallback(mMain, [imgs[galleryIdx]]);
  qsa('.m__thumb', mThumbs).forEach(t => t.classList.toggle('is-active', Number(t.dataset.i) === galleryIdx));
  const pre = new Image();
  const nextIdx = (galleryIdx + 1) % imgs.length;
  pre.src = imgs[nextIdx];
}
function changeSlide(delta) { setSlide(galleryIdx + delta); }
mPrev?.addEventListener('click', () => changeSlide(-1));
mNext?.addEventListener('click', () => changeSlide(1));
(() => {
  let sx = 0, dx = 0;
  mMain?.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  mMain?.addEventListener('touchmove', e => { dx = e.touches[0].clientX - sx; }, { passive: true });
  mMain?.addEventListener('touchend', () => { if (Math.abs(dx) > 40) { changeSlide(dx > 0 ? -1 : 1); } }, { passive: true });
})();

function openModal(id) {
  try {
    currentId = id;
    const cfg = CONTENT[id];
    const imgs = (PKG_IMGS[id] || FALLBACKS).slice(0, 12);
    mTitle.textContent = cfg?.title || 'Experiencia';
    mKicker.textContent = cfg?.kicker || 'EXPERIENCIA';
    const hasVariants = !!cfg?.variants;
    toggleSwitch(hasVariants);
    if (hasVariants) {
      qsa('.m__opt', mSwitch).forEach(b => b.classList.toggle('is-active', b.dataset.variant === 'classic'));
      applyData(cfg.variants.classic, WINERIES[id]?.classic || []);
      requestAnimationFrame(positionSwitchThumb);
      qsa('.m__opt', mSwitch).forEach(btn => { btn.onclick = () => setActiveVariant(btn, id); });
      window.addEventListener('resize', positionSwitchThumb, { passive: true });
    } else {
      applyData(cfg?.single || {}, []);
    }
    galleryIdx = 0;
    buildThumbs(imgs);
    loadWithFallback(mMain, [imgs[0] || FALLBACKS[0]]);
    openDialog(modal);
  } catch (err) {
    console.error('Error al abrir modal:', err);
  }
}
qsa('[data-more]').forEach(btn => {
  btn.addEventListener('click', () => openModal(Number(btn.getAttribute('data-more'))));
});
document.addEventListener('click', (e) => {
  const t = e.target.closest?.('[data-more]');
  if (!t) return;
  const id = Number(t.getAttribute('data-more'));
  if (Number.isFinite(id)) openModal(id);
});

function pathVariants(p) {
  const variants = new Set();
  const push = s => s && variants.add(s);
  push(p);
  push(p.replace(/ñ/g,'n').replace(/Ñ/g,'N'));
  const deaccent = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  push(deaccent(p));
  push(p.replace(/\/{2,}/g,'/'));
  push(p.replace(/\.jpg$/i,'.JPG')); push(p.replace(/\.jpeg$/i,'.JPEG')); push(p.replace(/\.png$/i,'.PNG'));
  return [...variants];
}
function loadWithFallback(imgEl, paths) {
  const list = paths.flatMap(pathVariants);
  let i = 0;
  imgEl.onerror = () => {
    if (i < list.length - 1) { i++; imgEl.src = list[i]; }
    else { imgEl.onerror = null; imgEl.src = FALLBACKS[0]; }
  };
  imgEl.src = list[i];
}

/* ======= WINE MAP ======= */
(function(){
  const root = document.querySelector('#winemap');
  if (!root) return;
  const figure = root.querySelector('.wm-figure');
  const infoBox = root.querySelector('#wmInfo');
  const dots = [...root.querySelectorAll('.wm-dot')];

  const INFO = {
    norte: {
      title: "Norte mendocino",
      region: ["Zona urbana y rural (Las Heras, Guaymallén, Lavalle).","Estilo joven y frutado; también blancos y base para espumosos."],
      atracciones: ["Bodegas tradicionales y viñedos cercanos al Gran Mendoza","Acceso a precordillera y circuitos panorámicos cortos"]
    },
    lujan: {
      title: "Luján de Cuyo",
      region: ["Cuna del Malbec argentino.","Vinos elegantes, de taninos suaves."],
      atracciones: ["Bodegas boutique y tradicionales","Paisajes de viñedos con la cordillera de fondo"],
      bodegas: ["Budeguer", "Piatelli", "De Ángeles", "Sottano"]
    },
    maipu: {
      title: "Maipú",
      region: ["Zona histórica y fundacional.","Vinos con cuerpo, frutados."],
      atracciones: ["Museo del vino y bodegas centenarias","Ciclovías y recorridos entre olivares y viñedos"],
      bodegas: ["Cinco Sentidos", "Tempus Alba", "Casa Vigil – El Enemigo", "Alandes"]
    },
    uco: {
      title: "Valle de Uco",
      region: ["Región más joven y moderna.","Vinos frescos, con gran expresión del terroir."],
      atracciones: ["Enoturismo de alto nivel","Propuestas gourmet y experiencias inmersivas"],
      bodegas: ["Zaina (Familia Zaina)", "Tupungato Divino", "Bodega Rolland", "Tikal"]
    },
    sur: {
      title: "Sur mendocino",
      region: ["San Rafael y General Alvear.","Clima continental; tintos amables y blancos expresivos."],
      atracciones: ["Cañón del Atuel y río Diamante","Bodegas históricas y paisajes de oasis productivos"]
    }
  };

  let svg = root.querySelector('.wm-lines');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('wm-lines');
    figure.appendChild(svg);
  }

  dots.forEach(d=>{
    const id = d.dataset.id;
    if (!svg.querySelector(`.wm-line[data-id="${id}"]`)) {
      const p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.classList.add('wm-line');
      p.dataset.id = id;
      svg.appendChild(p);
    }
  });

  let activeId = null;

  function tpl(obj){
    const reg = (obj.region||[]).join('<br>');
    const atr = (obj.atracciones||[]).map(a => `<li>${a}</li>`).join('');
    const bod = obj.bodegas?.length
      ? `<div><strong>Bodegas que visitamos</strong><ul><li>${obj.bodegas.join('</li><li>')}</li></ul></div>`
      : '';
    return `
      <h3 class="wm-title">${obj.title}</h3>
      <div class="wm-body">
        <div><strong>Región & experiencia</strong><br>${reg}</div>
        <div><strong>Atracciones</strong><ul>${atr}</ul></div>
        ${bod}
      </div>`;
  }

  function setPanel(id){
    const data = INFO[id] || INFO.lujan;
    infoBox.innerHTML = tpl(data);
    infoBox.classList.remove('is-anim');
    requestAnimationFrame(()=>infoBox.classList.add('is-anim'));
  }

  function dotCenterPx(dot){
    const fr = figure.getBoundingClientRect();
    const dr = dot.getBoundingClientRect();
    const cx = (dr.left + dr.width/2) - fr.left;
    const cy = (dr.top + dr.height/2) - fr.top;
    return { cx, cy, w: fr.width, h: fr.height };
  }

  function drawLines(){
    const fr = figure.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');

    dots.forEach(dot=>{
      const id = dot.dataset.id;
      const path = svg.querySelector(`.wm-line[data-id="${id}"]`);
      if (!path) return;

      const { cx, cy, w, h } = dotCenterPx(dot);
      const endX = w - Math.max(8, w * 0.02);
      const endY = cy;
      const curve = (cy < h/2 ? -h*0.06 : h*0.06);
      const c1x = cx + (endX - cx) * 0.40;
      const c2x = cx + (endX - cx) * 0.85;
      const dAttr = `M ${cx} ${cy} C ${c1x} ${cy+curve}, ${c2x} ${cy+curve}, ${endX} ${endY}`;
      path.setAttribute('d', dAttr);
    });
  }

  function activate(id){
    activeId = id;
    setPanel(id);
    dots.forEach(d => d.classList.toggle('is-active', d.dataset.id===id));
    [...svg.querySelectorAll('.wm-line')].forEach(p=>{
      const on = p.dataset.id === id;
      p.classList.toggle('is-active', on);
      if (on){ p.classList.remove('draw'); void p.getBoundingClientRect(); p.classList.add('draw'); }
    });
  }

  dots.forEach(d=>{
    const id = d.dataset.id;
    d.addEventListener('mouseenter', ()=>activate(id));
    d.addEventListener('focus', ()=>activate(id));
    d.addEventListener('click', ()=>activate(id));
  });

  const redraw = ()=>{ drawLines(); if (activeId) activate(activeId); };
  window.addEventListener('resize', redraw, { passive:true });
  window.addEventListener('orientationchange', redraw, { passive:true });

  drawLines();
  activate('lujan');
})();
