/* MultiPoly v2 — briques d'interface : écrans, feuilles, modales, toasts, thèmes. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = n => (n < 0 ? '-' : '') + Math.abs(Math.round(n)).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' €';

const SCREENS = ['splashScreen', 'landing', 'profileScreen', 'setupScreen', 'lobbyScreen', 'gameScreen', 'careerScreen'];
let current = null;
function showScreen(id){
  SCREENS.forEach(x => { const e = document.getElementById(x); if(e) e.style.display = x === id ? 'flex' : 'none'; });
  current = id;
  const bg = document.getElementById('bgfx'); if(bg) bg.style.display = id === 'careerScreen' ? 'none' : '';
  if(id !== 'gameScreen') closeAll();
}

/* ---------- thèmes ---------- */
function applyTheme(id){
  const th = MP.THEMES[id]; if(!th) return;
  const r = document.documentElement.style, u = th.ui;
  r.setProperty('--accent', u.accent); r.setProperty('--accent2', u.accent2);
  r.setProperty('--bg', u.bg); r.setProperty('--felt', u.felt);
  th.groupColors.forEach((c, i) => r.setProperty('--group-' + i, c));
  const m = document.querySelector('meta[name=theme-color]'); if(m) m.content = u.bg;
}

/* ---------- feuilles ---------- */
const open = [];
function openSheet(o){
  const root = $('#sheetRoot');
  const bd = document.createElement('div'); bd.className = 'backdrop';
  const sh = document.createElement('div'); sh.className = 'sheet' + (o.center ? ' center' : '');
  if(o.center) sh.innerHTML = o.bare ? (o.html || '') : `<div class="modal-card">${o.html || ''}</div>`;
  else sh.innerHTML = `<div class="grab"></div>${o.title ? `<div class="sheet-h"><h3>${o.title}</h3><button class="icon-btn" data-close aria-label="Fermer">✕</button></div>` : ''}<div class="sheet-b">${o.html || ''}</div>`;
  root.appendChild(bd); root.appendChild(sh);
  const ref = { el:sh, bd, body: o.center ? (o.bare ? sh : $('.modal-card', sh)) : $('.sheet-b', sh), closed:false, onClose:o.onClose, tag:o.tag };
  ref.close = () => {
    if(ref.closed) return; ref.closed = true;
    bd.classList.remove('on'); sh.classList.remove('on');
    const i = open.indexOf(ref); if(i >= 0) open.splice(i, 1);
    setTimeout(() => { bd.remove(); sh.remove(); }, 380);
    if(ref.onClose) ref.onClose();
  };
  if(!o.locked) bd.addEventListener('click', ref.close);
  sh.addEventListener('click', e => { if(e.target.closest('[data-close]')) ref.close(); });
  open.push(ref);
  requestAnimationFrame(() => requestAnimationFrame(() => { bd.classList.add('on'); sh.classList.add('on'); }));
  return ref;
}
function closeAll(){ open.slice().forEach(r => r.close()); }
const isOpen = tag => open.some(r => r.tag === tag && !r.closed);
const getOpen = tag => open.find(r => r.tag === tag && !r.closed);

function confirmModal(o){
  return new Promise(res => {
    const ref = openSheet({ center:true, locked:true, html:`<h3>${o.title}</h3><p>${o.text || ''}</p><div class="modal-actions"><button class="btn ghost" data-v="0">${o.cancel || 'Annuler'}</button><button class="btn ${o.danger ? 'danger' : ''}" data-v="1">${o.ok || 'OK'}</button></div>` });
    let done = false;
    ref.el.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if(!b || done) return; done = true; ref.close(); res(b.dataset.v === '1'); });
  });
}
function infoModal(title, html, btn){
  return new Promise(res => {
    const ref = openSheet({ center:true, locked:true, html:`<h3>${title}</h3><p>${html}</p><button class="btn block" data-v>${btn || 'OK'}</button>` });
    ref.el.addEventListener('click', e => { if(e.target.closest('[data-v]')){ ref.close(); res(); } });
  });
}

