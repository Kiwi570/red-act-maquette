/* Bibliothèque d'effets prêts à l'emploi : testés avec le mode calme, le retour arrière, le téléphone et l'audit.
   Le projet les pose par des attributs dans ses pages et ne les réécrit pas ; il garde site.js pour ses effets propres.

   1. Apparitions au défilement, jouées une fois (comme data-anime, déclenchées par apparitions.js) :
      data-anime="lignes"   titre découpé en lignes qui montent de leur masque (accents et jambages jamais coupés)
      data-anime="mots"     texte qui arrive mot par mot
      data-anime="lettres"  titre qui arrive lettre par lettre, en rotation (hauteur figée pendant la découpe)
      data-anime="cascade"  enfants directs (cartes, liste) qui arrivent l'un après l'autre
      data-anime="rideau"   image (figure .media) révélée par un rideau, l'image se resserre
   2. Effets liés au défilement :
      data-fx="parallaxe"   image qui glisse dans son cadre (data-fx-force = déplacement en %, 10 par défaut ; bords jamais visibles)
      data-fx="zoom"        image qui se resserre pendant qu'elle entre dans l'écran
      data-fx="trace"       traits SVG qui se dessinent au défilement et finissent tracés en entier
      data-fx="galerie"     section épinglée dont la piste [data-galerie] défile à l'horizontale (761 px et plus)
      data-fx="onde"        image WebGL qui ondule selon la vitesse de défilement, loupe douce sous la souris (onde.js)
      data-fx="plein-ecran" image qui part d'une vignette et s'ouvre jusqu'au plein écran, dans un cadre collant
                            [data-collant] (position: sticky, jamais épinglé par GSAP : aucun saut, aucun flash) ;
                            mots [data-fx-ecarte="g|d"] qui s'écartent, légende [data-fx-apres] qui arrive à la fin
      data-fx="mots-geants" rangées de mots très grands [data-fx-rangee] qui filent en sens opposés au défilement
                            (data-sens="-1" pour l'autre sens) et s'inclinent selon la vitesse
      data-fx="vitesse"     image ou carte qui s'incline selon la vitesse de défilement, puis se redresse à l'arrêt
                            (data-fx-force : inclinaison maximale en degrés, 3 par défaut)
   3. Effets au survol, souris seulement (ils ne comptent jamais comme effets de section) :
      data-survol="magnetique"  bouton attiré par la souris
      data-survol="incline"     carte qui s'incline en 3D

   Les familles 1 et 2 reçoivent data-effet (s'il manque) : l'audit les compte comme effets de leur section.
   Les effets qui suivent la souris reçoivent data-souris : l'audit vérifie qu'ils se stabilisent quand elle s'arrête.
   Un effet présent dans le premier écran (trait, zoom) se joue après l'ouverture, dans le temps.
   Mode calme, secours, retour arrière, retour à la section : rien ne bouge à l'arrivée, tout est dans son état final.
   Sans JavaScript : contenu normal. Aucune lecture de mise en page pendant le défilement : les textes sont découpés
   à l'avance, pendant les temps morts, et rétablis quand le défilement s'arrête. */
import { html, etat, quand, stockage } from './etat.js?v=1';

const ENTREES = ['lignes', 'mots', 'lettres', 'cascade', 'rideau'];
const DECOUPES = '[data-anime="lignes"]:not(.vu), [data-anime="mots"]:not(.vu), [data-anime="lettres"]:not(.vu)';
const decoupes = new Set();
const sourisFine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
/* Nœuds « vivants » : un texte qui en contient n'est jamais découpé (le rétablir les remplacerait). Simple fondu. */
const VIVANTS = '[data-compteur], [data-anime], [data-effet], [data-survol], [data-fx], a, button, input, select, textarea, video, canvas';

/* ---------- 1. Apparitions : découpe à l'avance, rétablissement à l'arrêt du défilement ---------- */

