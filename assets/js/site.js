/* Effets propres à Red-Act (direction « Red, le réseau »). Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets posée par attributs dans les pages.
   Effets du plan : intro (fil qui écrit Red-Act et se noue), filet, roue-metiers, titre-au-fil, titre-souple,
   fil conducteur (module de la bibliothèque), brouillon (Métiers), separation (Spécialités), filet-references,
   noeud-vous (Contact). Chaque effet propre porte data-effet="nom". */
import { demarrer, boucle, etat, versObjet, quand } from './socle/index.js?v=2';
import { init as filConducteur } from './modules/fil-conducteur.js?v=2';
import { initPages } from './pages.js?v=2';

const gsap = window.gsap;
const ST = () => window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const souris = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Tirage pseudo-aléatoire à graine fixe : le filet a toujours la même forme. */
function graine(n) { let s = n >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* ------------------------------------------------------------------------------------------------
   Filet : réseau de fils rouges noués, avec les vrais noms des références sur les nœuds.
   On attrape un nœud (souris ou doigt), on le tire, il garde son élan au lâcher et revient en place.
   Le défilement le fait onduler. Physique pilotée par le temps écoulé (dt). Exporté pour la page Références.
   ------------------------------------------------------------------------------------------------ */
export function creerFilet(scene, o = {}) {
  const canvas = $('canvas', scene);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const noms = (canvas.dataset.filet || '').split('|').filter(Boolean);
  const noeudEl = $('.filet-noeud', scene);
  const img = o.ancreImage ? $('img', scene) : null;
  const couleurs = () => {
    const cs = getComputedStyle(scene);
    return { fil: cs.getPropertyValue('--filet-fil').trim() || '#E23B2E', encre: cs.getPropertyValue('--filet-encre').trim() || '#1B1916', halo: cs.getPropertyValue('--filet-halo').trim() || '#F4EEE3' };
  };
  let C = couleurs();
  let W = 0, H = 0, dpr = 1, ax = 0, ay = 0, noeuds = [], liens = [], prise = null, dernierY = scrollY, depuis = 0;
  let deploye = etat.calme || etat.arrivee === 'retour';
  /* Filets des pages intérieures : ils se tendent quand la page est prête (le filet de l'accueil attend l'intro). */
  if (o.deploieAuPret) quandPret(() => { deploye = true; });
  const police = '600 12.5px "Inter Tight", Arial, sans-serif';

  /* Position de la bobine dans la photo (object-fit: cover et object-position lus une fois). */
  function placerAncre() {
    let fx = o.ancre ? o.ancre[0] : 0.5, fy = o.ancre ? o.ancre[1] : 0.5;
    if (img && img.naturalWidth) {
      const mobile = /-mobile-/.test(img.currentSrc || img.src);
      const [px, py] = mobile ? o.ancreMobile : o.ancreImage;
      const iw = img.naturalWidth, ih = img.naturalHeight, k = Math.max(W / iw, H / ih);
      const pos = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      const dx = (W - iw * k) * (pos[0] ?? 0.5), dy = (H - ih * k) * (pos[1] ?? 0.5);
      ax = Math.max(40, Math.min(W - 40, dx + px * iw * k)); ay = Math.max(40, Math.min(H - 40, dy + py * ih * k));
    } else { ax = W * fx; ay = H * fy; }
    if (noeudEl) { noeudEl.style.left = ax + 'px'; noeudEl.style.top = ay + 'px'; }
  }

  function construire() {
    const r = scene.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    if (!W || !H) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = police;
    C = couleurs();
    placerAncre();
    const rnd = graine(o.graine || 7);
    const S = Math.max(W, H) * (o.portee || 0.62);
    const anneaux = o.anneaux || [6, 10, 14, 18];
    noeuds = [{ x: ax, y: ay, rx: ax, ry: ay, vx: 0, vy: 0, fixe: true, anneau: 0, nom: '' }];
    liens = [];
    let iNom = 0;
    const parAnneau = [[0]];
    anneaux.forEach((n, a) => {
      const rayon = S * ((a + 1) / anneaux.length) * (0.92 + rnd() * 0.08);
      const dec = rnd() * Math.PI * 2, ids = [];
      for (let i = 0; i < n; i++) {
        const ang = dec + (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
        const rr = rayon * (0.86 + rnd() * 0.24);
        let x = ax + Math.cos(ang) * rr, y = ay + Math.sin(ang) * rr * 0.86;
        /* Zone laissée libre à gauche (titre de la page) sur grand écran. */
        if (o.gaucheLibre && W > 760 && x < W * o.gaucheLibre) x = W * o.gaucheLibre + rnd() * 40;
        const visible = x > 30 && x < W - 30 && y > 30 && y < H - 30;
        const brut = a >= (o.anneauNoms || 1) && visible && iNom < noms.length && (o.tousNoms || rnd() > 0.15) ? noms[iNom++] : '';
        const [nom, secteur = ''] = brut.split('~');
        noeuds.push({ x: deploye ? x : ax, y: deploye ? y : ay, rx: x, ry: y, ox: x, oy: y, vx: 0, vy: 0, fixe: false, anneau: a + 1, nom, ph: rnd() * 6.28, secteur });
        ids.push(noeuds.length - 1);
      }
      ids.forEach((id, i) => liens.push([id, ids[(i + 1) % ids.length]]));
      const prec = parAnneau[a];
      ids.forEach((id) => {
        const tri = prec.map((p) => [p, Math.hypot(noeuds[p].rx - noeuds[id].rx, noeuds[p].ry - noeuds[id].ry)]).sort((u, v) => u[1] - v[1]);
        liens.push([id, tri[0][0]]);
        if (tri[1] && rnd() > 0.45) liens.push([id, tri[1][0]]);
      });
      parAnneau.push(ids);
    });
    liens.forEach((l) => { const p = noeuds[l[0]], q = noeuds[l[1]]; l[2] = Math.hypot(p.rx - q.rx, p.ry - q.ry); });
    if (tire) appliquerTirer();
    dessiner(0);
  }

  function pas(dt, t) {
    const vy = scrollY - dernierY; dernierY = scrollY;
    const choc = Math.max(-40, Math.min(40, vy)) * 0.9;
    for (const n of noeuds) {
      if (n.fixe || n === prise) continue;
      const bx = Math.sin(t * 0.7 + n.ph) * 2.2, by = Math.cos(t * 0.55 + n.ph) * 2.2;
      const k = deploye ? 26 : 0;
      let fx = (n.rx + bx - n.x) * k, fy = (n.ry + by - n.y) * k;
      fy -= choc * n.anneau * 1.2;
      if (survol && n !== survol && survol.secteur && n.secteur === survol.secteur) { fx += (survol.x - n.x) * 3.5; fy += (survol.y - n.y) * 3.5; }
      n.vx += fx * dt; n.vy += fy * dt;
    }
    for (const [i, j, L] of liens) {
      const p = noeuds[i], q = noeuds[j];
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, f = (d - L) * 34 / d;
      if (!p.fixe && p !== prise) { p.vx += dx * f * dt; p.vy += dy * f * dt; }
      if (!q.fixe && q !== prise) { q.vx -= dx * f * dt; q.vy -= dy * f * dt; }
    }
    const amorti = Math.exp(-3.6 * dt);
    for (const n of noeuds) {
      if (n.fixe || n === prise) continue;
      n.vx *= amorti; n.vy *= amorti;
      n.x += n.vx * dt; n.y += n.vy * dt;
    }
  }

  function dessiner() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1.3; ctx.strokeStyle = C.fil; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    for (const [i, j] of liens) { const p = noeuds[i], q = noeuds[j]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
    ctx.stroke();
    if (survol) {
      ctx.lineWidth = 2.6; ctx.globalAlpha = 1; ctx.beginPath();
      for (const [i, j] of liens) { const p = noeuds[i], q = noeuds[j]; if (p === survol || q === survol || (survol.secteur && p.secteur === survol.secteur && q.secteur === survol.secteur)) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const allumeDe = (n) => (survol ? (n === survol || (survol.secteur && n.secteur === survol.secteur)) : (!o.allume || o.allume(n)));
    for (const n of noeuds) {
      if (n.fixe) continue;
      const allume = allumeDe(n);
      ctx.fillStyle = n.nom ? C.halo : C.fil;
      ctx.strokeStyle = C.fil; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.nom ? (allume ? 5.5 : 4) : 3, 0, 6.2832); ctx.fill(); if (n.nom) ctx.stroke();
    }
    ctx.font = police; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    let k = -1;
    const poses = [];
    const libre = (x, y, l) => poses.every((q) => x + l < q.x - 4 || x > q.x + q.l + 4 || Math.abs(y - q.y) > 15);
    for (const n of noeuds) {
      if (!n.nom) continue;
      k++;
      const allume = allumeDe(n);
      if (o.etiquette && !n.ajoute && !allume && !o.etiquette(n, k)) continue;
      if (o.etiquette && !n.ajoute && !survol && !o.etiquette(n, k)) continue;
      const l = ctx.measureText(n.nom).width;
      let x = n.x + 10 + l < W - 8 ? n.x + 10 : n.x - 10 - l;
      if (!libre(x, n.y, l)) { const autre = x === n.x + 10 ? n.x - 10 - l : n.x + 10; if (autre > 4 && autre + l < W - 4 && libre(autre, n.y, l)) x = autre; else if (n !== survol && !n.ajoute) continue; }
      poses.push({ x, y: n.y, l });
      ctx.globalAlpha = allume ? 1 : 0.35;
      ctx.lineWidth = 4; ctx.strokeStyle = C.halo; ctx.strokeText(n.nom, x, n.y);
      ctx.fillStyle = n.ajoute || n === survol ? C.fil : C.encre; ctx.fillText(n.nom, x, n.y);
    }
    ctx.globalAlpha = 1;
  }

  /* Prise à la main : nœud le plus proche (jusqu'à 90 px), élan gardé au lâcher. */
  let derniere = null;
  const point = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
  scene.addEventListener('pointerdown', (e) => {
    if (etat.calme || e.button > 0) return;
    const p = point(e);
    let best = null, bd = 90;
    for (const n of noeuds) { if (n.fixe) continue; const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; best = n; } }
    if (!best) return;
    prise = best; derniere = p; prise.vx = prise.vy = 0;
    if (e.pointerType !== 'touch') scene.setPointerCapture(e.pointerId);
    scene.classList.add('est-tire');
    if (o.prise) o.prise(best);
  });
  let survol = null, tire = null;
  if (souris) {
    scene.addEventListener('pointermove', (e) => {
      if (prise || etat.calme) return;
      const p = point(e);
      let best = null, bd = 28;
      for (const n of noeuds) { if (!n.nom) continue; const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; best = n; } }
      if (best !== survol) { survol = best; scene.classList.toggle('est-survole', !!best); if (o.survol) o.survol(best); }
    });
    scene.addEventListener('pointerleave', () => { survol = null; scene.classList.remove('est-survole'); if (o.survol) o.survol(null); });
  }
  function appliquerTirer() {
    for (const n of noeuds) {
      if (n.fixe) continue;
      const k = tire && tire(n) ? 0.72 : 1;
      n.rx = ax + (n.ox - ax) * k; n.ry = ay + (n.oy - ay) * k;
    }
  }
  scene.addEventListener('pointermove', (e) => {
    if (!prise) return;
    const p = point(e), dt = Math.max(0.008, (p.t - derniere.t) / 1000);
    prise.vx = (p.x - derniere.x) / dt; prise.vy = (p.y - derniere.y) / dt;
    prise.x = p.x; prise.y = p.y; derniere = p;
  });
  const lacher = () => {
    if (!prise) return;
    prise.vx = Math.max(-1600, Math.min(1600, prise.vx)); prise.vy = Math.max(-1600, Math.min(1600, prise.vy));
    prise = null; scene.classList.remove('est-tire');
  };
  scene.addEventListener('pointerup', lacher);
  scene.addEventListener('pointercancel', lacher);
  scene.addEventListener('lostpointercapture', lacher);

  let ro = 0;
  new ResizeObserver(() => { cancelAnimationFrame(ro); ro = requestAnimationFrame(() => { const w = W, h = H; const r = scene.getBoundingClientRect(); if (Math.round(r.width) !== w || Math.round(r.height) !== h) construire(); }); }).observe(scene);
  if (img && !img.complete) img.addEventListener('load', construire, { once: true });
  construire();
  boucle(canvas, (dt, t) => { if (dt) pas(Math.min(dt, 1 / 30), t); dessiner(); }, { lourde: true });

  return {
    deployer() { deploye = true; },
    etatFinal() { deploye = true; for (const n of noeuds) { n.x = n.rx; n.y = n.ry; n.vx = n.vy = 0; } dessiner(); },
    tirer(pred) { tire = pred; appliquerTirer(); },
    ajouter(nom) {
      const a = noeuds.length, ang = -Math.PI / 3, r = Math.min(W, H) * 0.3;
      const x = ax + Math.cos(ang) * r, y = ay + Math.sin(ang) * r;
      noeuds.push({ x: ax, y: ay, rx: x, ry: y, ox: x, oy: y, vx: 300, vy: -500, fixe: false, anneau: 1, nom, ajoute: true, ph: 0, secteur: '' });
      const tri = noeuds.slice(0, a).map((n, i) => [i, Math.hypot(n.rx - x, n.ry - y)]).sort((u, v) => u[1] - v[1]);
      [0, tri[0][0], tri[1] && tri[1][0]].filter((i) => i !== undefined).forEach((i) => { const q = noeuds[i]; liens.push([a, i, Math.hypot(q.rx - x, q.ry - y)]); });
      deploye = true;
      if (etat.calme) { const n = noeuds[a]; n.x = x; n.y = y; dessiner(); }
    },
    secousse(force = 600) { for (const n of noeuds) if (!n.fixe) { n.vx += (Math.random() - 0.5) * force; n.vy += (Math.random() - 0.5) * force; } },
    redessiner: () => dessiner(),
    noeuds: () => noeuds,
    ancre: () => ({ x: ax, y: ay }),
    construire,
  };
}

/* ------------------------------------------------------------------------------------------------
   Roue 3D des six métiers : tourne au défilement, à la main (élan, arrêt sur une carte) et aux flèches.
   Les cartes de dos ou de profil sont cachées et sortent de la tabulation.
   ------------------------------------------------------------------------------------------------ */
function roue() {
  const sec = $('.roue');
  if (!sec || etat.calme || !ST()) return;
  const anneau = $('[data-roue]', sec), cartes = $$('[data-roue-carte]', sec), etatEl = $('[data-roue-etat]', sec), scene = $('.roue-scene', sec);
  const n = cartes.length, pasA = 360 / n;
  let defil = 0, main = 0, vMain = 0, affiche = 0, prise = null, courante = -1, penche = 0, yAvant = scrollY;
  ST().create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (s) => { defil = -s.progress * pasA * (n - 1); } });
  const maj = () => {
    anneau.style.transform = `translateZ(calc(var(--carte-l) * -1.02)) rotateX(${penche.toFixed(2)}deg) rotateY(${affiche.toFixed(2)}deg)`;
    let face = 0, mieux = 999;
    cartes.forEach((c, i) => {
      let a = ((i * pasA + affiche) % 360 + 540) % 360 - 180;
      const dos = Math.abs(a) > 75, cote = !dos && Math.abs(a) > 25;
      if (c.classList.contains('est-dos') !== dos) c.classList.toggle('est-dos', dos);
      if (c.classList.contains('est-cote') !== cote) c.classList.toggle('est-cote', cote);
      const inerte = dos || cote;
      if (c.inert !== inerte) { c.inert = inerte; c.setAttribute('aria-hidden', String(inerte)); }
      if (Math.abs(a) < mieux) { mieux = Math.abs(a); face = i; }
    });
    if (face !== courante) { courante = face; etatEl.textContent = `0${face + 1} / 0${n}`; }
  };
  boucle(sec, (dt) => {
    if (!dt) { maj(); return; }
    if (!prise) {
      main += vMain * dt; vMain *= Math.exp(-3.2 * dt);
      if (Math.abs(vMain) < 25) { const total = defil + main, cible = Math.round(total / pasA) * pasA; main += (cible - total) * Math.min(1, dt * 6); }
    }
    const cible = defil + main;
    affiche += (cible - affiche) * Math.min(1, dt * 9);
    /* La roue penche selon la vitesse du défilement, puis se redresse. */
    const v = (scrollY - yAvant) / dt; yAvant = scrollY;
    const vise = Math.max(-11, Math.min(11, -v * 0.008));
    penche += (vise - penche) * Math.min(1, dt * 5);
    maj();
  });
  let x0 = 0, t0 = 0;
  scene.addEventListener('pointerdown', (e) => { if (e.button > 0) return; prise = true; x0 = e.clientX; t0 = performance.now(); vMain = 0; if (e.pointerType !== 'touch') scene.setPointerCapture(e.pointerId); });
  scene.addEventListener('pointermove', (e) => {
    if (!prise) return;
    const t = performance.now(), dx = e.clientX - x0, dt = Math.max(0.008, (t - t0) / 1000);
    const d = dx * 0.32; main += d; vMain = d / dt; x0 = e.clientX; t0 = t;
  });
  const lacher = () => { prise = null; vMain = Math.max(-900, Math.min(900, vMain)); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => scene.addEventListener(ev, lacher));
  /* Un glisser ne doit pas ouvrir le lien de la carte. */
  let glisse = 0;
  scene.addEventListener('pointerdown', (e) => { glisse = e.clientX; });
  scene.addEventListener('click', (e) => { if (Math.abs(e.clientX - glisse) > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
  $('[data-roue-prec]', sec).addEventListener('click', () => { main += pasA; vMain = 0; });
  $('[data-roue-suiv]', sec).addEventListener('click', () => { main -= pasA; vMain = 0; });
  maj();
}

/* ------------------------------------------------------------------------------------------------
   Titre écrit au fil : le contour des lettres se dessine en rouge, puis l'encre remplit le mot.
   ------------------------------------------------------------------------------------------------ */
function titresAuFil() {
  const titres = $$('[data-titre-fil]');
  if (!titres.length) return;
  const caler = (h) => { const svg = $('svg', h), tx = $('text', svg); try { const b = tx.getBBox(); if (b.width) svg.setAttribute('viewBox', `${Math.floor(b.x - 6)} ${Math.floor(b.y - 6)} ${Math.ceil(b.width + 12)} ${Math.ceil(b.height + 12)}`); } catch (e) { /* police pas encore là */ } };
  const ecrire = (h) => {
    if (h.classList.contains('est-ecrit')) return;
    caler(h);
    const tx = $('text', h);
    if (!gsap || etat.calme) { h.classList.add('est-ecrit'); return; }
    gsap.timeline({ onComplete: () => { h.classList.add('est-ecrit'); gsap.set(tx, { clearProps: 'all' }); } })
      .fromTo(tx, { strokeDasharray: 2400, strokeDashoffset: 2400, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(tx, { fillOpacity: 1, duration: 0.4, ease: 'power1.out' }, 0.75);
  };
  titres.forEach(caler);
  if (document.fonts) document.fonts.ready.then(() => titres.forEach(caler));
  addEventListener('resize', () => titres.forEach(caler));
  if (etat.calme || etat.arrivee === 'retour') { titres.forEach((h) => h.classList.add('est-ecrit')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); quandPret(() => ecrire(e.target)); } }), { rootMargin: '0px 0px -15% 0px' });
  titres.forEach((h) => io.observe(h));
}
let estPret = false;
const enAttente = [];
function quandPret(fn) { if (estPret) fn(); else enAttente.push(fn); }
quand('pret', () => { estPret = true; enAttente.splice(0).forEach((f) => f()); });

/* ------------------------------------------------------------------------------------------------
   Titres « souples » : l'axe SOFT de Fraunces passe de 0 (sage) à 100 (souple) au défilement.
   ------------------------------------------------------------------------------------------------ */
function titresSouples() {
  if (etat.calme || !ST()) { $$('[data-axe]').forEach((h) => h.style.setProperty('--soft', '100')); return; }
  $$('[data-axe]').forEach((h) => {
    h.dataset.effet = h.dataset.effet || 'titre-souple';
    /* Déclencheur : le parent du titre (jamais un élément en cours d'apparition, mesuré avec son décalage). */
    const premier = h.closest('#debut');
    ST().create({
      trigger: premier || h.parentElement, start: premier ? 'top top' : 'top 92%', end: premier ? '+=520' : 'top 30%', scrub: 0.4,
      onUpdate: (s) => h.style.setProperty('--soft', (premier ? 100 - s.progress * 100 : s.progress * 100).toFixed(1)),
    });
    if (premier) h.style.setProperty('--soft', '100');
  });
}

/* Nœud de l'intro entre « Red » et « Act », mesurés quand la police est là (jouer() est appelé après les polices). */
/* Le fil coud les titres : un point rouge traverse chaque grand titre à son arrivée (pseudo-élément ::after). */
function titresCousus() {
  const titres = $$('h2.titre-souple');
  if (etat.calme || etat.arrivee === 'retour') { titres.forEach((h) => h.classList.add('est-cousu')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); quandPret(() => e.target.classList.add('est-cousu')); } }), { rootMargin: '0px 0px -20% 0px' });
  titres.forEach((h) => io.observe(h));
}

