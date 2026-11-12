/* Effets propres à Red-Act (direction « Red, le réseau »). Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets posée par attributs dans les pages.
   Effets du plan : intro (fil qui écrit Red-Act et se noue), filet, roue-metiers, titre-au-fil, titre-souple,
   fil conducteur (module de la bibliothèque), brouillon (Métiers), separation (Spécialités), filet-references,
   noeud-vous (Contact). Chaque effet propre porte data-effet="nom". */
import { demarrer, boucle, etat, versObjet, quand } from './socle/index.js?v=5';
import { init as filConducteur } from './modules/fil-conducteur.js?v=5';
import { initPages } from './pages.js?v=5';

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
  /* v3 : le filet se déplie en douceur depuis son nœud (cibles et longueurs de repos qui grandissent avec une courbe),
     au lieu de partir de tous les nœuds empilés et de se démêler en rebondissant. */
  let tDeploi = deploye ? -1e9 : null, tNow = 0, depVis = deploye ? 1 : 0;
  const deployer = () => { if (!deploye) { deploye = true; tDeploi = tNow; } };
  /* Filets des pages intérieures : ils se tendent quand la page est prête (le filet de l'accueil attend l'intro). */
  if (o.deploieAuPret) quandPret(deployer);
  const police = o.police || '600 12.5px "Inter Tight", Arial, sans-serif';

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
    dpr = Math.min(window.devicePixelRatio || 1, o.dprMax || 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = police;
    C = couleurs();
    placerAncre();
    const rnd = graine(o.graine || 7);
    const S = Math.max(W, H) * (o.portee || 0.62);
    const anneaux = o.anneaux || [6, 10, 14, 18];
    /* Zone laissée libre à gauche (titre de la page) sur grand écran : tout le filet est resserré à l'horizontale
       et décalé vers la droite (avant, les nœuds de gauche se tassaient en colonne contre la limite). */
    const ax0 = ax;
    let kx = 1;
    if (o.gaucheLibre && W > 760) {
      const g = W * o.gaucheLibre;
      kx = Math.min(1, (W * 1.12 - g) / (2 * S));
      ax = Math.max(ax, g + S * kx);
      if (noeudEl) noeudEl.style.left = ax + 'px';
    }
    noeuds = [{ x: ax, y: ay, rx: ax, ry: ay, ox: ax, oy: ay, vx: 0, vy: 0, fixe: true, anneau: 0, nom: '' }];
    liens = [];
    let iNom = 0;
    const parAnneau = [[0]];
    anneaux.forEach((n, a) => {
      const rayon = S * ((a + 1) / anneaux.length) * (0.92 + rnd() * 0.08);
      const dec = rnd() * Math.PI * 2, ids = [];
      for (let i = 0; i < n; i++) {
        const ang = dec + (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
        const rr = rayon * (0.86 + rnd() * 0.24);
        const x = ax + Math.cos(ang) * rr * kx, y = ay + Math.sin(ang) * rr * 0.86;
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
    tNow = t;
    if (deploye && tDeploi === null) tDeploi = t;
    const vy = scrollY - dernierY; dernierY = scrollY;
    const choc = Math.max(-30, Math.min(30, vy)) * 0.6;
    const u = deploye ? Math.min(1, Math.max(0, (t - tDeploi) / 1.25)) : 0, dep = 1 - Math.pow(1 - u, 3);
    depVis = dep;
    /* Pendant le déploiement, le filet s'ouvre comme une forme qui grandit (positions posées, sans ressorts) :
       aucun nœud ne se croise. La physique reprend ensuite, sans à-coup (vitesses nulles). */
    if (deploye && u < 1) {
      for (const n of noeuds) {
        if (n.fixe || n === prise) continue;
        n.x = ax + (n.rx - ax) * dep; n.y = ay + (n.ry - ay) * dep; n.vx = 0; n.vy = 0;
      }
      return;
    }
    for (const n of noeuds) {
      if (n.fixe || n === prise) continue;
      const bx = Math.sin(t * 0.7 + n.ph) * 2 * dep, by = Math.cos(t * 0.55 + n.ph) * 2 * dep;
      const k = deploye ? 30 : 0;
      const cx = ax + (n.rx - ax) * dep, cy = ay + (n.ry - ay) * dep;
      let fx = (cx + bx - n.x) * k, fy = (cy + by - n.y) * k;
      fy -= choc * Math.min(n.anneau, 3);
      if (survol && n !== survol && survol.secteur && n.secteur === survol.secteur) { fx += (survol.x - n.x) * 3.5; fy += (survol.y - n.y) * 3.5; }
      n.vx += fx * dt; n.vy += fy * dt;
    }
    for (const [i, j, L0] of liens) {
      const p = noeuds[i], q = noeuds[j], L = L0 * dep;
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, f = (d - L) * 28 / d;
      if (!p.fixe && p !== prise) { p.vx += dx * f * dt; p.vy += dy * f * dt; }
      if (!q.fixe && q !== prise) { q.vx -= dx * f * dt; q.vy -= dy * f * dt; }
    }
    const amorti = Math.exp(-(u < 1 ? 8 : 5.4) * dt);
    for (const n of noeuds) {
      if (n.fixe || n === prise) continue;
      n.vx *= amorti; n.vy *= amorti;
      n.x += n.vx * dt; n.y += n.vy * dt;
    }
  }

  function dessiner() {
    ctx.clearRect(0, 0, W, H);
    /* Un vrai fil : il pend un peu entre deux nœuds, porte une ombre sur le papier et un reflet. */
    const tracer = (dx, dy) => {
      ctx.beginPath();
      for (const [i, j] of liens) {
        const p = noeuds[i], q = noeuds[j];
        const L = Math.hypot(q.x - p.x, q.y - p.y), pend = Math.min(12, L * 0.07);
        ctx.moveTo(p.x + dx, p.y + dy); ctx.quadraticCurveTo((p.x + q.x) / 2 + dx, (p.y + q.y) / 2 + pend + dy, q.x + dx, q.y + dy);
      }
      ctx.stroke();
    };
    ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    if (o.matiere === false) { ctx.lineWidth = 1.6; ctx.strokeStyle = C.fil; tracer(0, 0); }
    else {
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(27,25,22,0.16)'; tracer(2, 3.5);
      ctx.lineWidth = 2.2; ctx.strokeStyle = C.fil; tracer(0, 0);
      ctx.lineWidth = 0.7; ctx.strokeStyle = 'rgba(255,236,226,0.45)'; tracer(-0.4, -0.6);
    }
    if (survol) {
      ctx.lineWidth = 3.2; ctx.globalAlpha = 1; ctx.beginPath();
      for (const [i, j] of liens) { const p = noeuds[i], q = noeuds[j]; if (p === survol || q === survol || (survol.secteur && p.secteur === survol.secteur && q.secteur === survol.secteur)) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const allumeDe = (n) => (survol ? (n === survol || (survol.secteur && n.secteur === survol.secteur)) : (!o.allume || o.allume(n)));
    for (const n of noeuds) {
      if (n.fixe) continue;
      const allume = allumeDe(n);
      /* v3 : des nœuds de fil (rouge plein, ombre), plus des pastilles blanches. */
      const r = n.nom ? (allume ? 5 : 4) : 2.6;
      ctx.fillStyle = 'rgba(27,25,22,0.22)'; ctx.beginPath(); ctx.arc(n.x + 1.2, n.y + 2, r, 0, 6.2832); ctx.fill();
      ctx.fillStyle = C.fil; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.2832); ctx.fill();
      if (n.nom) { ctx.strokeStyle = 'rgba(120,20,14,0.85)'; ctx.lineWidth = 1.2; ctx.stroke(); }
    }
    ctx.font = police; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    /* Les noms n'apparaissent qu'une fois le filet presque ouvert (avant, ils s'empilaient sur le nœud). */
    if (depVis < 0.75) { ctx.globalAlpha = 1; return; }
    const fondu = Math.min(1, (depVis - 0.75) * 4);
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
      ctx.globalAlpha = (allume ? 1 : 0.35) * fondu;
      ctx.lineWidth = 6; ctx.strokeStyle = C.halo; ctx.strokeText(n.nom, x, n.y);
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
    deployer,
    etatFinal() { deploye = true; tDeploi = -1e9; depVis = 1; for (const n of noeuds) { n.x = n.rx; n.y = n.ry; n.vx = n.vy = 0; } dessiner(); },
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
   Six métiers suspendus à un fil, comme des épreuves qui sèchent (v3, remplace la roue 3D).
   Le fil pend en arc ; les six cartes y sont accrochées par un nœud et suivent sa pente. Au défilement, le fil
   glisse d'une carte à l'autre ; on peut aussi l'attraper et le tirer (élan), ou utiliser les flèches.
   Il se balance selon la vitesse du défilement. Tout est en 2D : aucune carte déformée, les six restent lisibles.
   Mesures au chargement et au redimensionnement seulement ; arrêt sur une carte une fois le défilement posé.
   ------------------------------------------------------------------------------------------------ */
function epreuves() {
  const sec = $('.epreuves');
  if (!sec || etat.calme || !ST()) return;
  const scene = $('.epreuves-scene', sec), cartes = $$('[data-epreuve]', sec), etatEl = $('[data-epreuves-etat]', sec);
  const trait = $('.epreuves-fil-trait', sec), ombre = $('.epreuves-fil-ombre', sec);
  const n = cartes.length, milieu = (n - 1) / 2;
  let W = 0, H = 0, L = 0, CH = 0, pas = 0, pan = 0, haut = 16, creux = 40, demi = 1, large = true, mode = 'tous', maxS = 0;
  let pos = 0, defil = 0, main = 0, vMain = 0, prise = null, courante = -1, tDefil = 0;
  let bal = 0, vBal = 0, yAvant = scrollY;
  const mesurer = () => {
    scene.style.removeProperty('--ep-l'); scene.classList.remove('est-serre');
    W = scene.clientWidth; H = scene.clientHeight;
    /* La plus haute des cartes compte (un nom sur deux lignes l'allonge). */
    const hauteur = () => Math.max(...cartes.map((li) => li.offsetHeight));
    L = cartes[0].offsetWidth; CH = hauteur();
    /* Les cartes tiennent toujours en hauteur : réduites si la scène est basse (écrans bas, tablettes). */
    const place = H - haut - 46;
    /* D'abord retirer la phrase courte des cartes, puis seulement réduire leur largeur. */
    if (CH > place) { scene.classList.add('est-serre'); CH = hauteur(); }
    for (let k = 0; k < 3 && CH > place && place > 80; k++) { scene.style.setProperty('--ep-l', Math.max(132, Math.floor(L * place / CH)) + 'px'); L = cartes[0].offsetWidth; CH = hauteur(); }
    /* Trois façons de suspendre les épreuves, selon la place :
       « tous » : les six tiennent côte à côte (très grand écran), le fil glisse à peine ;
       « bande » : ordinateur et tablette, le fil ne glisse que de ce qui dépasse, les cartes remplissent la largeur ;
       « centre » : téléphone, la carte en cours est au centre. */
    const pasTous = (W - 48 - L) / ((n - 1) * 1.18);
    mode = pasTous >= L * 1.1 && innerHeight >= 640 ? 'tous' : W >= L * 2.9 ? 'bande' : 'centre';
    large = mode !== 'centre';
    pas = mode === 'tous' ? Math.min(pasTous, L * 1.45) : L * (mode === 'bande' ? 1.14 : 1.12);
    pan = mode === 'tous' ? pas * 0.18 : pas;
    maxS = mode === 'bande' ? Math.max(0, ((n - 1) * pas + L) / 2 + 40 - W / 2) : Infinity;
    demi = mode === 'centre' ? Math.max(W / 2, pas * 2.4) : W / 2;
    creux = Math.max(10, Math.min(H - CH * 1.02 - haut - 8, H * 0.12, large ? 60 : 34));
  };
  const yFil = (x, c) => { const u = Math.max(-1.6, Math.min(1.6, (x - W / 2) / demi)); return haut + c * (1 - u * u); };
  const poser = () => {
    const c = creux * (1 + bal);
    let face = 0, mieux = 99;
    cartes.forEach((li, i) => {
      const decal = mode === 'bande' ? Math.max(-maxS, Math.min(maxS, (pos - milieu) * pas)) : (pos - milieu) * pan;
      const x = W / 2 + (i - milieu) * pas - decal;
      const y = yFil(x, c);
      const pente = (-2 * c * ((x - W / 2) / demi)) / demi;
      const d = Math.abs(i - pos);
      const s = large ? 0.93 + 0.09 * Math.max(0, 1 - d) : 0.92 + 0.08 * Math.max(0, 1 - d);
      const ang = Math.atan(pente) * 57.3 * (large ? 0.6 : 0.45) + bal * 18 * Math.sin(i * 1.7 + 0.6);
      li.style.transform = `translate(${(x - L / 2).toFixed(1)}px, ${y.toFixed(1)}px) rotate(${ang.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      li.style.zIndex = String(10 - Math.round(d));
      /* En glissement, une carte qui déborde de la scène est cachée (jamais coupée). */
      { const ar = Math.abs(ang) / 57.3, demiL = (L * s / 2) * Math.cos(ar) + CH * s * Math.sin(ar) + 8, dehors = x - demiL < 0 || x + demiL > W; if (li.classList.contains('est-dehors') !== dehors) li.classList.toggle('est-dehors', dehors); }
      if (d < mieux) { mieux = d; face = i; }
    });
    let chemin = '';
    for (let x = -60; x <= W + 60; x += 24) chemin += (chemin ? ' L ' : 'M ') + x + ' ' + yFil(x, c).toFixed(1);
    trait.setAttribute('d', chemin); ombre.setAttribute('d', chemin);
    if (face !== courante) {
      courante = face; etatEl.textContent = `0${face + 1} / 0${n}`;
      cartes.forEach((li, i) => li.classList.toggle('est-face', i === face));
    }
  };
  mesurer();
  new ResizeObserver(() => { mesurer(); poser(); }).observe(scene);
  ST().create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (st) => { defil = st.progress * (n - 1); tDefil = performance.now(); } });
  boucle(sec, (dt) => {
    if (!dt) { poser(); return; }
    if (!prise) {
      main += vMain * dt; vMain *= Math.exp(-3.4 * dt);
      const total = defil + main;
      if (total < 0) main -= total * Math.min(1, dt * 10);
      if (total > n - 1) main -= (total - (n - 1)) * Math.min(1, dt * 10);
      if (Math.abs(vMain) < 0.4 && performance.now() - tDefil > 220) { const t2 = defil + main; main += (Math.round(t2) - t2) * Math.min(1, dt * 6); }
    }
    const cible = Math.max(-0.3, Math.min(n - 0.7, defil + main));
    pos += (cible - pos) * Math.min(1, dt * 8);
    /* Le fil se balance selon la vitesse du défilement, puis se calme (ressort amorti). */
    const v = (scrollY - yAvant) / dt; yAvant = scrollY;
    vBal += (Math.max(-0.35, Math.min(0.35, v * 0.00025)) - bal) * 40 * dt - vBal * 7 * dt;
    bal += vBal * dt;
    poser();
  });
  let x0 = 0, t0 = 0, depart = 0;
  scene.addEventListener('pointerdown', (e) => { if (e.button > 0) return; prise = true; x0 = depart = e.clientX; t0 = performance.now(); vMain = 0; if (e.pointerType !== 'touch') scene.setPointerCapture(e.pointerId); });
  scene.addEventListener('pointermove', (e) => {
    if (!prise) return;
    const t = performance.now(), dx = e.clientX - x0, dt = Math.max(0.008, (t - t0) / 1000);
    const d = -dx / Math.max(40, pan); main += d; vMain = d / dt; x0 = e.clientX; t0 = t;
  });
  const lacher = () => { if (!prise) return; prise = null; vMain = Math.max(-6, Math.min(6, vMain)); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => scene.addEventListener(ev, lacher));
  /* Un glisser n'ouvre pas le lien de la carte. */
  scene.addEventListener('click', (e) => { if (Math.abs(e.clientX - depart) > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
  $('[data-epreuves-prec]', sec).addEventListener('click', () => { main -= 1; vMain = 0; });
  $('[data-epreuves-suiv]', sec).addEventListener('click', () => { main += 1; vMain = 0; });
  /* Au clavier, la carte qui reçoit le focus vient au milieu. */
  cartes.forEach((li, i) => li.addEventListener('focusin', () => { main += i - Math.round(defil + main); vMain = 0; }));
  poser();
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
    gsap.timeline({ onComplete: () => { h.classList.add('est-ecrit'); gsap.set(tx, { clearProps: 'strokeDasharray,strokeDashoffset,fillOpacity' }); } })
      .fromTo(tx, { strokeDasharray: 2400, strokeDashoffset: 2400, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(tx, { fillOpacity: 1, duration: 0.25, ease: 'power1.out' }, 0.35);
  };
  titres.forEach(caler);
  if (document.fonts) document.fonts.ready.then(() => titres.forEach(caler));
  addEventListener('resize', () => titres.forEach(caler));
  if (etat.calme || etat.arrivee === 'retour') { titres.forEach((h) => h.classList.add('est-ecrit')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); quandPret(() => ecrire(e.target)); } }), { rootMargin: '0px 0px -4% 0px' });
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

/* ------------------------------------------------------------------------------------------------
   Chiasme de l'accueil : la deuxième ligne arrive en « & savoir faire », puis un fil rouge entre, passe dans
   le « & » et croise les deux mots, qui échangent leur place : « & faire savoir ». Le savoir-faire devient
   faire-savoir. Au survol (ou au toucher), les mots se recroisent avec un ressort. Positions mesurées sans
   transformation (offsetLeft), une fois les polices là ; rien n'est lu pendant le défilement.
   ------------------------------------------------------------------------------------------------ */
function creerChiasme() {
  const h = $('[data-chiasme]');
  const svg = $('.chiasme-fil');
  if (!h || !svg || !gsap) return null;
  const et = $('.chi-et', h), a = $('[data-chi="a"]', h), b = $('[data-chi="b"]', h);
  const trait = $('.chiasme-fil-trait', svg), ombre = $('.chiasme-fil-ombre', svg);
  const d = { a: 0, b: 0, em: 16 };
  const pos = (el) => { let x = 0, y = 0, e = el; while (e && e !== h.offsetParent) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
  const mesurer = () => {
    const A = pos(a), B = pos(b), E = pos(et);
    const ecart = B.x - (A.x + A.w);
    d.a = B.w + ecart; d.b = -(A.w + ecart);
    d.em = parseFloat(getComputedStyle(h).fontSize) || 16;
    const mi = A.y + A.h * 0.58, bas = A.y + A.h * 1.3, haut = A.y - A.h * 0.32;
    const x0 = Math.max(4, E.x - 70), xc = A.x + A.w + ecart / 2;
    const chemin = `M ${x0} ${mi + A.h * 0.28} C ${E.x - 8} ${mi + A.h * 0.26} ${E.x + E.w * 0.15} ${mi - A.h * 0.05} ${E.x + E.w * 0.55} ${mi}`
      + ` C ${E.x + E.w + 12} ${bas} ${xc - 14} ${bas} ${xc} ${mi}`
      + ` C ${xc + 14} ${haut} ${B.x + B.w - 6} ${haut} ${B.x + B.w + 18} ${mi + A.h * 0.1}`
      + ` Q ${B.x + B.w + 48} ${mi + A.h * 0.25} ${B.x + B.w + 40} ${A.y + A.h * 0.92}`;
    trait.setAttribute('d', chemin); ombre.setAttribute('d', chemin);
    return trait.getTotalLength();
  };
  let croise = false, joue = false;
  const croiser = (vers, duree = 0.9, ressort = false) => {
    croise = vers;
    const ease = ressort ? 'elastic.out(1, 0.55)' : 'power3.inOut';
    gsap.to(a, { x: vers ? d.a : 0, duration: duree, ease, overwrite: 'auto' });
    gsap.to(b, { x: vers ? d.b : 0, duration: duree, ease, overwrite: 'auto' });
    const arc = d.em * 0.1;
    gsap.fromTo(a, { y: 0 }, { y: -arc, duration: duree / 2, yoyo: true, repeat: 1, ease: 'sine.inOut', overwrite: false });
    gsap.fromTo(b, { y: 0 }, { y: arc, duration: duree / 2, yoyo: true, repeat: 1, ease: 'sine.inOut', overwrite: false });
  };
  const depart = () => { mesurer(); gsap.set(a, { x: d.a }); gsap.set(b, { x: d.b }); gsap.set([trait, ombre], { strokeDasharray: 4000, strokeDashoffset: 4000 }); croise = true; };
  const jouer = () => {
    const L = mesurer();
    h.classList.add('est-libre');
    gsap.fromTo([trait, ombre], { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' });
    gsap.delayedCall(0.35, () => croiser(false, 1.0));
    joue = true;
  };
  const final = () => { const L = mesurer(); h.classList.add('est-libre'); gsap.set([a, b], { x: 0, y: 0 }); gsap.set([trait, ombre], { strokeDasharray: L, strokeDashoffset: 0 }); croise = false; joue = true; };
  /* Le jeu : survol à la souris, toucher sur écran tactile. */
  if (!etat.calme) {
    if (souris) {
      h.addEventListener('pointerenter', () => { if (joue) croiser(true, 0.8, true); });
      h.addEventListener('pointerleave', () => { if (joue) croiser(false, 0.8, true); });
    } else {
      h.addEventListener('click', () => { if (joue) croiser(!croise, 0.8, true); });
    }
    /* Au défilement, le bout du fil se balance. */
    if (ST()) ST().create({ trigger: h.closest('#debut'), start: 'top top', end: 'bottom top', scrub: 0.5, onUpdate: (st) => { svg.style.transform = `translateY(${(st.progress * 22).toFixed(1)}px) rotate(${(st.progress * 1.6).toFixed(2)}deg)`; } });
  }
  addEventListener('resize', () => { if (joue) { const L = mesurer(); gsap.set([trait, ombre], { strokeDasharray: L, strokeDashoffset: 0 }); if (!croise) gsap.set([a, b], { x: 0 }); } });
  return { depart, jouer, final };
}

let filetAccueil = null, chiasme = null;

demarrer({
  preparer() {
    const scene = $('.hero-scene');
    if (scene) filetAccueil = creerFilet(scene, {
      ancreImage: [0.63, 0.31], ancreMobile: [0.5, 0.6], police: '600 13.5px "Inter Tight", Arial, sans-serif',
      /* Dix noms à la fois sur ordinateur, six sur téléphone ; les autres apparaissent au survol ou quand on tire. */
      etiquette: (n, k) => k < (innerWidth > 760 ? 10 : 6),
    });
    chiasme = creerChiasme();
    epreuves();
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
    /* v3 : intro resserrée (le fil écrit plus vite, l'écran s'ouvre vers 1,5 s). */
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to('.intro-fil-entree', { strokeDashoffset: 0, duration: 0.18, ease: 'none' }, 0)
      .to('.intro-red', { strokeDashoffset: 0, duration: 0.42 }, 0.08)
      .to('.intro-red', { fillOpacity: 1, duration: 0.2 }, 0.36)
      .to('.intro-act', { strokeDashoffset: 0, duration: 0.4 }, 0.4)
      .to('.intro-act', { fillOpacity: 1, duration: 0.2 }, 0.68)
      .fromTo('.intro-noeud', { opacity: 0, scale: 2.2, rotate: -90 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(2)' }, 0.64)
      .fromTo('.ouverture-ligne', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.68)
      .to('.intro-mot, .ouverture-ligne', { opacity: 0, duration: 0.18 }, 0.98);
    versObjet(tl, { a: 0.98, duree: 0.42, ouverture: 0.62 });
    if (filetAccueil) tl.call(() => filetAccueil.deployer(), null, 1.4);
    if (chiasme) chiasme.depart();
    const lignes = $$('.hero-ligne'), suite = $$('.tete-suite');
    if (lignes.length) tl.fromTo(lignes, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, 1.4);
    if (suite.length) tl.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' }, 1.5);
    if (chiasme) tl.call(() => chiasme.jouer(), null, 1.95);
    return tl;
  },
  etatFinal() {
    if (filetAccueil) filetAccueil.etatFinal();
    if (!gsap) return;
    if (chiasme) chiasme.final();
    gsap.set('.hero-ligne, .tete-suite', { clearProps: 'transform,opacity' });
  },
  arrivee() {
    if (filetAccueil) filetAccueil.deployer();
    if (!gsap) return;
    const lignes = $$('.hero-ligne'), suite = $$('.tete-suite');
    if (lignes.length) gsap.fromTo(lignes, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
    if (suite.length) gsap.fromTo(suite, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.25 });
    if (chiasme) { chiasme.depart(); gsap.delayedCall(0.7, () => chiasme.jouer()); }
  },
});