let dernierDefilement = 0;
window.addEventListener('scroll', () => { dernierDefilement = performance.now(); }, { passive: true });
const quandImmobile = (fn) => {
  const essai = () => (performance.now() - dernierDefilement > 220 ? fn() : setTimeout(essai, 150));
  essai();
};
const temps = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60));

function decoupable(el) {
  return ['lignes', 'mots', 'lettres'].includes(el.dataset.anime) && window.SplitText && !el.querySelector(VIVANTS);
}

function decouper(el) {
  if (el.__decoupe || el.classList.contains('vu') || !decoupable(el)) return;
  const type = el.dataset.anime;
  let d = null;
  /* Lettres : hauteur figée pendant la découpe (des lettres en inline-block peuvent changer la hauteur d'un
     pixel ou d'une ligne) : la page ne bouge jamais, les positions des scènes restent justes. */
  if (type === 'lettres') el.style.height = el.offsetHeight + 'px';
  try {
    d = type === 'lignes' ? new window.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'fx-ligne' })
      : type === 'lettres' ? new window.SplitText(el, { type: 'words,chars', wordsClass: 'fx-mot-l', charsClass: 'fx-lettre' })
      : new window.SplitText(el, { type: 'words', wordsClass: 'fx-mot' });
  } catch (err) { el.style.height = ''; console.error('[effets] découpe', err); return; }
  const morceaux = (type === 'lignes' ? d.lines : type === 'lettres' ? d.chars : d.words) || [];
  const max = type === 'lettres' ? 48 : 14;
  morceaux.forEach((m, i) => m.style.setProperty('--i', Math.min(i, max)));
  el.__decoupe = d;
  el.__morceaux = morceaux;
  decoupes.add(el);
}

function defaire(el) {
  if (!el.__decoupe) return;
  try { el.__decoupe.revert(); } catch {}
  if (el.dataset.anime === 'lettres') el.style.height = '';
  el.__decoupe = null;
  el.__morceaux = null;
  decoupes.delete(el);
}

/* Découpe à l'avance, pendant les temps morts, de tous les textes encore à venir ; nouvelle découpe au redimensionnement. */
let attente = [];
function suivant() {
  const el = attente.shift();
  if (!el) return;
  decouper(el);
  temps(suivant);
}
export function decouperALAvance() {
  if (etat.calme) return;
  attente = [...document.querySelectorAll(DECOUPES)];
  temps(suivant);
  let t = 0, largeur = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (window.innerWidth === largeur) return;
      largeur = window.innerWidth;
      decoupes.forEach((el) => { if (!el.classList.contains('vu')) defaire(el); });
      attente = [...document.querySelectorAll(DECOUPES)];
      temps(suivant);
    }, 250);
  });
}

/* Appelé juste avant l'ajout de .vu. Retourne vrai si l'élément doit attendre deux images avant .vu
   (découpe faite à l'instant : l'état de départ doit être affiché une fois pour que la transition parte de lui). */
export function preparerEntree(el) {
  const type = el.dataset.anime;
  let frais = false;
  if (type === 'lignes' || type === 'mots' || type === 'lettres') {
    if (!el.__decoupe && decoupable(el)) decouper(el);
    if (el.__decoupe) {
      /* Fin de l'arrivée : dernier morceau arrivé (transitionend), avec un délai de secours, puis texte normal
         rétabli quand le défilement est arrêté (aucun saut : les masques ne changent pas la hauteur). */
      const dernier = el.__morceaux[el.__morceaux.length - 1];
      let fini = false;
      const finir = () => { if (fini) return; fini = true; quandImmobile(() => defaire(el)); };
      if (dernier) dernier.addEventListener('transitionend', (e) => { if (e.target === dernier && e.propertyName === 'transform') finir(); });
      setTimeout(finir, 4000);
      /* Toujours deux images avant .vu : l'état de départ des morceaux est affiché au moins une fois. */
      frais = true;
    }
  } else if (type === 'cascade') {
    const enfants = [...el.children];
    enfants.forEach((c, i) => c.style.setProperty('--i', Math.min(i, 10)));
    /* Après l'arrivée, la transition de la cascade s'efface : les transitions du projet reprennent la main. */
    const dernier = enfants[Math.min(enfants.length, 11) - 1];
    let fini = false;
    const finir = () => { if (!fini) { fini = true; el.classList.add('fx-fini'); } };
    if (dernier) dernier.addEventListener('transitionend', (e) => { if (e.target === dernier) finir(); });
    setTimeout(finir, 2600);
  } else if (type === 'rideau') {
    setTimeout(() => el.classList.add('fx-fini'), 2400);
  }
  return frais;
}

