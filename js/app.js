/* MultiPoly v2 — application : accueil, profil, création, salons en ligne, contrôleur de partie. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const E = MP.engine, U = MP.ui, PF = MP.profile, N = MP.net, SND = MP.sound;
const { $, $$, esc, fmt } = U;
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
const lsDel = k => { try { localStorage.removeItem(k); } catch(e){} };

const BOT_NAMES = ['Léo', 'Maya', 'Hugo', 'Zoé', 'Nina', 'Axel', 'Lina', 'Noa', 'Jade', 'Ravi', 'Sacha', 'Inès'];
const END_OPTS = [
  { k:'r20', l:'Rapide', s:'20 tours', end:'rounds', rounds:20 },
  { k:'r30', l:'Standard', s:'30 tours', end:'rounds', rounds:30 },
  { k:'r50', l:'Marathon', s:'50 tours', end:'rounds', rounds:50 },
  { k:'classic', l:'Classique', s:'jusqu\'à la faillite', end:'classic' },
];
const CASH_OPTS = [1000, 1500, 2500];
const NEWS = [
  { d:'Maintenant', i:'🎲', t:'MultiPoly 2.0', p:"Refonte totale : nouveau plateau, dés 3D, sons, animations, et un moteur de règles complet." },
  { d:'Maintenant', i:'🏦', t:'Vraies règles', p:"Enchères, hypothèques, prison, échanges, faillites, cagnotte du parking : tout y est." },
  { d:'Maintenant', i:'⚡', t:'Cartes Pouvoir', p:"Bouclier, téléportation, racket, chantier offert, grève : un twist exclusif MultiPoly." },
  { d:'Maintenant', i:'🌍', t:'9 univers', p:"Football, Monde, France, Pirates, Cinéma, Jeux vidéo et trois nouveaux : Espace, Fête foraine, Cuisine du monde." },
  { d:'Maintenant', i:'🌐', t:'En ligne fiable', p:"Salons avec code, bots pour compléter la table, reprise si tu quittes, pilote automatique si un joueur s'absente." },
];

/* ================================================================== état de l'application */
let SU = null;                // réglages de création
let Game = null;              // partie en cours
let hub = { online:false };

function defaultSetup(){
  const nm = PF.get().pseudo || 'Moi';
  return { mode:'local', theme:'football', rules:{ startCash:1500, endK:'r30', jackpot:true, auctions:true, powers:true },
    players:[{ name:nm, bot:false, tokenIdx:0, me:true }, { name:'Léo', bot:true, tokenIdx:1 }, { name:'Maya', bot:true, tokenIdx:2 }] };
}
function loadSetup(){
  const s = lsGet('mp_setup_v2') || defaultSetup();
  if(!MP.THEMES[s.theme]) s.theme = 'football';
  if(!s.players || s.players.length < 2) s.players = defaultSetup().players;
  s.rules = Object.assign(defaultSetup().rules, s.rules || {});
  s.players.forEach((p, i) => { if(i === 0){ p.me = true; p.bot = false; p.name = PF.get().pseudo || p.name; } else p.me = false; });
  return s;
}
const saveSetup = () => lsSet('mp_setup_v2', SU);
const endOpt = k => END_OPTS.find(o => o.k === k) || END_OPTS[1];
const rulesFromSetup = () => { const r = SU.rules, o = endOpt(r.endK); return { startCash:r.startCash, end:o.end, rounds:o.rounds || 30, jackpot:r.jackpot, auctions:r.auctions, powers:r.powers }; };

/* ================================================================== profil / accueil */
function renderMe(){
  const p = PF.get(), em = PF.emblem();
  const emb = $('#meEmb'); if(!emb) return;
  emb.textContent = PF.has() ? em.e : '👤'; emb.style.background = PF.has() ? em.c : 'var(--surface2)';
  $('#meName').textContent = PF.has() ? p.pseudo : 'Crée ton profil';
  $('#meLvl').textContent = 'Niv. ' + PF.level();
  $('#meXp').style.width = (PF.xpInto() / PF.XP_PER_LEVEL * 100) + '%';
  $('#soundBtn').textContent = SND.isOn() ? '🔊' : '🔇';
}
function renderProfile(){
  const p = PF.get(), lvl = PF.level();
  $('#lvlBadge').textContent = lvl; $('#lvlNum').textContent = lvl;
  $('#pfXp').style.width = (PF.xpInto() / PF.XP_PER_LEVEL * 100) + '%';
  $('#pfXpTxt').textContent = `${PF.xpInto()} / ${PF.XP_PER_LEVEL} XP`;
  const inp = $('#pseudoInput'); if(document.activeElement !== inp) inp.value = p.pseudo;
  $('#stGames').textContent = p.gamesPlayed; $('#stWins').textContent = p.gamesWon; $('#stBest').textContent = p.bestWorth > 0 ? fmt(p.bestWorth) : '—';
  const nxt = PF.EMBLEMS.filter(e => !e.secretName && e.unlock > lvl).sort((a, b) => a.unlock - b.unlock)[0];
  $('#nextUnlock').textContent = nxt ? `Prochain : niveau ${nxt.unlock}` : 'Tous débloqués !';
  const live = inp.value;
  $('#embGrid').innerHTML = PF.EMBLEMS.map((em, i) => {
    const ok = PF.unlocked(em, lvl, live);
    if(em.secretName && !ok) return '';
    return `<button class="emb ${i === p.emblemIdx && ok ? 'picked' : ''} ${ok ? '' : 'locked'}" data-e="${i}" style="${ok ? 'background:' + em.c : ''}">${em.e}${ok ? '' : `<small>Nv.${em.unlock}</small>`}</button>`;
  }).join('');
}
function openProfile(first){
  $('#profileTitle').textContent = first ? 'Bienvenue !' : 'Ton profil';
  $('#profileBack').style.visibility = first ? 'hidden' : 'visible';
  renderProfile(); U.showScreen('profileScreen');
}

