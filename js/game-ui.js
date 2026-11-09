/* MultiPoly v2 — interface de jeu : plateau, pions animés, dés 3D, dock, feuilles. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const E = MP.engine, U = MP.ui, SND = MP.sound;
const { $, $$, esc, sleep, fmt } = U;

let ctl = null, S = null, TH = null;
let built = false, cells = [], centers = [], tokSize = 20, tokEls = {};
let view = { pos:{} };
let lastSeq = -1, queue = [], busy = false, dirty = false;
let lastCash = {}, diceRot = [{ x:0, y:0 }, { x:0, y:0 }], lastBid = 0;
let live = [];                 // feuilles « vivantes » rafraîchies à chaque état
let tr = null;                 // brouillon d'échange
let pw = { mode:null };        // sélection d'un pouvoir
let overShown = false, ro = null, lastTurnShown = null;

const PATTERNS = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };
const FACE = { 1:{x:0,y:0}, 6:{x:0,y:180}, 3:{x:0,y:-90}, 4:{x:0,y:90}, 2:{x:-90,y:0}, 5:{x:90,y:0} };
const pips = n => Array.from({ length:9 }, (_, i) => `<i class="${PATTERNS[n].includes(i) ? '' : 'x'}"></i>`).join('');
const dieHTML = () => `<div class="die">${[1,2,3,4,5,6].map(n => `<div class="f f${n}">${pips(n)}</div>`).join('')}</div>`;

const P = id => E.P(S, id);
const me = () => ctl ? ctl.viewer() : null;
const gcol = c => c.group ? `var(--group-${c.group[1]})` : '#3b405f';
const tokHTML = (p, cls) => `<span class="tok ${cls || ''}" style="background:${p.token.c}">${p.token.e}</span>`;

/* =============================================================== plateau */
function gridPos(i){
  if(i <= 10) return { r:11, c:11 - i };
  if(i < 20) return { r:21 - i, c:1 };
  if(i <= 30) return { r:1, c:i - 19 };
  return { r:i - 29, c:11 };
}
const sideOf = i => (i % 10 === 0) ? 'corner' : i < 10 ? 'side-b' : i < 20 ? 'side-l' : i < 30 ? 'side-t' : 'side-r';

function buildBoard(){
  TH = E.theme(S);
  U.applyTheme(S.theme);
  const b = E.board(S), ic = TH.icons;
  let h = '<div class="bgrid">';
  b.forEach((c, i) => {
    const gp = gridPos(i), side = sideOf(i);
    const corner = side === 'corner';
    let inner = '', cls = 'cell ' + side;
    if(corner) cls += ' corner special';
    if(c.type === 'property'){
      cls += ' has-band';
      inner = `<div class="band"><div class="hs"></div></div><div class="cn">${esc(c.short)}</div><div class="cp">${c.price}</div><i class="own"></i>`;
    } else if(c.type === 'station' || c.type === 'utility'){
      inner = `<div class="ci">${ic[c.type]}</div><div class="cn">${esc(c.short)}</div><div class="cp">${c.price}</div><i class="own"></i>`;
    } else if(c.type === 'tax'){
      cls += ' tax'; inner = `<div class="ci">${ic.tax}</div><div class="cn">${esc(c.short)}</div><div class="cp">${c.amount}</div>`;
    } else if(c.type === 'minor' || c.type === 'major'){
      cls += ' special'; inner = `<div class="ci">${ic[c.type]}</div><div class="cn">${esc(c.short)}</div>`;
    } else {
      inner = `<div class="ci">${ic[c.type]}</div><div class="cn">${esc(c.short)}</div>`;
    }
    h += `<div class="${cls}" data-i="${i}" style="grid-row:${gp.r};grid-column:${gp.c};${c.group ? `--gc:var(--group-${c.group[1]});` : ''}">${inner}</div>`;
  });
  const die = dieHTML();
  h += `<div class="bcenter"><span class="wm">${TH.icon}</span><div class="ttl">${esc(TH.label)}</div>
    <div class="pot" id="potEl" style="display:none">💰 <b>0 €</b></div>
    <div class="dice" id="diceEl">${die}${die}<span class="dice-sum" id="diceSum"></span></div>
    <div class="cmsg" id="cmsg"></div></div></div><div class="tokens" id="tokLayer"></div>`;
  $('#board').innerHTML = h;
  cells = $$('#board .cell').sort((a, b) => a.dataset.i - b.dataset.i);
  const tl = $('#tokLayer');
  tl.innerHTML = S.players.map(p => `<div class="tk" id="tk-${p.id}" style="--tc:${p.token.c}">${p.token.e}</div>`).join('');
  tokEls = {}; S.players.forEach(p => { tokEls[p.id] = $('#tk-' + p.id); view.pos[p.id] = p.pos; });
  setDiceInstant(S.dice);
  built = true;
  fitBoard();
}

function fitBoard(){
  const w = $('.g-boardwrap'); if(!w || !built) return;
  const s = Math.floor(Math.min(w.clientWidth - 12, w.clientHeight - 4));
  if(s < 100) return;
  $('#board').style.setProperty('--bs', s + 'px');
  calcCenters(); placeTokens(true);
}
function calcCenters(){
  const tl = $('#tokLayer'); if(!tl) return;
  const lr = tl.getBoundingClientRect();
  centers = cells.map(c => { const r = c.getBoundingClientRect(); return { x:r.left - lr.left + r.width / 2, y:r.top - lr.top + r.height / 2 }; });
  tokSize = $('#board').clientWidth * 0.056;
}
const SLOT = [[0,0],[-.3,0],[.3,0],[-.3,-.42],[.3,-.42],[0,.42]];
function placeTokens(instant){
  if(!built || !centers.length) return;
  const groups = {};
  S.players.forEach(p => { if(!p.bankrupt){ (groups[view.pos[p.id]] = groups[view.pos[p.id]] || []).push(p.id); } });
  Object.keys(groups).forEach(k => {
    const ids = groups[k], n = ids.length, c = centers[k];
    ids.forEach((id, j) => {
      let dx = 0, dy = 0;
      if(n === 2){ dx = (j ? .32 : -.32) * tokSize; }
      else if(n > 2){ const sl = [[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3],[0,-.62],[0,.62]][j]; dx = sl[0] * tokSize * 1.05; dy = sl[1] * tokSize * 1.05; }
      const el = tokEls[id]; if(!el) return;
      if(instant) el.style.transition = 'none';
      el.style.transform = `translate(${c.x - tokSize / 2 + dx}px, ${c.y - tokSize / 2 + dy}px)`;
      if(instant){ el.offsetWidth; el.style.transition = ''; }
    });
  });
  S.players.forEach(p => { const el = tokEls[p.id]; if(el){ el.classList.toggle('out', p.bankrupt); el.classList.toggle('act', !S.winner && E.turnPlayer(S).id === p.id); } });
}

function renderBoardDyn(){
  if(!built) return;
  const b = E.board(S);
  b.forEach((c, i) => {
    if(!E.isOwnable(c)) return;
    const pr = S.props[i], el = cells[i];
    const own = pr.o ? P(pr.o) : null;
    el.classList.toggle('owned', !!own); el.classList.toggle('mort', !!(own && pr.m));
    el.style.setProperty('--oc', own ? own.token.c : 'transparent');
    if(c.type === 'property'){
      const hs = $('.hs', el);
      const html = pr.h === 5 ? '<i class="H"></i>' : '<i></i>'.repeat(pr.h);
      if(hs.innerHTML !== html) hs.innerHTML = html;
    }
  });
  const pot = $('#potEl');
  if(pot){
    pot.style.display = S.rules.jackpot ? '' : 'none';
    $('b', pot).textContent = fmt(S.jackpot);
  }
}