/* ---------- toasts ---------- */
function toast(msg, kind, ms){
  let root = $('#toasts'); if(!root){ root = document.createElement('div'); root.id = 'toasts'; root.className = 'toasts'; document.body.appendChild(root); }
  const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.innerHTML = msg;
  root.appendChild(t);
  while(root.children.length > 3) root.firstChild.remove();
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 360); }, ms || 2600);
}

/* ---------- confettis ---------- */
function confetti(n){
  const cols = ['#ffd75e', '#ff5a6e', '#37d98a', '#5ec8ff', '#b78cff', '#ff9f43'];
  for(let i = 0; i < (n || 70); i++){
    const c = document.createElement('i'); c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = cols[i % cols.length];
    c.style.animationDuration = (2.2 + Math.random() * 2.2) + 's'; c.style.animationDelay = Math.random() * .8 + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`; c.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    document.body.appendChild(c); setTimeout(() => c.remove(), 5200);
  }
}

/* ---------- diaporama des règles ---------- */
const RULE_SLIDES = [
  ['🎯', 'Le but du jeu', "Achetez des terrains, construisez dessus et faites payer vos adversaires. Le dernier joueur solvable gagne — ou, en partie rapide, le plus riche à la fin des tours."],
  ['🎲', 'À ton tour', "Lance les deux dés et avance. Un double te permet de rejouer… mais trois doubles de suite t'envoient en prison !"],
  ['🏷️', 'Acheter ou enchérir', "Sur un terrain libre, tu peux l'acheter au prix affiché. Sinon, il part aux enchères : tout le monde peut surenchérir, le plus offrant l'emporte."],
  ['🏠', 'Loyers et constructions', "Posséder tout un groupe de couleur double le loyer et te permet de construire des maisons, puis un hôtel. Construis de façon régulière dans le groupe."],
  ['⛓️', 'La prison', "Tu y vas par la case « Va en prison », une carte ou trois doubles. Pour en sortir : paie 50 €, utilise une carte, ou fais un double (3 essais)."],
  ['🏦', 'Hypothèques et dettes', "Besoin d'argent ? Hypothèque tes terrains ou revends des maisons. Impossible de payer ? C'est la faillite, tes biens vont au créancier."],
  ['⚡', 'Cartes Pouvoir', "Bouclier, téléportation, racket, chantier offert, grève… Tu en gagnes en passant par la case Départ (3 maximum). Utilise-les au bon moment !"],
  ['💰', 'La cagnotte', "Taxes et amendes alimentent la cagnotte, empochée par le joueur qui s'arrête sur la case Parking. Un vrai jackpot !"],
];
function openRules(){
  let i = 0;
  const ref = openSheet({ title:'Règles du jeu', tag:'rules', html:`
    <div class="slides" id="rsl">${RULE_SLIDES.map(s => `<div class="slide"><span class="big">${s[0]}</span><h4>${s[1]}</h4><p>${s[2]}</p></div>`).join('')}</div>
    <div class="dots" id="rdots">${RULE_SLIDES.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>
    <div style="display:flex;gap:10px;margin-top:10px"><button class="btn ghost" id="rprev" style="flex:1">‹</button><button class="btn" id="rnext" style="flex:3">Suivant</button></div>` });
  const sl = $('#rsl', ref.el), dots = $$('#rdots i', ref.el), nx = $('#rnext', ref.el);
  const go = k => { i = Math.max(0, Math.min(RULE_SLIDES.length - 1, k)); sl.scrollTo({ left:i * sl.clientWidth, behavior:'smooth' }); upd(); };
  const upd = () => { dots.forEach((d, k) => d.classList.toggle('on', k === i)); nx.textContent = i === RULE_SLIDES.length - 1 ? 'Compris !' : 'Suivant'; };
  sl.addEventListener('scroll', () => { const k = Math.round(sl.scrollLeft / sl.clientWidth); if(k !== i){ i = k; upd(); } });
  $('#rprev', ref.el).onclick = () => go(i - 1);
  nx.onclick = () => { if(i === RULE_SLIDES.length - 1) ref.close(); else go(i + 1); };
}

MP.ui = { $, $$, esc, sleep, fmt, showScreen, current: () => current, applyTheme, openSheet, closeAll, isOpen, getOpen, confirmModal, infoModal, toast, confetti, openRules };
})();