/* État final immédiat (retour arrière, mode calme, secours) : tout texte découpé redevient normal. */
export function finirEntrees() {
  attente = [];
  decoupes.forEach(defaire);
  document.querySelectorAll('[data-anime="cascade"], [data-anime="rideau"]').forEach((el) => el.classList.add('fx-fini'));
}

/* ---------- Repères lus par l'audit ---------- */

function marquer() {
  document.querySelectorAll(ENTREES.map((t) => `[data-anime="${t}"]`).join(',')).forEach((el) => {
    if (!el.dataset.effet) el.dataset.effet = el.dataset.anime;
  });
  document.querySelectorAll('[data-fx]').forEach((el) => { if (!el.dataset.effet) el.dataset.effet = el.dataset.fx; });
  document.querySelectorAll('[data-fx="plein-ecran"] > [data-collant]').forEach((c) => c.setAttribute('data-plein-ecran', ''));
  document.querySelectorAll('[data-fx="mots-geants"]').forEach((el) => { el.setAttribute('data-ruban', ''); el.setAttribute('data-visuel', ''); if (!el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true'); });
}

/* ---------- 2. Effets liés au défilement ---------- */

/* Arrivée sans voile ni intro (retour rechargé, retour à la section) : la page est déjà peinte, rien ne doit changer. */
function arriveeDejaPeinte() {
  if (etat.arrivee === 'retour') return true;
  try { return !!(stockage() && stockage().getItem('socle:calme-retour')); } catch { return false; }
}

function cibleImage(el) {
  return el.querySelector('[data-fx-cible]') || el.querySelector(':scope > picture, :scope > video, :scope > img, :scope > svg') || el.firstElementChild;
}

/* Élément déjà dans le premier écran au démarrage : joué dans le temps après l'ouverture (jamais bloqué). */
function premierEcran(el) {
  return el.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.85;
}

/* Joue une animation après l'ouverture (intro ou voile), ou la met directement dans son état final. */
function apresOuverture(tl) {
  quand('pret', ({ mode }) => {
    if (mode === 'jouee' || mode === 'voile') tl.play(0);
    else tl.progress(1);
  });
  quand('retour', () => tl.progress(1));
}

/* Défilement trop court pour atteindre la fin (élément en bas de page) : état final. */
const terminerSiCourt = (st) => { if (st.end - st.start < 2 && st.animation) st.animation.progress(1); };

function parallaxe(el, gsap) {
  const cible = cibleImage(el);
  if (!cible) return;
  const f = Math.min(25, Math.max(2, parseFloat(el.dataset.fxForce) || 10));
  /* Agrandie d'au moins son déplacement : le bord de l'image n'est jamais visible. */
  const s = 1 + (2 * f) / 100 + 0.02;
  gsap.fromTo(cible, { yPercent: -f, scale: s }, {
    yPercent: f, scale: s, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

function zoom(el, gsap) {
  const cible = cibleImage(el);
  if (!cible) return;
  const s = 1 + Math.min(0.4, Math.max(0.05, (parseFloat(el.dataset.fxForce) || 18) / 100));
  if (premierEcran(el)) {
    apresOuverture(gsap.fromTo(cible, { scale: s }, { scale: 1, duration: 1.6, ease: 'power3.out', paused: true }));
    return;
  }
  gsap.fromTo(cible, { scale: s }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: el, start: 'clamp(top bottom)', end: 'clamp(center center)', scrub: 0.4, onRefresh: terminerSiCourt },
  });
}

function trace(el, gsap) {
  const choisis = el.querySelectorAll('[data-fx-trait]');
  /* Les traits déjà en pointillés gardent leurs pointillés : ils ne sont pas tracés. */
  const traits = [...(choisis.length ? choisis : el.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect'))]
    .filter((t) => { const s = getComputedStyle(t); return s.stroke && s.stroke !== 'none' && (!s.strokeDasharray || s.strokeDasharray === 'none'); });
  if (!traits.length) return;
  /* Longueur 1, trou un peu plus long que le trait : aucun point visible au départ, même avec des bouts arrondis. */
  traits.forEach((t) => {
    t.setAttribute('pathLength', '1');
    t.style.strokeDasharray = '1 1.2';
    t.style.strokeDashoffset = '1.1';
  });
  const etapes = { strokeDashoffset: 0, ease: 'none', duration: 1, stagger: traits.length > 1 ? 0.6 / (traits.length - 1) : 0 };
  if (premierEcran(el)) {
    apresOuverture(gsap.timeline({ paused: true }).to(traits, { ...etapes, duration: 0.9, ease: 'power2.inOut' }));
    return;
  }
  /* clamp() : même en bas de page, le défilement atteint la fin, et les traits finissent tracés en entier. */
  gsap.timeline({ scrollTrigger: { trigger: el, start: 'clamp(top 85%)', end: 'clamp(bottom 45%)', scrub: 0.5, onRefresh: terminerSiCourt } })
    .to(traits, etapes);
}

function galerie(el, gsap) {
  const piste = el.querySelector('[data-galerie]');
  if (!piste) return;
  const barre = el.querySelector('[data-fx-progres]') || el.querySelector('.galerie-progres span');
  gsap.matchMedia().add('(min-width: 761px)', () => {
    /* Épinglée, la piste ne défile plus d'elle-même : elle sort de la tabulation et n'est plus une région
       (elle le redevient en mode calme, sans JavaScript et sur téléphone, où elle défile à l'horizontale). */
    const garde = ['tabindex', 'role', 'aria-label'].map((a) => [a, piste.getAttribute(a)]);
    garde.forEach(([a]) => piste.removeAttribute(a));
    /* Largeur utile sans la barre de défilement : la dernière carte s'arrête bien au bord. */
    const distance = () => Math.max(0, piste.scrollWidth - document.documentElement.clientWidth);
    const tw = gsap.fromTo(piste, { x: 0 }, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: el, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (st) => { if (barre) barre.style.transform = `scaleX(${st.progress})`; },
      },
    });
    /* Au clavier : une carte hors écran qui reçoit le focus est ramenée à l'écran. */
    const focus = (e) => {
      const st = tw.scrollTrigger, carte = [...piste.children].find((c) => c.contains(e.target));
      if (!st || !carte || !distance()) return;
      const p = Math.min(1, Math.max(0, (carte.offsetLeft - 40) / distance()));
      window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'instant' });
    };
    piste.addEventListener('focusin', focus);
    return () => {
      piste.removeEventListener('focusin', focus);
      garde.forEach(([a, v]) => { if (v !== null) piste.setAttribute(a, v); });
    };
  });
}

/* Image qui s'ouvre jusqu'au plein écran : la section est haute (--fx-longueur, 260svh), son cadre [data-collant]
   reste collé en haut de l'écran (sticky) pendant que la découpe s'ouvre. Rien n'est épinglé par GSAP. */
function pleinEcran(el, gsap) {
  const collant = el.querySelector(':scope > [data-collant]');
  const cadre = collant && (collant.querySelector('[data-fx-cible]') || collant.querySelector('.media'));
  if (!cadre) { console.warn('[effets] plein-ecran : il faut un cadre [data-collant] avec une figure .media'); return; }
  const depart = el.dataset.fxDepart || 'inset(24% 30% 24% 30% round 24px)';
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } });
  tl.fromTo(cadre, { clipPath: depart }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0);
  el.querySelectorAll('[data-fx-ecarte]').forEach((m) => {
    tl.fromTo(m, { xPercent: 0 }, { xPercent: m.dataset.fxEcarte === 'g' ? -45 : 45, ease: 'power1.in', duration: 1 }, 0);
  });
  const apres = el.querySelectorAll('[data-fx-apres]');
  if (apres.length) tl.fromTo(apres, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, stagger: 0.04 }, 0.78);
}