/* =============================================================== dés */
function setDiceInstant(d){
  $$('#diceEl .die').forEach((el, k) => {
    const v = d[k] || 1, f = FACE[v];
    diceRot[k] = { x:f.x, y:f.y };
    el.style.transition = 'none'; el.style.transform = `rotateX(${f.x}deg) rotateY(${f.y}deg)`; el.offsetWidth; el.style.transition = '';
  });
}
function rollDiceAnim(d){
  const box = $('#diceEl'); if(!box) return;
  $('#diceSum').classList.remove('on');
  box.classList.remove('rolling'); box.offsetWidth; box.classList.add('rolling');
  $$('.die', box).forEach((el, k) => {
    const f = FACE[d[k]], cur = diceRot[k];
    const nx = Math.ceil(cur.x / 360) * 360 + 360 * (1 + E.rnd(2)) + f.x;
    const ny = Math.ceil(cur.y / 360) * 360 + 360 * (2 + E.rnd(2)) + f.y;
    diceRot[k] = { x:nx, y:ny };
    el.style.transform = `rotateX(${nx}deg) rotateY(${ny}deg)`;
  });
}

/* =============================================================== joueurs / barre du haut */
function renderPlayers(){
  const box = $('#gPlayers'); if(!box) return;
  const tp = E.turnPlayer(S);
  box.innerHTML = S.players.map(p => {
    const prev = lastCash[p.id];
    const cls = ['pchip'];
    if(p.id === tp.id && !S.winner && !p.bankrupt) cls.push('turn');
    if(p.bankrupt) cls.push('out');
    if(p.cash < 100 && !p.bankrupt) cls.push('low');
    if(prev !== undefined && prev !== p.cash) cls.push(p.cash > prev ? 'flash-up' : 'flash-down');
    const owned = E.ownedBy(S, p.id);
    const dots = owned.map(i => { const c = E.cell(S, i); return `<i class="${S.props[i].m ? 'm' : ''}" style="--gc:${c.group ? `var(--group-${c.group[1]})` : (c.type === 'station' ? '#c8d0e8' : '#ffd75e')}"></i>`; }).join('');
    const ic = (p.inJail ? '<span title="Prison">⛓️</span>' : '') + (p.jailCards ? '<span>🎟️</span>' : '') + (p.powers.length ? `<span>⚡${p.powers.length}</span>` : '') + (p.strikeUntil >= S.round && S.rules.powers ? '<span>✊</span>' : '') + (p.bot ? '<span>🤖</span>' : '');
    return `<button class="${cls.join(' ')}" data-pl="${p.id}">
      <div class="pc-top">${tokHTML(p)}<div class="pc-n"><b>${esc(p.name)}</b><span class="num">${p.bankrupt ? 'Faillite' : fmt(p.cash)}</span></div></div>
      <div class="pdots">${dots}</div><div class="pc-ic">${ic}</div></button>`;
  }).join('');
  S.players.forEach(p => { lastCash[p.id] = p.cash; });
  const cur = $('.pchip.turn', box);
  if(cur && box.scrollWidth > box.clientWidth) cur.scrollIntoView({ inline:'center', block:'nearest', behavior:'smooth' });
}

function phaseText(){
  const a = E.actor(S), p = a ? P(a) : null, tp = E.turnPlayer(S);
  if(S.winner) return 'Partie terminée';
  if(S.pending) return 'Bouclier ?';
  if(S.debt) return `Doit ${fmt(S.debt.amount)}`;
  if(S.auction) return 'Enchères';
  if(S.trade) return 'Échange en cours';
  if(S.phase === 'buy') return 'Peut acheter';
  if(S.phase === 'end') return tp.inJail ? 'En prison' : 'Termine son tour';
  if(tp.inJail) return 'En prison';
  return S.doubleAgain ? 'Double ! Rejoue' : 'Lance les dés';
}
function renderTop(){
  const tp = E.turnPlayer(S), v = me();
  const pill = $('#turnPill');
  pill.className = 'turn-pill' + (v && E.actor(S) === v && !S.winner ? ' mine' : '');
  pill.innerHTML = `${tokHTML(tp)}<div class="tp-tx"><b>${tp.id === v ? 'À toi de jouer' : esc(tp.name)}</b><small>${phaseText()}</small></div>`;
  const total = S.rules.end === 'rounds' ? `/${S.rules.rounds}` : '';
  $('#roundTag').textContent = `Tour ${Math.min(S.round, S.rules.rounds || 999)}${total}`;
}

/* =============================================================== dock */
function canManage(pid){
  if(!pid || S.winner || S.auction || S.trade || S.pending) return false;
  if(S.debt) return S.debt.pid === pid;
  return E.turnPlayer(S).id === pid && (S.phase === 'roll' || S.phase === 'end' || S.phase === 'buy');
}
function renderDock(){
  const dock = $('#gDock'); if(!dock) return;
  const v = me(), a = E.actor(S), tp = E.turnPlayer(S), actP = a ? P(a) : null;
  let msg = '', main = '', extra = '';
  const mine = v && a === v;
  if(S.winner){
    msg = 'La partie est terminée.';
    main = `<button class="btn block xl" data-a="over">Voir le classement</button>`;
  } else if(mine){
    const p = P(v);
    if(S.pending){
      const pd = S.pending;
      msg = `<b>${esc(P(pd.owner).name)}</b> te réclame <b>${fmt(pd.amount)}</b> de loyer.`;
      main = `<button class="btn ghost" data-a="shieldNo">Payer</button><button class="btn good" data-a="shieldYes">🛡️ Utiliser le Bouclier</button>`;
    } else if(S.debt){
      const d = S.debt, lack = d.amount - p.cash;
      extra = `<div class="debt-bar">Tu dois ${fmt(d.amount)}${d.to ? ' à ' + esc(P(d.to).name) : ''} — il te manque ${fmt(lack)}<small>Hypothèque ou revends des maisons pour payer, sinon c'est la faillite.</small></div>`;
      main = `<button class="btn" data-a="assets">🏠 Mes biens</button><button class="btn danger" data-a="bankrupt">Faillite</button>`;
    } else if(S.auction){
      msg = "Les enchères sont ouvertes."; main = `<button class="btn block xl pulse" data-a="auction">Ouvrir les enchères</button>`;
    } else if(S.trade){
      msg = `<b>${esc(P(S.trade.from).name)}</b> te propose un échange.`; main = `<button class="btn block xl pulse" data-a="tradein">Voir l'offre</button>`;
    } else if(S.phase === 'roll'){
      if(p.inJail){
        msg = `En prison — tentative ${p.jailTries + 1}/3`;
        main = `<button class="btn ghost ${p.cash < E.JAIL_FINE ? 'off' : ''}" data-a="payJail">Payer ${E.JAIL_FINE} €</button>`
             + (p.jailCards ? `<button class="btn ghost" data-a="jailCard">🎟️ Carte</button>` : '')
             + `<button class="btn pulse" data-a="roll">🎲 Tenter le double</button>`;
      } else {
        msg = S.doubleAgain ? "<b>Double !</b> Tu rejoues." : 'À toi de lancer les dés.';
        main = `<button class="btn block xl pulse" data-a="roll">🎲 Lancer les dés</button>`;
      }
    } else if(S.phase === 'buy'){
      const c = E.cell(S, p.pos), can = p.cash >= c.price;
      extra = `<div class="deal-mini" style="--gc:${gcol(c)}"><div class="sw8"></div><div><b>${esc(c.name)}</b><small>${c.group ? esc(TH.groupLabels[c.group]) : (c.type === 'station' ? TH.words.station : TH.words.utility)}</small></div><div class="pr">${fmt(c.price)}</div></div>`;
      main = S.rules.auctions
        ? `<button class="btn ghost" data-a="decline">Enchères</button><button class="btn good xl ${can ? 'pulse' : 'off'}" data-a="buy">Acheter</button>`
        : `<button class="btn ghost" data-a="decline">Passer</button><button class="btn good xl ${can ? 'pulse' : 'off'}" data-a="buy">Acheter</button>`;
    } else if(S.phase === 'end'){
      msg = p.inJail ? 'Toujours en prison…' : 'Construis, échange ou joue un pouvoir avant de finir.';
      main = `<button class="btn block xl" data-a="end">Terminer le tour</button>`;
    }
  } else {
    const nm = actP ? esc(actP.name) : '';
    msg = S.auction ? 'Enchères en cours…' : S.debt ? `<b>${nm}</b> doit de l'argent…` : S.trade ? `<b>${esc(P(S.trade.from).name)}</b> propose un échange à <b>${esc(P(S.trade.to).name)}</b>…` : `<b>${nm}</b>${actP && actP.bot ? ' 🤖' : ''} ${S.phase === 'buy' ? 'hésite à acheter…' : S.phase === 'end' ? 'termine son tour…' : 'joue…'}`;
    if(S.auction) main = `<button class="btn block ghost" data-a="auction">Voir les enchères</button>`;
    if(S.trade && S.trade.from === v) main = `<button class="btn block ghost" data-a="trade">Annuler mon offre</button>`;
  }
  const isPlayer = !!v && !P(v).bankrupt;
  const pcount = isPlayer ? P(v).powers.length : 0;
  const tabs = isPlayer ? `
    <button class="dtab" data-a="assets"><span>🏠</span>Biens</button>
    <button class="dtab" data-a="trade"><span>🤝</span>Échanger</button>
    ${S.rules.powers ? `<button class="dtab" data-a="powers"><span>⚡</span>Pouvoirs${pcount ? `<i class="bd">${pcount}</i>` : ''}</button>` : ''}
    <button class="dtab" data-a="log"><span>📜</span>Journal</button>`
    : `<button class="dtab" data-a="log"><span>📜</span>Journal</button><button class="dtab" data-a="menu"><span>☰</span>Menu</button>`;
  dock.innerHTML = `${extra}${msg ? `<div class="dock-msg">${msg}</div>` : ''}${main ? `<div class="dock-main">${main}</div>` : ''}<div class="dock-tabs">${tabs}</div>`;
}

