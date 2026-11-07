/* En-tête et menu.
   - L'en-tête se cache en descendant et revient en remontant, avec un seuil : aucun clignotement.
   - Aucun trou de navigation, d'après la largeur réelle des liens : sur une rangée à côté du logo s'ils tiennent ;
     sinon, dès 900 px, sur une deuxième rangée sous le logo (classe nav-deux-rangees : jamais le bouton Menu seul
     sur ordinateur), qui passe au besoin sur deux lignes (nav-deux-lignes) ; en dessous de 900 px, bouton Menu
     (classe nav-compacte). Si même deux lignes ne suffisent pas, le bouton Menu prend le relais et la console
     le signale : l'en-tête est à revoir (libellés plus courts, pages regroupées).
   - Sans JavaScript, le lien [data-menu-lien] ouvre le même menu par son ancre (#menu:target, voir socle.css).
   - Menu : Échap le ferme, le focus reste dedans puis revient au bouton, la page est bloquée derrière,
     le bouton revient à « Menu » après un choix.
   - La page en cours (aria-current="page", posé par le générateur) et la section en cours sont signalées. */
import { html, etat } from './etat.js?v=1';
import { mesures } from './mesures.js?v=1';
import { bloquerDefilement, debloquerDefilement } from './defilement.js?v=1';
import { suivre, lacher } from './gouttiere.js?v=1';

let menu, bouton, entete;
let ouvert = false;
let fermeture = 0;

function focusables(racine) {
  return [...racine.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => el.offsetParent !== null || el === document.activeElement);
}

export function ouvrirMenu() {
  if (!menu || ouvert) return;
  ouvert = true;
  menu.inert = false;
  menu.removeAttribute('aria-hidden');
  html.classList.add('menu-ouvert');
  bouton.setAttribute('aria-expanded', 'true');
  const lib = bouton.querySelector('[data-libelle-bouton]') || bouton;
  lib.textContent = bouton.dataset.libelleFermer || 'Fermer';
  bloquerDefilement('menu');
  clearTimeout(fermeture);
  suivre(menu, 600);
  html.classList.remove('entete-cache');
  requestAnimationFrame(() => { const f = focusables(menu)[0]; f && f.focus({ preventScroll: true }); });
}

export function fermerMenu({ rendreFocus = true } = {}) {
  if (!menu || !ouvert) return;
  ouvert = false;
  menu.inert = true;
  menu.setAttribute('aria-hidden', 'true');
  html.classList.remove('menu-ouvert');
  bouton.setAttribute('aria-expanded', 'false');
  const lib = bouton.querySelector('[data-libelle-bouton]') || bouton;
  lib.textContent = bouton.dataset.libelleOuvrir || 'Menu';
  /* Le défilement revient une fois le menu effacé : la barre de défilement ne réapparaît pas par-dessus. */
  suivre(menu, 450);
  clearTimeout(fermeture);
  fermeture = setTimeout(() => { if (!ouvert) { debloquerDefilement('menu'); lacher(menu); } }, 330);
  if (rendreFocus) bouton.focus({ preventScroll: true });
}

const ordinateur = window.matchMedia('(min-width: 900px)');
let averti = false;
function ajusterNav() {
  const liste = document.querySelector('[data-nav] ul');
  if (!liste) return;
  html.classList.remove('nav-compacte', 'nav-deux-rangees', 'nav-deux-lignes');
  const deborde = () => liste.scrollWidth > liste.clientWidth + 1;
  let compacte = deborde();
  if (compacte && ordinateur.matches) {
    html.classList.add('nav-deux-rangees');
    compacte = deborde();
    if (compacte) {
      /* Deux lignes de liens au plus : au-delà, l'en-tête mangerait le premier écran. */
      html.classList.add('nav-deux-lignes');
      const lien = liste.querySelector('a');
      compacte = !lien || liste.getBoundingClientRect().height > lien.getBoundingClientRect().height * 2.5;
    }
    if (compacte) {
      html.classList.remove('nav-deux-rangees', 'nav-deux-lignes');
      if (!averti) { averti = true; console.warn('[socle] en-tête : les liens ne tiennent pas, même sur deux rangées, à ' + window.innerWidth + ' px : raccourcir les libellés de navigation.'); }
    }
  }
  html.classList.toggle('nav-compacte', compacte);
  if (!compacte && ouvert) fermerMenu({ rendreFocus: false });
}