let tickerT = null, lastHubTheme = MP.THEME_ORDER[Math.floor(Math.random() * MP.THEME_ORDER.length)];
function startTicker(){
  stopTicker();
  const ids = MP.THEME_ORDER; let i = Math.max(0, ids.indexOf(lastHubTheme));
  const show = () => {
    const id = ids[i % ids.length], t = MP.THEMES[id]; i++; lastHubTheme = id;
    const el = $('#uniTicker'); if(!el) return;
    el.innerHTML = `<span class="emo">${t.icon}</span><span>Univers : <b>${esc(t.label)}</b></span>`;
    U.applyTheme(id);
  };
  show(); tickerT = setInterval(show, 4200);
}
function stopTicker(){ if(tickerT){ clearInterval(tickerT); tickerT = null; } }

function showHub(){
  Game = null; MP.gameui.unmount();
  hub.online = false; $('#hubTiles').style.display = ''; $('#hubOnline').style.display = 'none';
  renderMe(); renderResume();
  U.showScreen('landing'); startTicker();
}
function renderResume(){
  const z = $('#resumeZone'); z.innerHTML = '';
  const loc = lsGet('mp_local_v2');
  if(loc && loc.S && !loc.S.winner){
    const th = MP.THEMES[loc.S.theme];
    z.innerHTML += `<div class="resume-bar"><span style="font-size:28px">${th.icon}</span><div><b>Partie locale en cours</b><small>${esc(th.label)} · tour ${loc.S.round} · ${loc.S.players.length} joueurs</small></div><button class="btn sm" id="resLocal">Reprendre</button></div>`;
  }
  const host = lsGet('mp_host_v2'), cli = lsGet('mp_client_v2');
  const fresh = o => o && o.code && (Date.now() - o.ts) < 12 * 3600e3;
  if(fresh(host)) z.innerHTML += `<div class="resume-bar"><span style="font-size:28px">🌐</span><div><b>Ton salon ${esc(host.code)}</b><small>Reprendre en tant qu'hôte</small></div><button class="btn sm" id="resHost">Reprendre</button></div>`;
  else if(fresh(cli)) z.innerHTML += `<div class="resume-bar"><span style="font-size:28px">🌐</span><div><b>Partie en ligne ${esc(cli.code)}</b><small>Te reconnecter au salon</small></div><button class="btn sm" id="resClient">Rejoindre</button></div>`;
  const a = $('#resLocal'); if(a) a.onclick = () => { stopTicker(); startLocalFromSave(loc); };
  const b = $('#resHost'); if(b) b.onclick = () => { stopTicker(); resumeHost(host.code); };
  const c = $('#resClient'); if(c) c.onclick = () => { stopTicker(); joinRoom(cli.code); };
}

function setConn(s){
  const el = $('#connDot'); if(!el) return;
  el.className = 'conn ' + (s === 'ok' ? 'ok' : s === 'bad' ? 'bad' : '');
  $('span', el).textContent = s === 'ok' ? 'Serveur en ligne connecté' : s === 'bad' ? 'Hors ligne — le mode local fonctionne' : 'Connexion au serveur…';
}