/* Vitesse de défilement lissée (px/s), partagée par mots-geants et vitesse : une seule écoute du défilement
   et une seule boucle, qui ne tourne que pendant le mouvement et s'arrête une fois tout redressé. */
const abonnes = new Set();
const vit = { v: 0, cible: 0, y: 0, t: 0, raf: 0, dernier: 0 };
function boucleVitesse(t) {
  const dt = Math.min(0.05, vit.dernier ? (t - vit.dernier) / 1000 : 1 / 60);
  vit.dernier = t;
  vit.cible *= Math.exp(-dt * 8);
  vit.v += (vit.cible - vit.v) * (1 - Math.exp(-dt * 10));
  const fini = Math.abs(vit.v) < 2 && Math.abs(vit.cible) < 2;
  if (fini) vit.v = 0;
  abonnes.forEach((f) => f(vit.v));
  vit.raf = fini ? 0 : requestAnimationFrame(boucleVitesse);
  if (fini) vit.dernier = 0;
}
function suivreVitesse(f) {
  if (!abonnes.size) {
    vit.y = window.scrollY; vit.t = performance.now();
    window.addEventListener('scroll', () => {
      const t = performance.now(), dt = Math.max(8, t - vit.t);
      vit.cible = Math.max(-4000, Math.min(4000, ((window.scrollY - vit.y) / dt) * 1000));
      vit.y = window.scrollY; vit.t = t;
      /* Saut d'ancre ou retour à une section : ce n'est pas une vitesse. */
      if (Math.abs(vit.cible) >= 4000) vit.cible = 0;
      if (!vit.raf) vit.raf = requestAnimationFrame(boucleVitesse);
    }, { passive: true });
  }
  abonnes.add(f);
}

