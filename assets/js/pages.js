/* Effets des pages intérieures de Red-Act.
   - Métiers : feuille de brouillon qui se raye au défilement (feuille-brouillon), scène « Du brouillon au texte » (rature) ;
   - Spécialités : séparation à faire glisser entre la tribune et la table (separation) ;
   - Références : grand filet de nuit, filtres par secteur gardés dans l'adresse (filet-references) ;
   - Contact : rendez-vous en trois étapes, récapitulatif, envoi qui file jusqu'au filet (noeud-vous). */
import { etat, boucle } from './socle/index.js?v=2';

const gsap = window.gsap;
const ST = () => window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initPages({ creerFilet, quandPret }) {
  carteNouee();
  carnet();
  feuilleBrouillon();
  sceneBrouillon();
  separation();
  references(creerFilet);
  rendezVous(creerFilet);
}

/* ---------- Contact : la carte de visite arrive nouée par le fil, puis se décolle légèrement au défilement ---------- */
function carteNouee() {
  const carte = $('.carte-visite'), fil = $('.contact-fil');
  if (!carte) return;
  if (etat.calme || !ST()) return;
  ST().create({ trigger: carte.closest('section'), start: 'top top', end: 'bottom top', scrub: 0.4,
    onUpdate: (s) => { carte.style.setProperty('--decolle', s.progress.toFixed(3)); if (fil) fil.style.setProperty('--decolle', s.progress.toFixed(3)); } });
}

/* ---------- Références : le Passeport Alsacien s'ouvre en éventail au défilement ---------- */
function carnet() {
  const c = $('.passeport-carnet');
  if (!c) return;
  if (etat.calme || !ST()) { c.style.setProperty('--ouvre', '1'); return; }
  ST().create({ trigger: c, start: 'top 85%', end: 'bottom 35%', scrub: 0.5, onUpdate: (s) => c.style.setProperty('--ouvre', s.progress.toFixed(3)) });
}

/* ---------- Métiers : la feuille de brouillon posée sur le bandeau se retire en se rayant ---------- */
function feuilleBrouillon() {
  const f = $('.feuille');
  if (!f) return;
  if (etat.calme || !ST()) { f.style.setProperty('--retrait', '1'); return; }
  ST().create({
    trigger: f.parentElement, start: 'top 70%', end: 'bottom 30%', scrub: 0.5,
    onUpdate: (s) => f.style.setProperty('--retrait', s.progress.toFixed(3)),
  });
}

/* ---------- Métiers : la feuille collante présente le jargon de chaque métier ; on le raye soi-même
   (glisser sur la phrase, souris ou doigt), sinon il se raye tout seul après un instant. La phrase claire s'écrit alors. ---------- */