/* ================================================================== création de partie */
function openSetup(mode){
  SU = loadSetup(); SU.mode = mode;
  stopTicker();
  $('#setupTitle').textContent = mode === 'local' ? 'Partie locale' : 'Nouveau salon';
  $('#setupPlayersBox').style.display = mode === 'local' ? '' : 'none';
  $('#setupGo').textContent = mode === 'local' ? 'Lancer la partie' : 'Ouvrir le salon';
  renderSetup(); U.showScreen('setupScreen');
  const row = $('#uniRow'); const on = $('.uni.on', row); if(on) row.scrollTo({ left:on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2 });
}
function renderSetup(){
  const th = MP.THEMES[SU.theme]; U.applyTheme(SU.theme);
  $('#uniRow').innerHTML = MP.THEME_ORDER.map(id => { const t = MP.THEMES[id]; return `<button class="uni ${id === SU.theme ? 'on' : ''}" data-u="${id}" style="--ua:${t.ui.accent}"><span class="emo">${t.icon}</span><b>${esc(t.label)}</b><div class="strip">${t.groupColors.map(c => `<i style="background:${c}"></i>`).join('')}</div></button>`; }).join('');
  $('#uniTag').textContent = th.tagline;
  if(SU.mode === 'local'){
    $('#plCount').textContent = `${SU.players.length} / 6`;
    $('#plist').innerHTML = SU.players.map((p, i) => { const tk = th.tokens[p.tokenIdx % th.tokens.length];
      return `<div class="prow"><button class="tok" data-tk="${i}" style="background:${tk.c}" aria-label="Changer de pion">${tk.e}</button>
      <input class="input" data-nm="${i}" maxlength="14" value="${esc(p.name)}" placeholder="Joueur ${i + 1}" ${p.me ? '' : ''}>
      <button class="botbtn ${p.bot ? 'on' : ''}" data-bot="${i}" aria-label="Bot ou humain">${p.bot ? '🤖' : '👤'}</button>
      ${i >= 2 ? `<button class="rm" data-rm="${i}" aria-label="Retirer">✕</button>` : '<span style="width:6px"></span>'}</div>`; }).join('');
    $('#addPlayer').style.display = SU.players.length >= 6 ? 'none' : '';
  }
  $('#chipsCash').innerHTML = CASH_OPTS.map(c => `<button class="chip ${SU.rules.startCash === c ? 'on' : ''}" data-cash="${c}">${fmt(c)}</button>`).join('');
  $('#chipsEnd').innerHTML = END_OPTS.map(o => `<button class="chip ${SU.rules.endK === o.k ? 'on' : ''}" data-end="${o.k}">${o.l}<span style="display:block;font-size:11px;font-weight:600;opacity:.7">${o.s}</span></button>`).join('');
  const opt = (k, ic, t, d) => `<div class="toggle-row" data-opt="${k}"><span class="tr-ic">${ic}</span><span class="tr-tx"><b>${t}</b><small>${d}</small></span><span class="sw ${SU.rules[k] ? 'on' : ''}"></span></div>`;
  $('#optsBox').innerHTML = opt('powers', '⚡', 'Cartes Pouvoir', 'Bouclier, téléportation, racket, chantier, grève.') + opt('auctions', '🔨', 'Enchères', 'Un terrain refusé part aux enchères.') + opt('jackpot', '💰', 'Cagnotte du parking', 'Taxes et amendes à empocher sur la case Parking.');
}
function setupEvents(){
  $('#uniRow').addEventListener('click', e => { const b = e.target.closest('[data-u]'); if(!b) return; SU.theme = b.dataset.u; SND.play('tap'); saveSetup(); renderSetup(); });
  $('#plist').addEventListener('click', e => {
    const t = e.target; let b;
    if((b = t.closest('[data-tk]'))){ const i = +b.dataset.tk, n = MP.THEMES[SU.theme].tokens.length; const used = new Set(SU.players.map(p => p.tokenIdx)); let k = SU.players[i].tokenIdx; for(let s = 0; s < n; s++){ k = (k + 1) % n; if(!used.has(k)) break; } SU.players[i].tokenIdx = k; SND.play('tap'); }
    else if((b = t.closest('[data-bot]'))){ const i = +b.dataset.bot; if(i === 0) return; SU.players[i].bot = !SU.players[i].bot; if(SU.players[i].bot && /^Joueur/.test(SU.players[i].name)) SU.players[i].name = BOT_NAMES[i % BOT_NAMES.length]; }
    else if((b = t.closest('[data-rm]'))){ SU.players.splice(+b.dataset.rm, 1); }
    else return;
    saveSetup(); renderSetup();
  });
  $('#plist').addEventListener('input', e => { const i = e.target.dataset.nm; if(i !== undefined){ SU.players[+i].name = e.target.value; saveSetup(); } });
  $('#addPlayer').onclick = () => {
    if(SU.players.length >= 6) return;
    const th = MP.THEMES[SU.theme], used = new Set(SU.players.map(p => p.tokenIdx));
    let k = 0; while(used.has(k) && k < th.tokens.length) k++;
    const names = new Set(SU.players.map(p => p.name)); let nm = BOT_NAMES.find(n => !names.has(n)) || 'Joueur ' + (SU.players.length + 1);
    SU.players.push({ name:nm, bot:true, tokenIdx:k }); saveSetup(); renderSetup(); SND.play('tap');
  };
  $('#chipsCash').addEventListener('click', e => { const b = e.target.closest('[data-cash]'); if(b){ SU.rules.startCash = +b.dataset.cash; saveSetup(); renderSetup(); } });
  $('#chipsEnd').addEventListener('click', e => { const b = e.target.closest('[data-end]'); if(b){ SU.rules.endK = b.dataset.end; saveSetup(); renderSetup(); } });
  $('#optsBox').addEventListener('click', e => { const b = e.target.closest('[data-opt]'); if(b){ SU.rules[b.dataset.opt] = !SU.rules[b.dataset.opt]; saveSetup(); renderSetup(); SND.play('tap'); } });
  $('#setupBack').onclick = () => showHub();
  $('#setupGo').onclick = () => { SND.play('tap'); SU.mode === 'local' ? startLocal() : createRoom(); };
}