/* =============================================================== feuilles : fiche d'une case */
function rentRowsHTML(idx){
  const c = E.cell(S, idx), pr = S.props[idx];
  if(c.type === 'property'){
    const t = E.rentTable(S, idx), names = ['Terrain nu', '1 maison', '2 maisons', '3 maisons', '4 maisons', 'Hôtel'];
    const owner = pr.o;
    return `<div class="rent-row ${owner && pr.h === 0 && !E.ownsGroup(S, owner, c.group) ? 'cur' : ''}"><span>Terrain nu</span><b>${fmt(t[0])}</b></div>
      <div class="rent-row ${owner && pr.h === 0 && E.ownsGroup(S, owner, c.group) ? 'cur' : ''}"><span>Groupe complet</span><b>${fmt(t[0] * 2)}</b></div>`
      + [1,2,3,4,5].map(n => `<div class="rent-row ${pr.h === n ? 'cur' : ''}"><span>${names[n]}</span><b>${fmt(t[n])}</b></div>`).join('')
      + `<div class="rent-row"><span>Coût d'une maison</span><b>${fmt(E.buildCost(S, idx))}</b></div>`;
  }
  if(c.type === 'station') return [1,2,3,4].map(n => `<div class="rent-row"><span>${n} ${TH.words.station}${n > 1 ? 's' : ''} possédé${n > 1 ? 's' : ''}</span><b>${fmt([0,25,50,100,200][n])}</b></div>`).join('');
  return `<div class="rent-row"><span>1 ${TH.words.utility}</span><b>4 × dés</b></div><div class="rent-row"><span>2 ${TH.words.utility}s</span><b>10 × dés</b></div>`;
}
function deedHTML(idx){
  const c = E.cell(S, idx), v = me();
  if(!E.isOwnable(c)){
    const txt = { go:`Passer par cette case rapporte ${fmt(E.GO_SALARY)}.`, jail:"Simple visite… ou prison.", parking:S.rules.jackpot ? `La cagnotte (${fmt(S.jackpot)}) revient à celui qui s'y arrête.` : 'Repos tranquille.', gotojail:'Direction la prison, sans passer par le Départ.', tax:`Vous payez ${fmt(c.amount)}${S.rules.jackpot ? ' (ajouté à la cagnotte)' : ''}.`, minor:'Piochez une carte.', major:'Piochez une carte.' }[c.type] || '';
    return `<div class="deed"><div class="deed-h" style="--gc:#3b405f"><small>${esc(TH.label)}</small><b>${TH.icons[c.type] || ''} ${esc(c.name)}</b></div><div class="deed-b"><p style="text-align:center;font-weight:600;margin:10px 0">${txt}</p></div></div>`;
  }
  const pr = S.props[idx], own = pr.o ? P(pr.o) : null;
  let acts = '';
  if(own && own.id === v && canManage(v)){
    const bi = E.canBuildInfo(S, v, idx), si = E.canSellInfo(S, v, idx), mi = E.canMortgageInfo(S, v, idx);
    acts = `<div class="act-row">`
      + (c.type === 'property' ? `<button class="btn sm ${bi.ok ? 'good' : 'off'}" data-act="build" data-i="${idx}">🏗️ Construire ${bi.cost ? fmt(bi.cost) : ''}</button>` : '')
      + (c.type === 'property' && pr.h > 0 ? `<button class="btn sm ghost ${si.ok ? '' : 'off'}" data-act="sell" data-i="${idx}">Vendre ${si.gain ? '+' + fmt(si.gain) : ''}</button>` : '')
      + `<button class="btn sm ghost ${mi.ok ? '' : 'off'}" data-act="${pr.m ? 'unmortgage' : 'mortgage'}" data-i="${idx}">${pr.m ? 'Lever l\'hypothèque ' + fmt(mi.cost || 0) : 'Hypothéquer +' + fmt(mi.gain || 0)}</button></div>`;
    if(!bi.ok && bi.why && c.type === 'property') acts += `<p class="hint" style="color:var(--ink2);margin:8px 0 0;text-align:center">${bi.why}</p>`;
  }
  return `<div class="deed"><div class="deed-h" style="--gc:${gcol(c)}"><small>${c.group ? esc(TH.groupLabels[c.group]) : (c.type === 'station' ? TH.words.station : TH.words.utility)}</small><b>${esc(c.name)}</b></div>
    <div class="deed-b">${rentRowsHTML(idx)}
    <div class="rent-row"><span>Prix d'achat</span><b>${fmt(c.price)}</b></div><div class="rent-row"><span>Valeur d'hypothèque</span><b>${fmt(c.price / 2)}</b></div>
    <div class="deed-own">${own ? `${tokHTML(own)} ${esc(own.name)}${pr.m ? ' · hypothéqué' : ''}${pr.h ? ' · ' + (pr.h === 5 ? 'hôtel' : pr.h + ' maison' + (pr.h > 1 ? 's' : '')) : ''}` : 'Libre — à vendre'}</div></div></div>${acts}`;
}
function openDeed(idx){
  const c = E.cell(S, idx);
  const ref = U.openSheet({ tag:'deed', title:esc(c.name), html:deedHTML(idx) });
  const render = () => { ref.body.innerHTML = deedHTML(idx); };
  ref.el.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if(!b) return;
    doManage(b.dataset.act, +b.dataset.i);
  });
  live.push({ ref, render });
}
function doManage(act, idx){ ctl.dispatch({ t:act, idx }); SND.play(act === 'build' ? 'build' : 'tap'); }