export function initEntete() {
  entete = document.querySelector('[data-entete]');
  menu = document.querySelector('[data-menu]');
  bouton = document.querySelector('[data-menu-bouton]');

  ajusterNav();
  let rafNav = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rafNav); rafNav = requestAnimationFrame(ajusterNav); });
  if (document.fonts) document.fonts.ready.then(ajusterNav);

  if (menu && bouton) {
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    bouton.addEventListener('click', () => (ouvert ? fermerMenu() : ouvrirMenu()));
    document.addEventListener('keydown', (e) => {
      if (!ouvert) return;
      if (e.key === 'Escape') { e.preventDefault(); fermerMenu(); return; }
      if (e.key !== 'Tab') return;
      const f = [bouton, ...focusables(menu)];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a[href]')) fermerMenu({ rendreFocus: false });
    });
  }

  /* Cacher en descendant, montrer en remontant : seuil de 12 px, un seul changement d'état à la fois. */
  if (entete) {
    let dernierY = window.scrollY, cumul = 0, cache = false, raf = 0;
    const appliquer = (c) => { if (c !== cache) { cache = c; html.classList.toggle('entete-cache', c); } };
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY, d = y - dernierY;
        dernierY = y;
        if (ouvert || html.classList.contains('defilement-bloque')) return;
        if (y < mesures.enteteH * 1.5) { cumul = 0; appliquer(false); return; }
        /* Saut de plus d'un écran en une image (ancre, retour à une section, lien profond) : ce n'est pas
           le visiteur qui défile, l'en-tête reste comme il était. */
        if (Math.abs(d) > window.innerHeight) { cumul = 0; return; }
        cumul = Math.sign(d) === Math.sign(cumul) ? cumul + d : d;
        if (cumul > 12) appliquer(true);
        else if (cumul < -12) appliquer(false);
      });
    }, { passive: true });
    entete.addEventListener('focusin', () => html.classList.remove('entete-cache'));

    /* Scènes épinglées qui demandent un en-tête caché (et les images qui s'ouvrent en plein écran). */
    const scenes = document.querySelectorAll('[data-entete-cache], [data-fx="plein-ecran"]');
    if (scenes.length) {
      const dans = new Set();
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => (e.isIntersecting ? dans.add(e.target) : dans.delete(e.target)));
        html.classList.toggle('scene-sans-entete', dans.size > 0);
      }, { rootMargin: '-45% 0px -45% 0px' });
      scenes.forEach((s) => io.observe(s));
    }
  }

  /* Section en cours signalée dans la navigation (liens vers une ancre de la page). */
  const liens = [...document.querySelectorAll('[data-nav] a[href*="#"], [data-menu] a[href*="#"]')]
    .filter((a) => new URL(a.href).pathname === location.pathname && a.hash.length > 1);
  const cibles = new Map();
  liens.forEach((a) => {
    let c = null;
    try { c = document.querySelector(decodeURIComponent(a.hash)); } catch {}
    if (c) { if (!cibles.has(c)) cibles.set(c, []); cibles.get(c).push(a); }
  });
  if (cibles.size) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (cibles.get(e.target) || []).forEach((a) => {
        if (e.isIntersecting) a.setAttribute('aria-current', 'location'); else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current');
      }));
    }, { rootMargin: '-45% 0px -50% 0px' });
    cibles.forEach((_, c) => io.observe(c));
  }

  etat.menuOuvert = () => ouvert;
}