/* ================================================================== contrôleur de partie */
let botT = null, watchT = null;
function newCtl(mode, S, extra){
  const g = Object.assign({
    mode, S, code:null, myPid:null, meIdx:null,
    viewer(){
      if(this.mode !== 'local') return this.myPid;
      const a = E.actor(this.S), p = a ? E.P(this.S, a) : null;
      if(p && !p.bot) return a;
      const h = this.S.players.find(q => !q.bot && !q.bankrupt);
      return h ? h.id : this.S.players[0].id;
    },
    hotseat(){ return this.mode === 'local' && this.S.players.filter(p => !p.bot).length >= 2; },
    dispatch(a){ dispatchAction(a); },
    idle(){ tickBots(); },
    exit(finished){ exitGame(finished); },
    award(S, st){ return awardXP(S, st); },
  }, extra || {});
  return g;
}
function mountGame(){
  stopTicker(); U.closeAll();
  MP.gameui.mount(Game, Game.S);
}
function dispatchAction(a){
  const g = Game; if(!g || !g.S) return;
  if(g.mode === 'client'){
    if(!N.pub(N.topicI(g.code), { t:'act', dev:PF.deviceId(), pid:g.myPid, a })){ U.toast('Connexion perdue…', 'bad'); }
    return;
  }
  const by = g.viewer();
  const r = E.act(g.S, Object.assign({}, a, { by }));
  if(!r.ok){ U.toast(esc(r.error), 'bad', 2200); SND.play('bad'); return; }
  const p = E.P(g.S, by); if(p){ p.auto = false; p.afk = 0; }
  commit();
}
function commit(){
  const g = Game; if(!g) return;
  if(g.mode === 'local') lsSet('mp_local_v2', { S:g.S, meIdx:g.meIdx, ts:Date.now() });
  if(g.mode === 'host') publishRoom();
  MP.gameui.onState(g.S);
}
function tickBots(){
  const g = Game;
  if(botT || !g || !g.S || g.S.winner || g.mode === 'client') return;
  const S = g.S, a = E.actor(S); if(!a) return;
  const p = E.P(S, a);
  if(!(p.bot || p.auto)) return;
  const delay = (S.phase === 'roll' ? 800 : S.auction ? 850 : 600) + Math.random() * 350;
  botT = setTimeout(() => {
    botT = null;
    if(!Game || Game !== g || g.S.winner) return;
    if(MP.gameui.isBusy()){ tickBots(); return; }
    runBotStep(a);
  }, delay);
}
function runBotStep(who){
  const S = Game.S;
  if(E.actor(S) !== who) return tickBots();
  let act = MP.bots.decide(S, who), r = act ? E.act(S, act) : { ok:false };
  if(!r.ok){
    let fb;
    if(S.pending) fb = { t:'shield', use:false, by:who };
    else if(S.debt) fb = { t:'bankrupt', by:who };
    else if(S.auction) fb = { t:'passBid', by:who };
    else if(S.trade) fb = { t:'tradeDecline', by:who };
    else if(S.phase === 'buy') fb = { t:'declineBuy', by:who };
    else if(S.phase === 'roll') fb = { t:'roll', by:who };
    else fb = { t:'endTurn', by:who };
    r = E.act(S, fb);
  }
  commit();
}
function startWatchdog(){
  stopWatchdog();
  watchT = setInterval(() => {
    const g = Game; if(!g || g.mode !== 'host' || !g.S || g.S.winner || MP.gameui.isBusy()) return;
    const S = g.S, a = E.actor(S); if(!a) return;
    const p = E.P(S, a);
    if(p.bot || p.auto || !p.dev || p.dev === PF.deviceId()) return;
    if(Date.now() - S.tAct > 75000){
      p.afk = (p.afk || 0) + 1; if(p.afk >= 2){ p.auto = true; }
      runBotStep(a);
    }
  }, 4000);
}
function stopWatchdog(){ if(watchT){ clearInterval(watchT); watchT = null; } }

function awardXP(S, st){
  const g = Game; let pid = null;
  if(g.mode === 'local') pid = g.meIdx != null && S.players[g.meIdx] ? S.players[g.meIdx].id : null;
  else pid = g.myPid;
  if(!pid) return '';
  const key = S.t0 + ':' + pid;
  const done = lsGet('mp_awarded');
  const won = S.winner === pid, p = E.P(S, pid);
  const xp = 20 + (won ? 35 : 0) + Math.min(25, S.round);
  if(done !== key){
    const before = PF.level();
    PF.addXP(xp); PF.recordGame(won, E.netWorth(S, pid), p.stats.rentGot); lsSet('mp_awarded', key);
    const after = PF.level();
    return `<div class="xp-gain">+${xp} XP${after > before ? ` · Niveau ${after} atteint ! 🎉` : ''}</div>`;
  }
  return `<div class="xp-gain">+${xp} XP</div>`;
}