function sceneBrouillon() {
  const feuille = $('[data-feuille]');
  if (!feuille) return;
  const num = $('[data-feuille-num]', feuille), nom = $('[data-feuille-nom]', feuille), jargon = $('[data-feuille-jargon]', feuille), clair = $('[data-feuille-clair]', feuille);
  const zone = $('[data-rayer]', feuille), trait = $('.rature path', feuille);
  const items = $$('[data-metier]');
  let courant = -1, minuterie = 0, prise = null;
  const L = 460;
  const rayer = () => { clearTimeout(minuterie); feuille.classList.remove('est-manuel'); trait.style.removeProperty('stroke-dashoffset'); feuille.classList.add('est-raye'); };
  const montrer = (i, anime = true) => {
    if (i === courant) return;
    courant = i;
    const li = items[i];
    num.textContent = String(i + 1).padStart(2, '0');
    nom.textContent = li.dataset.metierNom;
    jargon.textContent = li.dataset.metierJargon;
    clair.textContent = li.dataset.metierClair;
    items.forEach((x, k) => x.classList.toggle('est-courant', k === i));
    clearTimeout(minuterie);
    if (!anime || etat.calme) { rayer(); return; }
    feuille.classList.remove('est-raye', 'est-manuel');
    trait.style.removeProperty('stroke-dashoffset');
    minuterie = setTimeout(rayer, 1600);
  };
  /* Rayer à la main : la progression suit le pointeur sur la phrase ; aux trois quarts, c'est barré. */
  const progres = (e) => { const r = zone.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / Math.max(1, r.width))); };
  zone.addEventListener('pointerdown', (e) => {
    if (etat.calme || feuille.classList.contains('est-raye')) return;
    clearTimeout(minuterie);
    prise = { depart: progres(e) };
    feuille.classList.add('est-manuel');
    if (e.pointerType !== 'touch') zone.setPointerCapture(e.pointerId);
  });
  zone.addEventListener('pointermove', (e) => {
    if (!prise) return;
    const p = Math.max(0, progres(e) - prise.depart * 0.5);
    trait.style.strokeDashoffset = String(Math.round(L * (1 - p)));
    if (p > 0.72) { prise = null; rayer(); }
  });
  const lacher = () => { if (!prise) return; prise = null; minuterie = setTimeout(rayer, 700); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => zone.addEventListener(ev, lacher));
  /* Un simple toucher sur la phrase la raye aussi. */
  zone.addEventListener('click', () => { if (!feuille.classList.contains('est-raye')) rayer(); });

  /* Sur téléphone, chaque métier porte sa propre rature : jouée à son entrée, ou au toucher. */
  $$('[data-rayer-ligne]').forEach((p) => p.addEventListener('click', () => p.closest('[data-metier]').classList.add('est-raye')));

  montrer(0, false);
  if (etat.calme || !ST()) { items.forEach((li) => li.classList.add('est-raye')); return; }
  feuille.classList.remove('est-raye');
  items.forEach((li, i) => {
    ST().create({ trigger: li, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) montrer(i); } });
    ST().create({ trigger: li, start: 'top 60%', once: true, onEnter: () => setTimeout(() => li.classList.add('est-raye'), 900) });
  });
  ST().create({ trigger: feuille, start: 'top 80%', once: true, onEnter: () => { courant = -1; montrer(Math.max(0, items.findIndex((x) => x.classList.contains('est-courant')))); } });
}