/* =============================================================== mes biens */
function assetsHTML(){
  const v = me(); if(!v) return '';
  const p = P(v), owned = E.ownedBy(S, v), can = canManage(v);
  const worth = E.netWorth(S, v);
  let h = `<div class="sum-bar"><div><b class="num">${fmt(p.cash)}</b><small>Liquidités</small></div><div><b class="num">${fmt(worth)}</b><small>Patrimoine</small></div></div>`;
  if(S.debt && S.debt.pid === v) h += `<div class="debt-bar">Dette : ${fmt(S.debt.amount)} — il te manque ${fmt(Math.max(0, S.debt.amount - p.cash))}</div>`;
  if(!owned.length) return h + `<div class="empty-slot">Tu ne possèdes encore aucun bien.<br>Achète ou remporte des enchères !</div>`;
  const groups = {};
  owned.forEach(i => { const c = E.cell(S, i); const k = c.group || c.type; (groups[k] = groups[k] || []).push(i); });
  const order = ['g0','g1','g2','g3','g4','g5','g6','g7','station','utility'];
  order.filter(k => groups[k]).forEach(k => {
    const isG = k[0] === 'g' && k.length === 2;
    const full = isG && E.ownsGroup(S, v, k);
    h += `<div class="asset-g"><h5 style="--gc:${isG ? `var(--group-${k[1]})` : '#8a93b8'}"><i></i>${isG ? esc(TH.groupLabels[k]) : (k === 'station' ? TH.words.station + 's' : TH.words.utility + 's')}${full ? ' <span class="tag host">Groupe complet</span>' : ''}</h5>`;
    groups[k].forEach(i => {
      const c = E.cell(S, i), pr = S.props[i];
      const bi = E.canBuildInfo(S, v, i), si = E.canSellInfo(S, v, i), mi = E.canMortgageInfo(S, v, i);
      const hi = pr.h ? `<span class="houses-ind">${pr.h === 5 ? '<i class="H"></i>' : '<i></i>'.repeat(pr.h)}</span>` : '';
      h += `<div class="arow ${pr.m ? 'm' : ''}"><div class="an" data-deed="${i}">${esc(c.name)}${hi}<small>${pr.m ? 'Hypothéqué' : 'Loyer ' + fmt(E.rentFor(S, i, 7))}</small></div>`
        + (c.type === 'property' ? `<button class="sq ${can && si.ok ? '' : 'off'}" data-act="sell" data-i="${i}">−</button><button class="sq go ${can && bi.ok ? '' : 'off'}" data-act="build" data-i="${i}">＋</button>` : '')
        + `<button class="sq hh ${can && mi.ok ? '' : 'off'}" data-act="${pr.m ? 'unmortgage' : 'mortgage'}" data-i="${i}">${pr.m ? '🔓' : '🏦'}</button></div>`;
    });
    h += '</div>';
  });
  h += `<p class="hint" style="text-align:center">＋ construire · − revendre · 🏦 hypothéquer (+50 % du prix) · 🔓 lever (+10 %)${can ? '' : '<br>Disponible pendant ton tour.'}</p>`;
  return h;
}
function openAssets(){
  if(U.isOpen('assets')) return;
  const ref = U.openSheet({ tag:'assets', title:'Mes biens', html:assetsHTML() });
  const render = () => { const sc = ref.el.querySelector('.sheet-b').scrollTop; ref.body.innerHTML = assetsHTML(); ref.el.querySelector('.sheet-b').scrollTop = sc; };
  ref.el.addEventListener('click', e => {
    const d = e.target.closest('[data-deed]'); if(d){ openDeed(+d.dataset.deed); return; }
    const b = e.target.closest('[data-act]'); if(b) doManage(b.dataset.act, +b.dataset.i);
  });
  live.push({ ref, render });
}

/* =============================================================== enchères */
function auctionHTML(){
  const au = S.auction; if(!au) return '';
  const c = E.cell(S, au.idx), v = me(), cur = au.order[au.turn], p = v ? P(v) : null;
  const leader = au.bidder ? P(au.bidder) : null;
  const myTurn = v && cur === v;
  let h = `<div class="au-card"><div class="deed" style="max-width:300px;margin:0 auto"><div class="deed-h" style="--gc:${gcol(c)}"><small>${c.group ? esc(TH.groupLabels[c.group]) : (c.type === 'station' ? TH.words.station : TH.words.utility)} · valeur ${fmt(c.price)}</small><b>${esc(c.name)}</b></div></div>
    <div class="au-bid num" id="auBid">${fmt(au.bid)}</div><div class="au-who">${leader ? `Meilleure offre : <b>${esc(leader.name)}</b>` : 'Aucune offre pour le moment'}</div></div>
    <div class="au-order">${au.order.map(id => { const q = P(id); return `<span class="tok ${id === cur ? 'cur' : ''} ${au.passed.includes(id) ? 'out' : ''} ${au.bidder === id ? 'lead' : ''}" style="background:${q.token.c}" title="${esc(q.name)}">${q.token.e}</span>`; }).join('')}</div>`;
  if(myTurn){
    const incs = au.bid === 0 ? [10, 50, 100] : [10, 50, 100];
    h += `<div class="bid-btns">${incs.map(n => { const amt = au.bid + n; return `<button class="btn ${amt <= p.cash ? '' : 'off'}" data-bid="${amt}">${au.bid === 0 ? '' : '+'}${au.bid === 0 ? fmt(amt) : n}</button>`; }).join('')}</div>
      <button class="btn block ghost" data-pass>Me retirer</button><p class="hint" style="text-align:center;margin-top:10px">Ton argent : <b>${fmt(p.cash)}</b></p>`;
  } else {
    h += `<p class="hint" style="text-align:center;font-size:15px"><b>${esc(P(cur).name)}</b> ${P(cur).bot ? '🤖 ' : ''}réfléchit…</p>`;
  }
  return h;
}
function openAuction(){
  if(U.isOpen('auction')) return;
  lastBid = S.auction ? S.auction.bid : 0;
  const ref = U.openSheet({ tag:'auction', title:'Enchères !', html:auctionHTML(), locked:true });
  const render = () => {
    ref.body.innerHTML = auctionHTML();
    const bidEl = $('#auBid', ref.el);
    if(S.auction && S.auction.bid !== lastBid){ lastBid = S.auction.bid; if(bidEl){ bidEl.classList.add('bump'); SND.play('bid'); } }
  };
  ref.el.addEventListener('click', e => {
    const b = e.target.closest('[data-bid]'); if(b){ ctl.dispatch({ t:'bid', amount:+b.dataset.bid }); return; }
    if(e.target.closest('[data-pass]')) ctl.dispatch({ t:'passBid' });
  });
  // le bouton ✕ ferme sans bloquer : le dock permet de rouvrir
  live.push({ ref, render });
}