/* ---------------- partie locale */
function startLocal(){
  const th = MP.THEMES[SU.theme];
  const names = new Set();
  const players = SU.players.map((p, i) => {
    let nm = (p.name || '').trim() || (p.bot ? BOT_NAMES[i % BOT_NAMES.length] : 'Joueur ' + (i + 1));
    while(names.has(nm)) nm += '+'; names.add(nm);
    return { name:nm, bot:p.bot, tokenIdx:p.tokenIdx, emblem:i === 0 ? { e:PF.emblem().e, c:PF.emblem().c } : undefined };
  });
  const S = E.newGame({ theme:SU.theme, rules:rulesFromSetup(), players });
  Game = newCtl('local', S, { meIdx:0, replay(){ startLocal(); } });
  lsSet('mp_local_v2', { S, meIdx:0, ts:Date.now() });
  mountGame(); tickBots();
}
function startLocalFromSave(sv){
  Game = newCtl('local', sv.S, { meIdx:sv.meIdx, replay(){ SU = loadSetup(); SU.theme = sv.S.theme; startLocal(); } });
  mountGame(); tickBots();
}
function exitGame(finished){
  const g = Game;
  stopWatchdog(); if(botT){ clearTimeout(botT); botT = null; }
  if(g){
    if(g.mode === 'local' && finished) lsDel('mp_local_v2');
    if(g.mode === 'host'){ N.pub(N.topicS(g.code), { v:2, code:g.code, phase:'closed', ts:Date.now() }, true); setTimeout(() => N.clear(N.topicS(g.code)), 600); N.unsub(N.topicI(g.code)); lsDel('mp_host_v2'); }
    if(g.mode === 'client'){ N.pub(N.topicI(g.code), { t:'leave', dev:PF.deviceId() }); N.unsub(N.topicS(g.code)); if(finished) lsDel('mp_client_v2'); }
  }
  roomSt = null; showHub();
}

/* ================================================================== en ligne : salon */
let roomSt = null;      // dernier état de salon connu
let seen = {};          // présence (hôte)
let pingT = null, hbT = null, fbN = 0, lastFb = 0;

function roster(){ return roomSt.players; }
function publishRoom(){
  if(!Game || Game.mode !== 'host' && !(roomSt && roomSt.hostDev === PF.deviceId())) return;
  const now = Date.now();
  roomSt.players.forEach(p => { p.online = p.dev === PF.deviceId() || (seen[p.dev] && now - seen[p.dev] < 40000) || p.bot; });
  roomSt.ts = now;
  roomSt.game = Game && Game.mode === 'host' ? Game.S : null;
  N.pub(N.topicS(roomSt.code), roomSt, true);
}

async function createRoom(){
  U.toast('Connexion au serveur…', '', 1200);
  N.connect();
  if(!(await N.waitReady(9000))){ U.toast('Impossible de joindre le serveur en ligne. Réessaie, ou joue en local.', 'bad', 4000); return; }
  const code = N.code();
  const me = PF.get();
  roomSt = { v:2, code, phase:'lobby', theme:SU.theme, rules:rulesFromSetup(), hostDev:PF.deviceId(), ts:Date.now(), fb:null,
    players:[{ name:me.pseudo || 'Hôte', emblem:{ e:PF.emblem().e, c:PF.emblem().c }, tokenIdx:0, bot:false, dev:PF.deviceId(), online:true }], game:null };
  seen = {};
  Game = newCtl('host', null, { code, myPid:'p0', replay:null });
  N.sub(N.topicI(code), onHostMsg);
  lsSet('mp_host_v2', { code, ts:Date.now() });
  publishRoom(); startHeartbeat();
  openLobby();
}
async function resumeHost(code){
  N.connect();
  if(!(await N.waitReady(9000))){ U.toast('Serveur injoignable.', 'bad'); return; }
  let got = false;
  N.sub(N.topicS(code), r => {
    if(got) return; got = true; N.unsub(N.topicS(code));
    if(!r || r.phase === 'closed' || r.hostDev !== PF.deviceId()){ lsDel('mp_host_v2'); U.toast('Ce salon n\'existe plus.', 'warn'); renderResume(); return; }
    roomSt = r; seen = {};
    const myIdx = r.players.findIndex(p => p.dev === PF.deviceId());
    Game = newCtl('host', r.game, { code, myPid:'p' + myIdx, replay:null });
    N.sub(N.topicI(code), onHostMsg); startHeartbeat(); startWatchdog();
    if(r.phase === 'play' && r.game){ Game.S = r.game; mountGame(); tickBots(); } else openLobby();
  });
  setTimeout(() => { if(!got){ got = true; N.unsub(N.topicS(code)); lsDel('mp_host_v2'); U.toast('Salon introuvable.', 'warn'); renderResume(); } }, 6000);
}
function startHeartbeat(){
  if(hbT) clearInterval(hbT);
  hbT = setInterval(() => { if(roomSt && Game && Game.mode === 'host') publishRoom(); }, 15000);
}
function uniqueName(nm){ const names = new Set(roomSt.players.map(p => p.name)); let n = nm || 'Joueur'; while(names.has(n)) n += '+'; return n; }
function freeToken(){ const used = new Set(roomSt.players.map(p => p.tokenIdx)); const n = MP.THEMES[roomSt.theme].tokens.length; for(let k = 0; k < n; k++) if(!used.has(k)) return k; return 0; }