function motsGeants(el, gsap) {
  const rangees = [...el.querySelectorAll('[data-fx-rangee]')];
  if (!rangees.length) return;
  const course = Math.min(45, Math.max(10, parseFloat(el.dataset.fxForce) || 25));
  rangees.forEach((r) => {
    /* Assez de mots pour ne jamais laisser de vide au bout de la course : le texte est répété au besoin. */
    const texte = r.innerHTML;
    for (let n = 0; n < 6 && r.scrollWidth < el.clientWidth * (1 + course / 100) * 1.15; n++) r.insertAdjacentHTML('beforeend', ' ' + texte);
    const inverse = r.dataset.sens === '-1';
    gsap.fromTo(r, { xPercent: inverse ? -course : 0 }, {
      xPercent: inverse ? 0 : -course, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
    });
  });
  const incliner = rangees.map((r) => gsap.quickSetter(r, 'skewX', 'deg'));
  suivreVitesse((v) => { const k = Math.max(-10, Math.min(10, -v / 220)); incliner.forEach((f) => f(k)); });
}

function vitesse(els, gsap) {
  if (!els.length) return;
  const cibles = els.map((el) => ({ f: Math.min(8, Math.max(1, parseFloat(el.dataset.fxForce) || 3)), poser: gsap.quickSetter(el, 'skewY', 'deg'), vu: false, el }));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const c = cibles.find((x) => x.el === e.target); if (c) c.vu = e.isIntersecting; }), { rootMargin: '80px' });
  cibles.forEach((c) => io.observe(c.el));
  suivreVitesse((v) => {
    const k = Math.max(-1, Math.min(1, v / 1800));
    cibles.forEach((c) => { if (c.vu || v === 0) c.poser(+(k * c.f).toFixed(2)); });
  });
}