function placerNoeudIntro() {
  const red = $('.intro-red'), act = $('.intro-act'), noeud = $('.intro-noeud'), mot = $('.intro-mot');
  if (red && act && noeud) {
    try {
      const a = red.getBBox(), b = act.getBBox();
      const gauche = a.x + a.width, ecart = b.x - gauche;
      if (ecart < 70) act.setAttribute('x', String(gauche + 74));
      const b2 = act.getBBox();
      const fin = b2.x + b2.width, vbW = fin > 630 ? Math.ceil(fin + 10) : 640;
      if (vbW !== 640) mot.setAttribute('viewBox', `0 0 ${vbW} 200`);
      noeud.style.left = ((gauche + (b2.x - gauche) / 2) / vbW * 100).toFixed(2) + '%';
      noeud.style.top = ((a.y + a.height * 0.62) / 200 * 100).toFixed(2) + '%';
    } catch (e) { /* police absente : position par défaut */ }
  }
}

let filetAccueil = null;

demarrer({
  preparer() {
    const scene = $('.hero-scene');
    if (scene) filetAccueil = creerFilet(scene, { ancreImage: [0.63, 0.31], ancreMobile: [0.345, 0.82] });
    roue();
    titresAuFil();
    titresSouples();
    titresCousus();
    initPages({ creerFilet, quandPret });
    /* Contact : le fil qui noue la carte se trace quand la page est prête. */
    const filCarte = $('.contact-fil');
    if (filCarte) { if (etat.calme || etat.arrivee === 'retour') filCarte.classList.add('est-trace'); else quandPret(() => filCarte.classList.add('est-trace')); }
    const racine = $('.fil-racine');
    if (racine) quandPret(() => filConducteur(racine, { lissage: 0.4, onde: 8, boucle: 26, regard: 0.6 }));
  },
  /* Intro, moins de 3 s : le fil entre, écrit « Red » puis « Act », le trait d'union se serre en nœud,
     le nœud glisse jusqu'à l'objet d'ouverture de la page ([data-iris-centre]) et l'écran s'ouvre depuis lui. */
  jouer() {
    if (!gsap) return null;
    placerNoeudIntro();
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to('.intro-fil-entree', { strokeDashoffset: 0, duration: 0.22, ease: 'none' }, 0)
      .to('.intro-red', { strokeDashoffset: 0, duration: 0.55 }, 0.12)
      .to('.intro-red', { fillOpacity: 1, duration: 0.25 }, 0.5)
      .to('.intro-act', { strokeDashoffset: 0, duration: 0.5 }, 0.55)
      .to('.intro-act', { fillOpacity: 1, duration: 0.25 }, 0.9)
      .fromTo('.intro-noeud', { opacity: 0, scale: 2.2, rotate: -90 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }, 0.85)
      .fromTo('.ouverture-ligne', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0.9)
      .to('.intro-mot, .ouverture-ligne', { opacity: 0, duration: 0.2 }, 1.25);
    versObjet(tl, { a: 1.25, duree: 0.45, ouverture: 0.7 });
    if (filetAccueil) tl.call(() => filetAccueil.deployer(), null, 1.75);
    const lignes = $$('.hero-ligne'), suite = $$('.tete-suite');
    if (lignes.length) tl.fromTo(lignes, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 1.75);
    if (suite.length) tl.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.85);
    return tl;
  },
  etatFinal() {
    if (filetAccueil) filetAccueil.etatFinal();
    if (!gsap) return;
    gsap.set('.hero-ligne, .tete-suite', { clearProps: 'transform,opacity' });
  },
  arrivee() {
    if (filetAccueil) filetAccueil.deployer();
    if (!gsap) return;
    const lignes = $$('.hero-ligne'), suite = $$('.tete-suite');
    if (lignes.length) gsap.fromTo(lignes, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
    if (suite.length) gsap.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.25 });
  },
});