function onHostMsg(m){
  if(!roomSt || !m) return;
  seen[m.dev] = Date.now();
  if(m.t === 'join'){
    const i = roomSt.players.findIndex(p => p.dev === m.dev);
    if(i >= 0){ if(roomSt.phase === 'lobby'){ roomSt.players[i].name = roomSt.players[i].name; } publishRoom(); if(Game.mode === 'host' && Game.S) { const p = Game.S.players[i]; if(p && p.auto){ p.auto = false; } } if(roomSt.phase === 'lobby') renderLobby(); return; }
    if(roomSt.phase !== 'lobby' || roomSt.players.length >= 6) { publishRoom(); return; }
    roomSt.players.push({ name:uniqueName((m.name || 'Joueur').slice(0, 14)), emblem:m.emblem || { e:'⭐', c:'#f1c40f' }, tokenIdx:freeToken(), bot:false, dev:m.dev, online:true });
    SND.play('turn'); U.toast(`👋 ${esc(roomSt.players[roomSt.players.length - 1].name)} rejoint le salon`, 'good');
    publishRoom(); renderLobby();
  } else if(m.t === 'leave'){
    const i = roomSt.players.findIndex(p => p.dev === m.dev); if(i < 0) return;
    if(roomSt.phase === 'lobby'){ roomSt.players.splice(i, 1); publishRoom(); renderLobby(); }
    else if(Game.S){ const p = Game.S.players[i]; if(p){ p.auto = true; U.toast(`${esc(p.name)} a quitté : pilote automatique`, 'warn'); commit(); tickBots(); } }
  } else if(m.t === 'pick'){
    if(roomSt.phase !== 'lobby') return;
    const i = roomSt.players.findIndex(p => p.dev === m.dev); if(i < 0) return;
    const used = new Set(roomSt.players.map((p, k) => k === i ? -1 : p.tokenIdx));
    if(typeof m.tokenIdx === 'number' && !used.has(m.tokenIdx)){ roomSt.players[i].tokenIdx = m.tokenIdx; publishRoom(); renderLobby(); }
  } else if(m.t === 'act'){
    if(roomSt.phase !== 'play' || !Game.S) return;
    const p = Game.S.players.find(q => q.id === m.pid);
    if(!p || p.dev !== m.dev) return;
    const r = E.act(Game.S, Object.assign({}, m.a, { by:p.id }));
    if(!r.ok){ roomSt.fb = { dev:m.dev, msg:r.error, n:++fbN }; publishRoom(); return; }
    p.auto = false; p.afk = 0; commit();
  }
}