/* ---------- Spécialités : séparation à faire glisser (souris, doigt, clavier) ---------- */
function separation() {
  const bloc = $('[data-separation]');
  if (!bloc) return;
  const poignee = $('[data-separation-poignee]', bloc);
  let part = 50, prise = false, auto = 0;
  const poser = (p) => {
    part = Math.max(15, Math.min(85, p));
    bloc.style.setProperty('--part', part.toFixed(2) + '%');
    bloc.style.setProperty('--part-n', part.toFixed(2));
    poignee.setAttribute('aria-valuenow', String(Math.round(part)));
    poignee.setAttribute('aria-valuetext', `${Math.round(part)} %`);
  };
  const depuisPointeur = (e) => { const r = bloc.getBoundingClientRect(); poser(((e.clientX - r.left) / r.width) * 100); };
  let x0 = 0, glisse = false;
  bloc.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || e.target.closest('.spe-carte, .monde-texte a')) return;
    prise = true; auto = 1; x0 = e.clientX; glisse = false;
    if (e.pointerType !== 'touch') bloc.setPointerCapture(e.pointerId);
    depuisPointeur(e);
  });
  bloc.addEventListener('pointermove', (e) => { if (prise) { if (Math.abs(e.clientX - x0) > 4) glisse = true; depuisPointeur(e); } });
  /* Un simple clic (ou Entrée) sur la poignée bascule d'un monde à l'autre. */
  poignee.addEventListener('click', (e) => {
    if (glisse) { glisse = false; return; }
    e.stopPropagation(); auto = 1;
    const de = part, vers = part > 50 ? 30 : 70;
    if (!gsap || etat.calme) { poser(vers); return; }
    const o = { p: de };
    gsap.to(o, { p: vers, duration: 0.6, ease: 'power2.inOut', onUpdate: () => poser(o.p) });
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => bloc.addEventListener(ev, () => { prise = false; }));
  poignee.addEventListener('keydown', (e) => {
    const pasK = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { poser(part - pasK); auto = 1; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { poser(part + pasK); auto = 1; e.preventDefault(); }
    if (e.key === 'Home') { poser(15); e.preventDefault(); }
    if (e.key === 'End') { poser(85); e.preventDefault(); }
  });
  /* Tant qu'on n'y a pas touché, la séparation suit le défilement : la tribune s'élargit, puis la table. */
  if (!etat.calme && ST()) {
    ST().create({ trigger: bloc, start: 'top top', end: 'bottom top', onUpdate: (s) => { if (!auto) poser(50 + Math.sin(s.progress * Math.PI) * 18); } });
  }
  poser(50);
}

/* ---------- Références : grand filet de nuit, secteurs qui s'allument, sélection dans l'adresse ---------- */
function references(creerFilet) {
  const scene = $('.tete-ref-scene');
  if (!scene) return;
  let secteur = new URLSearchParams(location.search).get('secteur') || '';
  const filet = creerFilet(scene, {
    ancre: [0.7, 0.46], deploieAuPret: true, gaucheLibre: 0.47, anneaux: [8, 14, 20, 26, 30], portee: 0.62, anneauNoms: 1, tousNoms: true, graine: 11,
    allume: (n) => (secteur ? n.secteur === secteur : true),
    etiquette: (n, i) => (secteur ? n.secteur === secteur : i % 4 === 0),
  });
  const boutons = $$('[data-filtre]');
  const articles = $$('[data-secteur]');
  const appliquer = (s, premier = false) => {
    secteur = s;
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === s)));
    articles.forEach((a) => a.classList.toggle('est-eteint', !!s && a.dataset.secteur !== s));
    const u = new URL(location.href);
    if (s) u.searchParams.set('secteur', s); else u.searchParams.delete('secteur');
    if (!premier) history.replaceState(history.state, '', u);
    if (filet) { filet.tirer(s ? (n) => n.secteur === s : null); if (!premier) filet.secousse(260); filet.redessiner(); }
  };
  boutons.forEach((b) => b.addEventListener('click', () => appliquer(b.dataset.filtre)));
  appliquer(secteur, true);
}