/* =============================================================== échanges */
const tradable = pid => E.ownedBy(S, pid).filter(i => { const g = E.cell(S, i).group; return !(g && E.groupCells(S, g).some(k => S.props[k].h > 0)); });
function tradeSummaryHTML(t){
  const side = (s) => [...s.props.map(i => `<div class="mini-line" style="--gc:${gcol(E.cell(S, i))}"><i></i>${esc(E.cell(S, i).name)}${S.props[i].m ? ' 🏦' : ''}</div>`),
    s.cash ? `<div class="mini-line">💶 ${fmt(s.cash)}</div>` : '', s.jail ? '<div class="mini-line">🎟️ Carte prison</div>' : ''].join('') || '<div class="mini-line" style="color:var(--muted)">Rien</div>';
  return `<div class="offer-sum"><div><h6>${esc(P(t.from).name)} donne</h6>${side(t.give)}</div><div class="arrow">⇄</div><div><h6>${esc(P(t.to).name)} donne</h6>${side(t.get)}</div></div>`;
}
function tradeHTML(){
  const v = me(); if(!v) return '';
  const p = P(v);
  if(S.trade){
    const t = S.trade;
    return `<p class="hint" style="text-align:center;margin-bottom:6px">Offre en attente de réponse de <b>${esc(P(t.to).name)}</b></p>${tradeSummaryHTML(t)}${t.from === v ? '<button class="btn block danger" data-trcancel>Annuler l\'offre</button>' : ''}`;
  }
  if(!(E.turnPlayer(S).id === v && (S.phase === 'roll' || S.phase === 'end') && !S.debt)) return `<div class="empty-slot">Les échanges se proposent pendant ton tour, avant ou après avoir lancé les dés.</div>`;
  const others = E.active(S).filter(o => o.id !== v);
  if(!tr || !others.find(o => o.id === tr.partner)) tr = { partner:others.length === 1 ? others[0].id : null, give:{ props:[], cash:0, jail:0 }, get:{ props:[], cash:0, jail:0 } };
  let h = `<div class="partner-row">${others.map(o => `<button class="partner ${tr.partner === o.id ? 'on' : ''}" data-partner="${o.id}">${tokHTML(o)}${esc(o.name)}</button>`).join('')}</div>`;
  if(!tr.partner) return h + `<p class="hint" style="text-align:center">Choisis un joueur avec qui négocier.</p>`;
  const q = P(tr.partner);
  const col = (who, side, key) => `<div class="tr-col"><h5>${key === 'give' ? 'Tu donnes' : esc(who.name) + ' donne'}</h5>
    ${tradable(who.id).map(i => `<button class="tr-pill ${side.props.includes(i) ? 'on' : ''}" data-tp="${key}:${i}" style="--gc:${gcol(E.cell(S, i))}"><i></i>${esc(E.cell(S, i).short)}${S.props[i].m ? ' 🏦' : ''}</button>`).join('') || '<p class="hint" style="text-align:center;margin:6px 0">Aucun bien échangeable</p>'}
    <div class="stepper"><button data-tc="${key}:-50">−</button><b>${fmt(side.cash)}</b><button data-tc="${key}:50">+</button></div>
    ${who.jailCards ? `<button class="tr-pill ${side.jail ? 'on' : ''}" data-tj="${key}" style="margin-top:6px"><i style="background:#ffd75e"></i>🎟️ Carte prison</button>` : ''}</div>`;
  h += `<div class="tr-cols">${col(p, tr.give, 'give')}${col(q, tr.get, 'get')}</div>`;
  const t = { from:v, to:tr.partner, give:{ props:tr.give.props, cash:tr.give.cash, jail:tr.give.jail }, get:{ props:tr.get.props, cash:tr.get.cash, jail:tr.get.jail } };
  const err = E.validateTrade(S, t);
  h += `<p class="err-text" style="min-height:22px">${err && (tr.give.props.length || tr.get.props.length || tr.give.cash || tr.get.cash) ? esc(err) : ''}</p><button class="btn block xl ${err ? 'off' : ''}" data-trsend>Proposer l'échange</button>`;
  return h;
}
function openTrade(){
  if(U.isOpen('trade')) return;
  const ref = U.openSheet({ tag:'trade', title:'Échanger', html:tradeHTML() });
  const render = () => { const sb = ref.el.querySelector('.sheet-b'); const sc = sb.scrollTop; ref.body.innerHTML = tradeHTML(); sb.scrollTop = sc; };
  ref.el.addEventListener('click', e => {
    const t = e.target;
    let b;
    if((b = t.closest('[data-partner]'))){ tr = { partner:b.dataset.partner, give:{ props:[], cash:0, jail:0 }, get:{ props:[], cash:0, jail:0 } }; render(); return; }
    if((b = t.closest('[data-tp]'))){ const [k, i] = b.dataset.tp.split(':'); const arr = tr[k].props, n = +i; const j = arr.indexOf(n); if(j >= 0) arr.splice(j, 1); else arr.push(n); render(); return; }
    if((b = t.closest('[data-tc]'))){ const [k, d] = b.dataset.tc.split(':'); const who = k === 'give' ? P(me()) : P(tr.partner); tr[k].cash = Math.max(0, Math.min(who.cash, tr[k].cash + +d)); render(); return; }
    if((b = t.closest('[data-tj]'))){ const k = b.dataset.tj; tr[k].jail = tr[k].jail ? 0 : 1; render(); return; }
    if(t.closest('[data-trcancel]')){ ctl.dispatch({ t:'tradeCancel' }); return; }
    if(t.closest('[data-trsend]')){ ctl.dispatch({ t:'tradePropose', to:tr.partner, give:tr.give, get:tr.get }); tr = null; ref.close(); SND.play('tap'); }
  });
  live.push({ ref, render });
}
function openIncomingTrade(){
  const t = S.trade; if(!t || U.isOpen('tradein')) return;
  const ref = U.openSheet({ tag:'tradein', center:true, locked:true, html:'' });
  const render = () => {
    const tt = S.trade; if(!tt) return;
    const err = E.validateTrade(S, tt);
    ref.body.innerHTML = `<h3>🤝 Proposition</h3><p><b>${esc(P(tt.from).name)}</b> veut conclure un échange :</p>${tradeSummaryHTML(tt)}${err ? `<p class="err-text">${esc(err)}</p>` : ''}
      <div class="modal-actions"><button class="btn ghost" data-no>Refuser</button><button class="btn good ${err ? 'off' : ''}" data-ok>Accepter</button></div>`;
  };
  render();
  ref.el.addEventListener('click', e => {
    if(e.target.closest('[data-ok]')) ctl.dispatch({ t:'tradeAccept' });
    else if(e.target.closest('[data-no]')) ctl.dispatch({ t:'tradeDecline' });
  });
  live.push({ ref, render });
  SND.play('card');
}