/* ---------------- lobby (hôte & invités) */
function openLobby(){
  stopTicker();
  U.applyTheme(roomSt.theme);
  U.showScreen('lobbyScreen'); renderLobby();
}
function renderLobby(){
  const r = roomSt; if(!r) return;
  const host = Game && Game.mode === 'host', th = MP.THEMES[r.theme];
  U.applyTheme(r.theme);
  $('#lobbyCode').textContent = r.code;
  $('#lobCount').textContent = `${r.players.length} / 6`;
  const myDev = PF.deviceId();
  $('#lobList').innerHTML = r.players.map((p, i) => { const tk = th.tokens[p.tokenIdx % th.tokens.length], mine = p.dev === myDev;
    return `<div class="lob-p"><button class="tok" ${mine ? `data-mytok="${i}"` : ''} style="background:${tk.c};${mine ? '' : 'pointer-events:none'}">${tk.e}</button>
      <div class="nm">${esc(p.name)}${i === 0 ? '<span class="tag host">Hôte</span>' : ''}${p.bot ? '<span class="tag bot">Bot</span>' : ''}${!p.online && !p.bot ? '<span class="tag off">Hors ligne</span>' : ''}<small>${p.bot ? 'Joue automatiquement' : mine ? 'Toi · touche ton pion pour le changer' : (p.online ? 'Connecté' : 'Déconnecté')}</small></div>
      <span class="me-emb" style="width:36px;height:36px;font-size:19px;background:${(p.emblem || {}).c || '#555'}">${(p.emblem || {}).e || ''}</span>
      ${host && i > 0 ? `<button class="rm" data-lrm="${i}" style="width:34px;color:var(--dim)">✕</button>` : ''}</div>`; }).join('')
    + (r.players.length < 6 ? `<div class="empty-slot">En attente de joueurs…</div>` : '');
  $('#lobHostBtns').innerHTML = host && r.players.length < 6 ? `<button class="btn ghost block sm" id="lobAddBot" style="margin-top:10px">🤖 Ajouter un bot</button>` : '';
  const eo = r.rules.end === 'classic' ? 'Classique (jusqu\'à la faillite)' : `${r.rules.rounds} tours`;
  $('#lobSummary').innerHTML = `${th.icon} <b>${esc(th.label)}</b> · ${fmt(r.rules.startCash)} · ${eo}<br>${r.rules.powers ? '⚡ Pouvoirs · ' : ''}${r.rules.auctions ? '🔨 Enchères · ' : ''}${r.rules.jackpot ? '💰 Cagnotte' : ''}`;
  $('#lobbyGo').style.display = host ? '' : 'none';
  $('#lobbyGo').classList.toggle('off', r.players.length < 2);
  $('#lobbyGo').textContent = r.players.length < 2 ? 'Il faut au moins 2 joueurs' : 'Lancer la partie';
  $('#lobbyWait').style.display = host ? 'none' : '';
  $('#lobbyConn').textContent = host ? 'Partage ce code (ou le lien) avec tes amis' : '';
}
function lobbyEvents(){
  $('#lobList').addEventListener('click', e => {
    const t = e.target.closest('[data-mytok]'), rm = e.target.closest('[data-lrm]');
    if(t){ const th = MP.THEMES[roomSt.theme], n = th.tokens.length, me = roomSt.players.findIndex(p => p.dev === PF.deviceId()); const used = new Set(roomSt.players.map(p => p.tokenIdx)); let k = roomSt.players[me].tokenIdx; for(let s = 0; s < n; s++){ k = (k + 1) % n; if(!used.has(k)) break; }
      SND.play('tap');
      if(Game.mode === 'host'){ roomSt.players[me].tokenIdx = k; publishRoom(); renderLobby(); } else N.pub(N.topicI(roomSt.code), { t:'pick', dev:PF.deviceId(), tokenIdx:k }); }
    if(rm && Game.mode === 'host'){ roomSt.players.splice(+rm.dataset.lrm, 1); publishRoom(); renderLobby(); }
  });
  $('#lobHostBtns').addEventListener('click', e => {
    if(!e.target.closest('#lobAddBot') || roomSt.players.length >= 6) return;
    const names = new Set(roomSt.players.map(p => p.name)); const nm = BOT_NAMES.find(n => !names.has(n)) || 'Bot';
    roomSt.players.push({ name:nm, emblem:{ e:'🤖', c:'#5a4a8f' }, tokenIdx:freeToken(), bot:true, ai:['bal', 'agg', 'safe'][E.rnd(3)], dev:null, online:true });
    SND.play('tap'); publishRoom(); renderLobby();
  });
  $('#lobbyGo').onclick = () => { if(roomSt.players.length >= 2) startOnlineGame(); };
  $('#lobbyBack').onclick = async () => {
    if(await U.confirmModal({ title:'Quitter le salon ?', text:Game && Game.mode === 'host' ? 'Le salon sera fermé pour tout le monde.' : 'Tu quittes ce salon.', ok:'Quitter', danger:true })) exitGame(true);
  };
  const link = () => location.origin + location.pathname + '?room=' + roomSt.code;
  $('#copyBtn').onclick = async () => { try { await navigator.clipboard.writeText(link()); U.toast('Lien copié ! 📋', 'good'); } catch(e){ U.toast('Code : ' + roomSt.code); } };
  $('#shareBtn').onclick = async () => { const d = { title:'MultiPoly', text:`Rejoins ma partie MultiPoly ! Code : ${roomSt.code}`, url:link() }; try { if(navigator.share) await navigator.share(d); else { await navigator.clipboard.writeText(link()); U.toast('Lien copié ! 📋', 'good'); } } catch(e){} };
}
function startOnlineGame(){
  const r = roomSt;
  const S = E.newGame({ theme:r.theme, rules:r.rules, players:r.players.map(p => ({ name:p.name, emblem:p.emblem, tokenIdx:p.tokenIdx, bot:p.bot, ai:p.ai, dev:p.dev })) });
  r.phase = 'play'; Game.S = S; Game.myPid = 'p' + r.players.findIndex(p => p.dev === PF.deviceId());
  startWatchdog(); publishRoom();
  mountGame(); tickBots();
}

/* ---------------- invité */
async function joinRoom(code){
  code = (code || '').trim().toUpperCase();
  const err = m => { $('#joinErr').textContent = m; };
  if(code.length !== 5){ err('Le code contient 5 caractères.'); $('#joinCode').classList.add('err'); setTimeout(() => $('#joinCode').classList.remove('err'), 400); return; }
  if(!PF.has()){ openProfile(true); return; }
  err(''); U.toast('Connexion au salon…', '', 1500);
  N.connect();
  if(!(await N.waitReady(9000))){ err('Serveur injoignable. Vérifie ta connexion.'); return; }
  let first = true, timer = null;
  const me = PF.get(), myDev = PF.deviceId();
  Game = newCtl('client', null, { code, myPid:null, replay:null });
  fbN = 0; lastFb = 0;
  N.sub(N.topicS(code), r => {
    if(!r || !r.v){ return; }
    if(first){
      first = false; clearTimeout(timer);
      if(r.phase === 'closed'){ N.unsub(N.topicS(code)); Game = null; err('Ce salon est fermé.'); lsDel('mp_client_v2'); return; }
      const mine = r.players.some(p => p.dev === myDev);
      if(r.phase === 'play' && !mine){ N.unsub(N.topicS(code)); Game = null; err('Cette partie a déjà commencé.'); return; }
      if(r.phase === 'lobby' && r.players.length >= 6 && !mine){ N.unsub(N.topicS(code)); Game = null; err('Ce salon est complet.'); return; }
      N.pub(N.topicI(code), { t:'join', dev:myDev, name:me.pseudo, emblem:{ e:PF.emblem().e, c:PF.emblem().c } });
      lsSet('mp_client_v2', { code, ts:Date.now() });
      startPing(code);
      stopTicker();
    }
    onRoom(r);
  });
  timer = setTimeout(() => { if(first){ first = false; N.unsub(N.topicS(code)); Game = null; err('Salon introuvable. Vérifie le code.'); } }, 6500);
}
function startPing(code){
  if(pingT) clearInterval(pingT);
  pingT = setInterval(() => { if(Game && Game.mode === 'client') N.pub(N.topicI(code), { t:'ping', dev:PF.deviceId() }); else { clearInterval(pingT); pingT = null; } }, 12000);
}
function onRoom(r){
  if(!Game || Game.mode !== 'client') return;
  roomSt = r;
  const myDev = PF.deviceId();
  if(r.phase === 'closed'){ U.toast('L\'hôte a fermé le salon.', 'warn', 3500); lsDel('mp_client_v2'); Game.mode = 'x'; N.unsub(N.topicS(r.code || Game.code)); roomSt = null; showHub(); return; }
  const idx = r.players.findIndex(p => p.dev === myDev);
  if(idx < 0 && r.phase === 'lobby'){ N.pub(N.topicI(r.code), { t:'join', dev:myDev, name:PF.get().pseudo, emblem:{ e:PF.emblem().e, c:PF.emblem().c } }); return; }
  if(idx < 0){ U.toast('Tu as été retiré du salon.', 'warn'); exitGame(true); return; }
  if(r.fb && r.fb.dev === myDev && r.fb.n !== lastFb){ lastFb = r.fb.n; U.toast(esc(r.fb.msg), 'bad', 2200); SND.play('bad'); }
  if(r.phase === 'lobby'){
    if(U.current() !== 'lobbyScreen'){ openLobby(); } else renderLobby();
  } else if(r.phase === 'play' && r.game){
    Game.myPid = 'p' + idx; Game.S = r.game;
    if(U.current() !== 'gameScreen') mountGame(); else MP.gameui.onState(r.game);
  }
}