/* ---------- Contact : rendez-vous en trois étapes, récapitulatif, envoi noué au filet ---------- */
function rendezVous(creerFilet) {
  const f = $('form[data-etapes]');
  if (!f) return;
  const etapes = $$('[data-etape]', f), pastilles = $$('[data-etape-pastille]', f), cadre = $('[data-etapes-cadre]', f);
  const prec = $('[data-etape-prec]', f), suiv = $('[data-etape-suiv]', f), envoi = $('[data-envoi]', f);
  const annonce = $('[data-etape-annonce]', f), liste = $('[data-recap-liste]');
  const titres = pastilles.map((p) => p.textContent.replace(/^\s*\d\s*/, '').trim());
  let n = 1;
  const filetEl = $('.recap-filet');
  const filet = filetEl ? creerFilet(filetEl, { ancre: [0.5, 0.5], deploieAuPret: true, anneaux: [5, 9], portee: 0.55, graine: 3 }) : null;

  const recap = () => {
    const lignes = [];
    const b = f.querySelector('[name="besoin"]:checked'), p = f.querySelector('[name="profil"]:checked');
    if (b) lignes.push([titres[0], b.dataset.recap]);
    if (p) lignes.push([titres[1], p.dataset.recap]);
    const nom = f.elements.nom.value.trim(), st = f.elements.structure.value.trim();
    if (nom) lignes.push([titres[2], nom + (st ? ` · ${st}` : '')]);
    liste.replaceChildren(...(lignes.length ? lignes : [[titres[0], liste.dataset.vide]]).map(([dt, dd]) => {
      const d = document.createElement('div'); const t = document.createElement('dt'); const v = document.createElement('dd');
      t.textContent = dt; v.textContent = dd; d.append(t, v); return d;
    }));
  };
  liste.dataset.vide = (liste.querySelector('dd') || liste).textContent.trim();

  const aller = (k, focus = true) => {
    const avant = cadre.offsetHeight;
    n = k;
    etapes.forEach((e) => { e.hidden = +e.dataset.etape !== n; });
    pastilles.forEach((p) => { p.classList.toggle('est-active', +p.dataset.etapePastille === n); p.classList.toggle('est-faite', +p.dataset.etapePastille < n); });
    prec.hidden = n === 1; suiv.hidden = n === 3; envoi.hidden = n !== 3;
    annonce.textContent = `${n} / 3 : ${titres[n - 1]}`;
    if (gsap && !etat.calme) gsap.fromTo(cadre, { height: avant }, { height: cadre.scrollHeight, duration: 0.45, ease: 'power2.inOut', clearProps: 'height' });
    if (focus) { const premier = etapes[n - 1].querySelector('input, select, textarea'); premier && premier.focus({ preventScroll: true }); }
    recap();
  };
  const valide = () => {
    const e = etapes[n - 1], err = $('[data-erreur-etape]', e);
    const radios = $$('input[type="radio"]', e);
    if (radios.length && !radios.some((r) => r.checked)) { if (err) { err.hidden = false; err.setAttribute('role', 'alert'); } radios[0].focus(); return false; }
    if (err) err.hidden = true;
    return true;
  };
  suiv.addEventListener('click', () => { if (valide()) aller(n + 1); });
  prec.addEventListener('click', () => aller(n - 1));
  f.addEventListener('change', recap);
  f.addEventListener('input', recap);
  /* Choix déjà fait depuis un bouton contextuel (?besoin=…) : on passe directement à l'étape 2. */
  const deja = f.querySelector('[name="besoin"]:checked');
  aller(deja ? 2 : 1, false);

  /* Envoi validé par le socle (bouton désactivé) : la fiche se plie, se noue et file jusqu'au filet. */
  f.addEventListener('submit', () => setTimeout(() => {
    if (!envoi.disabled) return;
    const noue = $('[data-message-noue]', f);
    const fin = () => { noue.hidden = false; if (filet) filet.ajouter(noue.dataset.nom || 'Vous'); };
    if (!gsap || etat.calme || !filetEl) { fin(); return; }
    const r = cadre.getBoundingClientRect(), cible = filetEl.getBoundingClientRect();
    const fiche = document.createElement('div');
    fiche.className = 'fiche-envol'; fiche.setAttribute('aria-hidden', 'true'); fiche.setAttribute('data-audit-ignorer', '');
    fiche.innerHTML = '<svg viewBox="0 0 64 64" width="26" height="26"><use href="#noeud"/></svg>';
    Object.assign(fiche.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.append(fiche);
    const cx = cible.left + cible.width / 2, cy = cible.top + cible.height / 2;
    gsap.timeline({ onComplete: () => { fiche.remove(); fin(); } })
      .to(fiche, { height: Math.min(140, r.height), duration: 0.35, ease: 'power2.in' })
      .to(fiche, { width: 120, height: 80, left: r.left + r.width / 2 - 60, duration: 0.3, ease: 'power2.inOut' })
      .to(fiche, { borderRadius: '50%', width: 56, height: 56, left: cx - 28, top: cy - 28, duration: 0.6, ease: 'power3.inOut' })
      .to(fiche, { scale: 0.4, opacity: 0, duration: 0.2 });
  }, 0));
  $('[data-recommencer]', f).addEventListener('click', () => {
    f.reset(); $('[data-message-noue]', f).hidden = true; $('[data-message-envoi]', f).hidden = true;
    envoi.disabled = false; envoi.removeAttribute('aria-disabled'); aller(1);
  });
  $('[data-message-noue]', f).dataset.nom = 'Vous';
}