/* =============================================================== pouvoirs */
function powersHTML(){
  const v = me(); if(!v) return '';
  const p = P(v), PW = E.POWERS;
  const can = E.turnPlayer(S).id === v && (S.phase === 'roll' || S.phase === 'end') && !S.debt && !S.trade && !S.auction && !S.pending;
  if(pw.mode){
    const m = pw.mode; let list = '';
    if(m === 'teleport'){
      list = E.board(S).map((c, i) => i === p.pos ? '' : `<button data-pwpick="${i}"><i style="--gc:${gcol(c)}"></i>${esc(c.short)}${c.price ? ' · ' + c.price : ''}</button>`).join('');
    } else if(m === 'builder'){
      list = E.ownedBy(S, v).filter(i => E.canBuildInfo(S, v, i, true).ok).map(i => `<button data-pwpick="${i}"><i style="--gc:${gcol(E.cell(S, i))}"></i>${esc(E.cell(S, i).short)} · ${S.props[i].h}🏠</button>`).join('') || '<p class="hint">Aucun terrain constructible.</p>';
    } else if(m === 'strike'){
      list = E.active(S).filter(o => o.id !== v).map(o => `<button data-pwpick="${o.id}">${tokHTML(o)} ${esc(o.name)}</button>`).join('');
    }
    return `<button class="btn sm ghost" data-pwback>‹ Retour</button><h4 style="margin:12px 0 0;font-family:var(--display)">${PW[m].icon} ${PW[m].name}</h4><p class="hint">${m === 'teleport' ? 'Choisis ta case de destination.' : m === 'builder' ? 'Choisis où construire gratuitement.' : 'Choisis le joueur à mettre en grève.'}</p><div class="picker">${list}</div>`;
  }
  if(!p.powers.length) return `<div class="empty-slot">Tu n'as aucune carte Pouvoir.<br>Passe par la case Départ pour en gagner !</div><p class="hint" style="text-align:center;margin-top:12px">Maximum ${E.MAX_POWERS} cartes en main.</p>`;
  const counts = {}; p.powers.forEach(t => counts[t] = (counts[t] || 0) + 1);
  return Object.keys(counts).map(t => {
    const d = PW[t]; let dis = '', off = false;
    if(d.reactive) dis = 'Automatique';
    else if(!can){ dis = 'Pendant ton tour'; off = true; }
    else if(t === 'teleport' && (S.phase !== 'roll' || p.inJail || S.doubles > 0)){ dis = 'Avant ton lancer'; off = true; }
    return `<div class="pw"><div class="pi">${d.icon}</div><div class="pt"><b>${d.name}${counts[t] > 1 ? ' ×' + counts[t] : ''}</b><small>${d.desc}</small></div>${d.reactive ? `<span class="tag">${dis}</span>` : `<button class="btn sm ${off ? 'off' : ''}" data-pwuse="${t}">${off ? dis : 'Utiliser'}</button>`}</div>`;
  }).join('') + `<p class="hint" style="text-align:center;margin-top:12px">Tu gagnes une carte à chaque passage par la case Départ (max ${E.MAX_POWERS}).</p>`;
}
function openPowers(){
  if(U.isOpen('powers')) return;
  pw = { mode:null };
  const ref = U.openSheet({ tag:'powers', title:'Cartes Pouvoir', html:powersHTML(), onClose:() => { pw = { mode:null }; } });
  const render = () => { ref.body.innerHTML = powersHTML(); };
  ref.el.addEventListener('click', e => {
    let b;
    if((b = e.target.closest('[data-pwuse]'))){
      const t = b.dataset.pwuse;
      if(t === 'racket'){ ctl.dispatch({ t:'power', type:'racket' }); SND.play('power'); ref.close(); }
      else { pw.mode = t; render(); }
    } else if(e.target.closest('[data-pwback]')){ pw.mode = null; render(); }
    else if((b = e.target.closest('[data-pwpick]'))){
      const m = pw.mode, val = b.dataset.pwpick;
      const a = { t:'power', type:m };
      if(m === 'teleport' || m === 'builder') a.idx = +val; else a.target = val;
      pw.mode = null; ctl.dispatch(a); SND.play('power'); ref.close();
    }
  });
  live.push({ ref, render });
}

/* =============================================================== journal / menu */
function logHTML(){
  return S.log.slice().reverse().map(l => `<div class="log-l ${l.k}"><span class="lr">T${l.r}</span><span>${esc(l.m)}</span></div>`).join('') || '<p class="hint">Rien pour le moment.</p>';
}
function openLog(){
  if(U.isOpen('log')) return;
  const ref = U.openSheet({ tag:'log', title:'Journal de partie', html:logHTML() });
  live.push({ ref, render:() => { ref.body.innerHTML = logHTML(); } });
}
function openMenu(){
  const on = SND.isOn();
  const ref = U.openSheet({ tag:'menu', title:'Menu', html:`
    ${ctl.code ? `<div class="panel" style="text-align:center;margin-bottom:12px"><div class="hint">Code du salon</div><div style="font-family:var(--display);font-size:34px;font-weight:800;letter-spacing:.2em">${esc(ctl.code)}</div></div>` : ''}
    <button class="btn block ghost" data-m="rules" style="margin-bottom:10px">📖 Règles du jeu</button>
    <button class="btn block ghost" data-m="sound" style="margin-bottom:10px">${on ? '🔊 Son activé' : '🔇 Son coupé'}</button>
    <button class="btn block ghost" data-m="log" style="margin-bottom:10px">📜 Journal de partie</button>
    <button class="btn block danger" data-m="quit">Quitter la partie</button>` });
  ref.el.addEventListener('click', async e => {
    const b = e.target.closest('[data-m]'); if(!b) return;
    const m = b.dataset.m;
    if(m === 'rules'){ U.openRules(); }
    else if(m === 'log'){ ref.close(); openLog(); }
    else if(m === 'sound'){ SND.set(!SND.isOn()); b.textContent = SND.isOn() ? '🔊 Son activé' : '🔇 Son coupé'; }
    else if(m === 'quit'){
      const txt = ctl.mode === 'client' ? "Tu quittes la partie. Elle continuera sans toi (un pilote automatique prendra ta place)." : ctl.mode === 'host' ? "Tu es l'hôte : la partie sera fermée pour tous les joueurs." : "La partie locale est sauvegardée : tu pourras la reprendre depuis l'accueil.";
      if(await U.confirmModal({ title:'Quitter la partie ?', text:txt, ok:'Quitter', danger:true })){ ref.close(); ctl.exit(); }
    }
  });
}

/* =============================================================== carte tirée */
function cardFx(e){
  return new Promise(res => {
    const p = P(e.p), mineP = me() === e.p || (ctl.mode === 'local' && !p.bot);
    const name = e.deck === 'minor' ? TH.minorName : TH.majorName, icon = TH.icons[e.deck];
    SND.play('card');
    const ref = U.openSheet({ center:true, bare:true, locked:true, html:`<div style="width:100%;max-width:340px;text-align:center">
      <div style="margin-bottom:12px;font-weight:700;color:var(--muted)">${tokHTML(p)} <b style="color:#fff">${esc(p.name)}</b> pioche…</div>
      <div class="draw-card"><div class="in"><div class="fc back">${icon}</div><div class="fc front"><div class="dn">${esc(name)}</div><div class="ic">${icon}</div><p>${esc(e.text)}</p></div></div></div>
      <div style="margin-top:16px;height:50px"><button class="btn" id="cardOk" style="min-width:170px;opacity:0;pointer-events:none;transition:opacity .3s">OK</button></div></div>` });
    let done = false;
    const close = () => { if(done) return; done = true; ref.close(); setTimeout(res, 250); };
    setTimeout(() => { const b = $('#cardOk', ref.el); if(b && mineP){ b.style.opacity = 1; b.style.pointerEvents = 'auto'; } }, 900);
    ref.el.addEventListener('click', ev => { if(mineP && (ev.target.closest('#cardOk'))) close(); });
    setTimeout(close, mineP ? 14000 : 3400);
  });
}