/* ================================================================== initialisation */
function init(){
  SU = loadSetup();
  N.connect(); N.onStatus(setConn);
  setupEvents(); lobbyEvents();
  // splash
  $('#splashScreen').addEventListener('click', () => { SND.unlock(); SND.play('tap'); enterAfterSplash(); }, { once:true });
  // hub
  $('#meChip').onclick = () => openProfile(false);
  $('#newsBtn').onclick = () => U.openSheet({ title:'Quoi de neuf ?', html:NEWS.map(n => `<div class="news-i"><div class="ni">${n.i}</div><div><small>${n.d}</small><b>${esc(n.t)}</b><p>${esc(n.p)}</p></div></div>`).join('') });
  $('#rulesBtn').onclick = () => U.openRules();
  $('#soundBtn').onclick = () => { SND.set(!SND.isOn()); renderMe(); SND.play('tap'); };
  $('#showLocalBtn').onclick = () => { SND.play('tap'); openSetup('local'); };
  $('#showOnlineBtn').onclick = () => { SND.play('tap'); hub.online = true; $('#hubTiles').style.display = 'none'; $('#hubOnline').style.display = ''; $('#joinErr').textContent = ''; };
  $('#onlineBack').onclick = () => { hub.online = false; $('#hubTiles').style.display = ''; $('#hubOnline').style.display = 'none'; };
  $('#createRoomBtn').onclick = () => { SND.play('tap'); openSetup('online'); };
  $('#joinBtn').onclick = () => joinRoom($('#joinCode').value);
  $('#joinCode').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); $('#joinErr').textContent = ''; });
  $('#joinCode').addEventListener('keydown', e => { if(e.key === 'Enter') joinRoom(e.target.value); });
  // profil
  $('#pseudoInput').addEventListener('input', e => { PF.setPseudo(e.target.value); e.target.classList.remove('err'); renderProfile(); renderMe(); });
  $('#embGrid').addEventListener('click', e => { const b = e.target.closest('[data-e]'); if(b && !b.classList.contains('locked')){ PF.setEmblem(+b.dataset.e); SND.play('tap'); renderProfile(); renderMe(); } });
  $('#profileOk').onclick = () => {
    if(!PF.has()){ const i = $('#pseudoInput'); i.classList.add('err'); i.focus(); setTimeout(() => i.classList.remove('err'), 450); return; }
    SND.play('buy'); renderMe(); const q = pendingRoom; pendingRoom = null; showHub(); if(q) { hub.online = true; $('#hubTiles').style.display = 'none'; $('#hubOnline').style.display = ''; $('#joinCode').value = q; joinRoom(q); }
  };
  $('#profileBack').onclick = () => showHub();
  U.applyTheme(lastHubTheme);
  U.showScreen('splashScreen');
  document.addEventListener('visibilitychange', () => { if(!document.hidden && Game && Game.mode !== 'local') { /* mqtt se reconnecte seul */ } });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') U.closeAll(); });
}
let pendingRoom = null;
function enterAfterSplash(){
  const q = new URLSearchParams(location.search).get('room');
  if(q){ pendingRoom = q.toUpperCase().slice(0, 5); history.replaceState(null, '', location.pathname); }
  if(!PF.has()){ openProfile(true); return; }
  const pr = pendingRoom; pendingRoom = null;
  showHub();
  if(pr){ hub.online = true; $('#hubTiles').style.display = 'none'; $('#hubOnline').style.display = ''; $('#joinCode').value = pr; joinRoom(pr); }
}

MP.app = { init, renderMe, showHub };
init();
})();