/* ---------- 3. Effets au survol (souris seulement) ---------- */

/* Préparés au premier survol, une fois l'élément arrivé : GSAP prend alors la main sur sa transformation
   (classe fx-survol : plus de transition CSS sur transform), sans figer une position de départ. */
function auPremierSurvol(el, monter) {
  let pret = null;
  el.addEventListener('pointerenter', () => {
    if (pret || el.closest('[data-anime]:not(.vu)')) return;
    el.classList.add('fx-survol');
    pret = monter();
  });
  return (fn) => (...a) => pret && fn(pret, ...a);
}

function survol(gsap) {
  if (!sourisFine()) return;
  document.querySelectorAll('[data-survol="magnetique"]').forEach((el) => {
    el.dataset.souris = '';
    const avec = auPremierSurvol(el, () => ({
      x: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' }),
    }));
    let raf = 0, dernier = null;
    el.addEventListener('pointermove', avec((q, e) => {
      dernier = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        q.x((dernier.clientX - r.left - r.width / 2) * 0.28);
        q.y((dernier.clientY - r.top - r.height / 2) * 0.36);
      });
    }));
    el.addEventListener('pointerleave', avec((q) => { cancelAnimationFrame(raf); raf = 0; q.x(0); q.y(0); }));
  });
  document.querySelectorAll('[data-survol="incline"]').forEach((el) => {
    el.dataset.souris = '';
    const max = parseFloat(el.dataset.survolForce) || 7;
    const avec = auPremierSurvol(el, () => {
      gsap.set(el, { transformPerspective: 900 });
      return {
        rx: gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' }),
        ry: gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' }),
      };
    });
    let raf = 0, dernier = null;
    el.addEventListener('pointermove', avec((q, e) => {
      dernier = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = (dernier.clientX - r.left) / r.width - 0.5, py = (dernier.clientY - r.top) / r.height - 0.5;
        q.ry(px * max * 2); q.rx(-py * max * 2);
      });
    }));
    el.addEventListener('pointerleave', avec((q) => { cancelAnimationFrame(raf); raf = 0; q.rx(0); q.ry(0); }));
  });
}

/* ---------- Démarrage (appelé par le socle avant la préparation du projet) ---------- */

/* Retourne une promesse « effets prêts » (shaders compilés, textures envoyées), attendue par l'ouverture. */
export function initEffets() {
  marquer();
  if (etat.calme || html.classList.contains('secours')) return Promise.resolve();
  const gsap = window.gsap;
  if (!gsap || !window.ScrollTrigger) return Promise.resolve();
  const faire = (sel, fn) => document.querySelectorAll(sel).forEach((el) => { try { fn(el, gsap); } catch (err) { console.error('[effets]', sel, err); } });
  /* Page déjà peinte à l'arrivée : ni trait caché, ni image agrandie d'un coup. */
  if (!arriveeDejaPeinte()) {
    faire('[data-fx="parallaxe"]', parallaxe);
    faire('[data-fx="zoom"]', zoom);
    faire('[data-fx="trace"]', trace);
  }
  faire('[data-fx="galerie"]', galerie);
  faire('[data-fx="plein-ecran"]', pleinEcran);
  faire('[data-fx="mots-geants"]', motsGeants);
  try { vitesse([...document.querySelectorAll('[data-fx="vitesse"]')], gsap); } catch (err) { console.error('[effets] vitesse', err); }
  try { survol(gsap); } catch (err) { console.error('[effets] survol', err); }
  if (document.querySelector('[data-fx="onde"]')) {
    return import('./onde.js?v=1').then((m) => m.initOnde()).catch((err) => console.error('[effets] onde', err));
  }
  return Promise.resolve();
}