/* =============================================================== effets & file d'événements */
function chipEl(pid){ return $(`.pchip[data-pl="${pid}"]`); }
function floatCash(pid, d){
  const el = chipEl(pid); if(!el || !d) return;
  const r = el.getBoundingClientRect();
  const f = document.createElement('div'); f.className = 'float-cash ' + (d > 0 ? 'up' : 'down');
  f.textContent = (d > 0 ? '+' : '−') + Math.abs(d) + ' €';
  f.style.left = (r.left + r.width / 2 - 24) + 'px'; f.style.top = (r.top + 10) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1500);
}
function flashCell(i){ const el = cells[i]; if(!el) return; el.classList.remove('flash'); el.offsetWidth; el.classList.add('flash'); }
function setMsg(t){ const m = $('#cmsg'); if(!m) return; m.classList.remove('pop'); m.offsetWidth; m.textContent = t; m.classList.add('pop'); }

async function animateMove(e){
  const p = P(e.p); if(!p) return;
  const el = tokEls[e.p];
  if(e.tele || e.path.length <= 2 && Math.abs(e.to - e.from) > 12){
    if(el){ el.style.transition = 'transform .45s cubic-bezier(.5,0,.2,1)'; }
    view.pos[e.p] = e.to; placeTokens(); SND.play('power');
    await sleep(520); if(el) el.style.transition = ''; return;
  }
  const n = e.path.length - 1, step = n > 14 ? 90 : n > 8 ? 120 : 150;
  if(el) el.classList.add('hop');
  for(let k = 1; k < e.path.length; k++){
    view.pos[e.p] = e.path[k]; placeTokens(); SND.play('step'); await sleep(step);
  }
  if(el) el.classList.remove('hop');
  await sleep(120);
}

function enqueue(evs){
  const add = fn => queue.push(fn);
  evs.forEach(e => {
    switch(e.t){
      case 'dice': add(async () => { SND.play('dice'); rollDiceAnim(e.d); setMsg(`${P(e.p).name} lance les dés…`); await sleep(1250); const sm = $('#diceSum'); if(sm){ sm.textContent = e.d[0] + e.d[1]; sm.classList.add('on'); } setMsg(`${e.d[0]} + ${e.d[1]} = ${e.d[0] + e.d[1]}${e.d[0] === e.d[1] ? ' · double !' : ''}`); await sleep(300); }); break;
      case 'move': add(() => animateMove(e)); break;
      case 'cash': add(() => { floatCash(e.p, e.d); renderPlayers(); SND.play(e.d > 0 ? 'coin' : 'pay'); }); break;
      case 'card': add(async () => { await cardFx(e); }); break;
      case 'buy': add(async () => { renderBoardDyn(); flashCell(e.idx); SND.play('buy'); setMsg(`${P(e.p).name} achète ${E.cell(S, e.idx).name}`); await sleep(500); }); break;
      case 'build': add(async () => { renderBoardDyn(); flashCell(e.idx); SND.play('build'); await sleep(420); }); break;
      case 'rent': add(async () => { flashCell(e.idx); setMsg(`${P(e.from).name} paie ${e.amount} € à ${P(e.to).name}`); await sleep(520); }); break;
      case 'jail': add(async () => { SND.play('jail'); U.toast(`⛓️ ${esc(P(e.p).name)} va en prison !`, 'bad'); await sleep(700); }); break;
      case 'free': add(async () => { U.toast(`🔓 ${esc(P(e.p).name)} sort de prison`, 'good'); await sleep(300); }); break;
      case 'jackpot': add(async () => { SND.play('win'); U.toast(`💰 ${esc(P(e.p).name)} remporte la cagnotte : ${fmt(e.amount)} !`, 'good', 3200); U.confetti(30); await sleep(900); }); break;
      case 'power': add(async () => { SND.play('power'); const d = E.POWERS[e.type]; U.toast(`${d.icon} ${esc(P(e.p).name)} joue ${d.name}`, 'warn'); await sleep(650); }); break;
      case 'gainPower': add(() => { if(me() === e.p){ SND.play('power'); U.toast(`${E.POWERS[e.type].icon} Nouvelle carte : ${E.POWERS[e.type].name}`, 'good'); } }); break;
      case 'bankrupt': add(async () => { SND.play('bankrupt'); U.toast(`💥 ${esc(P(e.p).name)} fait faillite !`, 'bad', 3200); await sleep(900); }); break;
      case 'debt': add(() => { if(me() === e.p) U.toast('⚠️ Tu dois de l\'argent : vends ou hypothèque !', 'warn', 3500); }); break;
      case 'tradeOffer': add(() => { if(me() !== e.to) U.toast(`🤝 ${esc(P(e.from).name)} propose un échange à ${esc(P(e.to).name)}`); }); break;
      case 'trade': add(() => { SND.play('buy'); U.toast(`🤝 Échange conclu : ${esc(P(e.a).name)} ⇄ ${esc(P(e.b).name)}`, 'good', 3000); renderBoardDyn(); }); break;
      case 'tradeNo': add(() => U.toast(`✋ ${esc(P(e.p).name)} refuse l'échange`)); break;
      case 'turn': add(async () => { const tp = P(e.p); SND.play(me() === e.p ? 'turn' : 'tap'); setMsg(`Au tour de ${tp.name}`); if(ctl.hotseat && ctl.hotseat() && !tp.bot) await passDevice(tp); }); break;
      case 'win': add(async () => { SND.play('win'); U.confetti(110); await sleep(600); }); break;
      default: break;
    }
  });
}

function passDevice(p){
  return new Promise(res => {
    const el = document.createElement('div'); el.className = 'pass-dev';
    el.innerHTML = `<div>${tokHTML(p)}<h2 style="font-size:30px">À toi, ${esc(p.name)} !</h2><p class="hint" style="margin:8px 0 22px">Passe l'appareil au prochain joueur.</p><button class="btn xl" style="min-width:220px">Je suis prêt</button></div>`;
    document.body.appendChild(el);
    $('button', el).onclick = () => { el.remove(); res(); };
  });
}

async function runQueue(){
  if(busy) return; busy = true;
  while(queue.length){ const job = queue.shift(); try { await job(); } catch(err){ console.error(err); } }
  busy = false;
  afterQueue();
}
function afterQueue(){
  if(!S) return;
  S.players.forEach(p => { view.pos[p.id] = p.pos; });
  placeTokens();
  renderPlayers(); renderBoardDyn(); renderTop(); renderDock();
  const last = S.log[S.log.length - 1]; if(last && !S.winner) setMsg(last.m.length > 110 ? last.m.slice(0, 107) + '…' : last.m);
  syncSheets(); refreshLive();
  if(S.winner) showOver();
  if(ctl && ctl.idle) ctl.idle();
}
function refreshLive(){
  live = live.filter(l => !l.ref.closed);
  live.forEach(l => { try { l.render(); } catch(e){ console.error(e); } });
}
function syncSheets(){
  const v = me();
  if(S.auction && !U.isOpen('auction') && !S.winner) openAuction();
  if(!S.auction && U.isOpen('auction')) U.getOpen('auction').close();
  if(S.trade && S.trade.to === v && !U.isOpen('tradein') && !S.winner) openIncomingTrade();
  if(!S.trade && U.isOpen('tradein')) U.getOpen('tradein').close();
}

/* =============================================================== fin de partie */
function showOver(){
  if(overShown) return; overShown = true;
  const st = E.standings(S), v = me();
  const winner = P(S.winner);
  const xpBox = ctl.award ? ctl.award(S, st) : null;
  const pod = st.slice(0, 3);
  const order = pod.length === 3 ? [1, 0, 2] : pod.length === 2 ? [1, 0] : [0];
  const podium = order.map(k => { const p = P(pod[k].id); return `<div class="pod p${k + 1}"><div class="tok" style="background:${p.token.c}">${p.token.e}</div><b>${esc(p.name)}</b><small>${fmt(pod[k].worth)}</small><div class="bar"><span>${['🥇', '🥈', '🥉'][k]}</span></div></div>`; }).join('');
  const rows = st.map((s, i) => { const p = P(s.id); return `<div class="rank-row"><span class="rk">${i + 1}</span>${tokHTML(p)}<div class="rn">${esc(p.name)}${s.bankrupt ? ' 💥' : ''}<small>Loyers touchés ${fmt(p.stats.rentGot)} · payés ${fmt(p.stats.rentPaid)} · ${p.stats.bought} biens</small></div><b class="num">${s.bankrupt ? 'Faillite' : fmt(s.worth)}</b></div>`; }).join('');
  const el = document.createElement('div'); el.className = 'over'; el.id = 'overEl';
  el.innerHTML = `<div style="font-size:60px">🏆</div><h2>${winner ? esc(winner.name) : 'Fin'} l'emporte !</h2><div class="sub">${S.endReason === 'rounds' ? `Le plus riche après ${S.rules.rounds} tours` : 'Dernier joueur en lice'} · ${S.round} tours joués</div>
    <div class="podium">${podium}</div>${xpBox || ''}${rows}
    <div style="display:flex;gap:10px;width:100%;max-width:420px;margin-top:16px">${ctl.replay ? '<button class="btn ghost" id="ovReplay" style="flex:1">Rejouer</button>' : ''}<button class="btn" id="ovMenu" style="flex:1">Menu principal</button></div>`;
  document.body.appendChild(el);
  $('#ovMenu', el).onclick = () => { el.remove(); ctl.exit(true); };
  const rp = $('#ovReplay', el); if(rp) rp.onclick = () => { el.remove(); overShown = false; ctl.replay(); };
}

/* =============================================================== événements du dock */
function onDock(e){
  const b = e.target.closest('[data-a]'); if(b){
    const a = b.dataset.a; SND.play('tap');
    switch(a){
      case 'roll': ctl.dispatch({ t:'roll' }); break;
      case 'buy': ctl.dispatch({ t:'buy' }); break;
      case 'decline': ctl.dispatch({ t:'declineBuy' }); break;
      case 'end': ctl.dispatch({ t:'endTurn' }); break;
      case 'payJail': ctl.dispatch({ t:'payJail' }); break;
      case 'jailCard': ctl.dispatch({ t:'useJailCard' }); break;
      case 'shieldYes': ctl.dispatch({ t:'shield', use:true }); break;
      case 'shieldNo': ctl.dispatch({ t:'shield', use:false }); break;
      case 'bankrupt': U.confirmModal({ title:'Déclarer faillite ?', text:'Tu perds tous tes biens et tu quittes la partie.', ok:'Faillite', danger:true }).then(ok => { if(ok) ctl.dispatch({ t:'bankrupt' }); }); break;
      case 'assets': openAssets(); break;
      case 'trade': if(S.trade && S.trade.from === me()) ctl.dispatch({ t:'tradeCancel' }); else openTrade(); break;
      case 'tradein': openIncomingTrade(); break;
      case 'powers': openPowers(); break;
      case 'log': openLog(); break;
      case 'menu': openMenu(); break;
      case 'auction': openAuction(); break;
      case 'over': overShown = false; showOver(); break;
    }
  }
}

/* =============================================================== API publique */
function onState(ns){
  const first = !S;
  S = ns;
  if(!built || !TH || TH.id !== S.theme || tokEls[S.players[0].id] === undefined){ lastSeq = -1; built = false; buildBoard(); }
  if(first || S.seq === lastSeq + 0 && !busy){ /* rien */ }
  const jump = S.seq - lastSeq;
  if(lastSeq >= 0 && jump >= 1 && S.events.length && jump <= 2 && queue.length < 8){
    enqueue(S.events);
  } else if(lastSeq >= 0 && jump !== 0){
    // trop de retard : on se synchronise sans animation
    queue = []; setDiceInstant(S.dice);
    S.players.forEach(p => { view.pos[p.id] = p.pos; });
  } else if(lastSeq < 0){
    setDiceInstant(S.dice);
    if(S.seq === 0 || true) S.players.forEach(p => { view.pos[p.id] = p.pos; });
  }
  lastSeq = S.seq;
  if(!busy && !queue.length){
    placeTokens(); renderPlayers(); renderBoardDyn(); renderTop(); renderDock(); syncSheets(); refreshLive();
    if(S.winner) showOver();
  } else renderTop();
  if(queue.length && !busy) runQueue();
  else if(!queue.length && !busy && ctl && ctl.idle) ctl.idle();
}

function mount(c, state){
  ctl = c; S = null; built = false; lastSeq = -1; queue = []; busy = false; live = []; lastCash = {}; overShown = false; tr = null; pw = { mode:null };
  $('#overEl') && $('#overEl').remove();
  U.showScreen('gameScreen');
  const dock = $('#gDock');
  dock.onclick = onDock;
  $('#gMenu').onclick = () => { SND.play('tap'); openMenu(); };
  $('#gPlayers').onclick = e => { const b = e.target.closest('[data-pl]'); if(b) openPlayerInfo(b.dataset.pl); };
  $('#board').onclick = e => { const c = e.target.closest('.cell'); if(c){ SND.play('tap'); openDeed(+c.dataset.i); } };
  const w = $('.g-boardwrap');
  if(ro) ro.disconnect();
  ro = new ResizeObserver(() => fitBoard()); ro.observe(w);
  window.onresize = () => fitBoard();
  onState(state);
  requestAnimationFrame(() => { fitBoard(); setTimeout(fitBoard, 120); });
}
function openPlayerInfo(pid){
  const p = P(pid), owned = E.ownedBy(S, pid);
  const html = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">${tokHTML(p, '')}<div style="flex:1"><b style="font-size:19px">${esc(p.name)}</b>${p.bot ? '<span class="tag bot">Bot</span>' : ''}<div class="hint">${p.bankrupt ? 'En faillite' : 'Patrimoine ' + fmt(E.netWorth(S, pid))}</div></div><div style="text-align:right"><b class="num" style="font-size:22px;font-family:var(--display)">${fmt(p.cash)}</b></div></div>
    ${owned.length ? owned.map(i => { const c = E.cell(S, i), pr = S.props[i]; return `<div class="arow ${pr.m ? 'm' : ''}" data-deed="${i}"><div class="an"><span class="houses-ind" style="margin:0 8px 0 0"><i style="width:10px;height:14px;background:${gcol(c)}"></i></span>${esc(c.name)}<small>${pr.m ? 'Hypothéqué' : pr.h ? (pr.h === 5 ? 'Hôtel' : pr.h + ' maison(s)') : 'Terrain nu'}</small></div></div>`; }).join('') : '<div class="empty-slot">Aucun bien</div>'}`;
  const ref = U.openSheet({ tag:'player', title:'Joueur', html });
  ref.el.addEventListener('click', e => { const d = e.target.closest('[data-deed]'); if(d) openDeed(+d.dataset.deed); });
}
const isBusy = () => busy || queue.length > 0;

MP.gameui = { mount, onState, isBusy, fitBoard, unmount(){ if(ro) ro.disconnect(); ro = null; S = null; built = false; live = []; queue = []; busy = false; const o = $('#overEl'); if(o) o.remove(); } };
})();
