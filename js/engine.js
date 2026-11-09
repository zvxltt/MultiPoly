/* MultiPoly v2 — moteur de règles (pur, sans DOM).
   Tout l'état est du JSON : il se sérialise, se publie en ligne et se rejoue.
   Utilisation :  const s = MP.engine.newGame(cfg);  MP.engine.act(s, {t:'roll', by:'p0'});  */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});

/* ------------------------------------------------------------------ constantes */
const GO_SALARY = 200;
const JAIL_FINE = 50;
const JAIL_POS = 10;
const MAX_POWERS = 3;
const MAX_LOG = 70;
const BUILD_COST = { g0:50, g1:50, g2:100, g3:100, g4:150, g5:150, g6:200, g7:200 };
// Loyers : [terrain nu, 1 maison, 2, 3, 4, hôtel] — selon le prix de la case.
const RENT_TABLE = {
  60:[2,10,30,90,160,250], 100:[6,30,90,270,400,550], 120:[8,40,100,300,450,600],
  140:[10,50,150,450,625,750], 160:[12,60,180,500,700,900], 180:[14,70,200,550,750,950],
  200:[16,80,220,600,800,1000], 220:[18,90,250,700,875,1050], 240:[20,100,300,750,925,1100],
  260:[22,110,330,800,975,1150], 280:[24,120,360,850,1025,1200], 300:[26,130,390,900,1100,1275],
  320:[28,150,450,1000,1200,1400], 350:[35,175,500,1100,1300,1500], 400:[50,200,600,1400,1700,2000],
};
const RENT_TABLE_60B = [4,20,60,180,320,450];
const STATION_RENT = [0,25,50,100,200];

const DEFAULT_RULES = { startCash:1500, end:'rounds', rounds:30, jackpot:true, auctions:true, powers:true };

const POWERS = {
  shield:   { icon:'🛡️', name:'Bouclier',     desc:"Annule le prochain loyer que vous devez payer.", weight:26, reactive:true },
  teleport: { icon:'🚀', name:'Téléportation', desc:"Remplace votre lancer : allez sur la case de votre choix.", weight:14 },
  racket:   { icon:'💸', name:'Racket',        desc:"Chaque adversaire vous verse 40 € (ou ce qu'il lui reste).", weight:18 },
  builder:  { icon:'🏗️', name:'Chantier',      desc:"Une maison offerte sur un de vos groupes complets.", weight:20 },
  strike:   { icon:'✊', name:'Grève',         desc:"Un adversaire ne touche plus aucun loyer pendant 3 tours.", weight:22 },
};

/* ------------------------------------------------------------------ utilitaires */
const rnd = n => Math.floor(Math.random() * n);
const clone = o => JSON.parse(JSON.stringify(o));
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const theme = s => MP.THEMES[s.theme];
const board = s => MP.THEMES[s.theme].board;
const cell = (s, i) => MP.THEMES[s.theme].board[i];
const P = (s, id) => s.players.find(p => p.id === id);
const active = s => s.players.filter(p => !p.bankrupt);
const turnPlayer = s => s.players[s.turn];
const isOwnable = c => c.type === 'property' || c.type === 'station' || c.type === 'utility';
const fmt = n => (n < 0 ? '-' : '') + Math.abs(Math.round(n)).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' €';

function ev(s, t, data){ s.events.push(Object.assign({ t }, data || {})); }
function say(s, m, pid, kind){ s.log.push({ m, p: pid || null, k: kind || 'info', r: s.round }); if(s.log.length > MAX_LOG) s.log.splice(0, s.log.length - MAX_LOG); }

/* ------------------------------------------------------------------ cartes (paquets) */
function extraCards(s, deck){
  const w = theme(s).words;
  if(deck === 'minor') return [
    { text:"Reculez de 3 cases.", back:3 },
    { text:"C'est votre anniversaire : chaque joueur vous offre 25 €.", eachPay:25 },
    { text:`Avancez jusqu'au prochain ${w.station}. Loyer double s'il est occupé.`, nearest:'station' },
    { text:`Avancez jusqu'au prochain ${w.utility}. S'il est occupé : 10 × vos dés.`, nearest:'utility' },
  ];
  return [
    { text:"Carte « Sortie de prison » : gardez-la jusqu'à ce que vous en ayez besoin.", jailFree:true },
    { text:"Travaux sur vos biens : 25 € par maison, 100 € par hôtel.", repairs:[25,100] },
    { text:"Soirée réussie : chaque joueur vous remet 20 €.", eachPay:20 },
  ];
}
function deckCards(s, deck){
  const th = theme(s);
  return (deck === 'minor' ? th.minorCards : th.majorCards).concat(extraCards(s, deck));
}
function reshuffleDeck(s, deck){
  const n = deckCards(s, deck).length;
  const held = s.decks[deck].held;
  const idx = []; for(let i=0;i<n;i++) if(!held.includes(i)) idx.push(i);
  s.decks[deck].order = shuffle(idx);
}

/* ------------------------------------------------------------------ création de partie */
function newGame(cfg){
  const th = MP.THEMES[cfg.theme];
  if(!th) throw new Error('unknown theme ' + cfg.theme);
  const rules = Object.assign({}, DEFAULT_RULES, cfg.rules || {});
  const used = new Set();
  const players = cfg.players.map((p, i) => {
    let ti = typeof p.tokenIdx === 'number' ? p.tokenIdx : i;
    if(used.has(ti)) { ti = th.tokens.findIndex((_, k) => !used.has(k)); if(ti < 0) ti = i % th.tokens.length; }
    used.add(ti);
    return {
      id: 'p' + i, name: p.name || ('Joueur ' + (i + 1)),
      emblem: p.emblem || { e:'⭐', c:'#f1c40f' }, token: th.tokens[ti], tokenIdx: ti,
      bot: !!p.bot, ai: p.ai || ['bal','agg','safe'][rnd(3)], dev: p.dev || null, afk: 0,
      cash: rules.startCash, pos: 0, inJail: false, jailTries: 0, jailCards: 0, bankrupt: false,
      powers: [], strikeUntil: 0,
      stats: { rentPaid:0, rentGot:0, bought:0, builds:0, jailVisits:0, turns:0, cards:0, powers:0 },
    };
  });
  const props = {};
  th.board.forEach((c, i) => { if(isOwnable(c)) props[i] = { o:null, h:0, m:false }; });
  const s = {
    v: 2, theme: cfg.theme, rules, players, props,
    turn: 0, round: 1, phase: 'roll', doubles: 0, extraRoll: false, dice: [0, 0],
    decks: { minor:{ order:[], held:[] }, major:{ order:[], held:[] } },
    jackpot: 0, auction: null, trade: null, debt: null, pending: null,
    winner: null, endReason: null, log: [], events: [], seq: 0, t0: Date.now(), tAct: Date.now(),
  };
  reshuffleDeck(s, 'minor'); reshuffleDeck(s, 'major');
  if(rules.powers) players.forEach(p => grantPower(s, p, true));
  say(s, `La partie commence ! ${players[0].name} ouvre le bal.`, null, 'sys');
  players[0].stats.turns = 1;
  return s;
}

/* ------------------------------------------------------------------ requêtes (lecture seule) */
function groupCells(s, g){ const b = board(s); const r = []; b.forEach((c, i) => { if(c.group === g) r.push(i); }); return r; }
function ownedBy(s, pid){ const r = []; for(const k in s.props) if(s.props[k].o === pid) r.push(+k); return r.sort((a,b)=>a-b); }
function ownsGroup(s, pid, g){ const cs = groupCells(s, g); return cs.length > 0 && cs.every(i => s.props[i].o === pid); }
function monopolies(s, pid){ const gs = []; for(const g of ['g0','g1','g2','g3','g4','g5','g6','g7']) if(ownsGroup(s, pid, g)) gs.push(g); return gs; }
function countType(s, pid, type){ return ownedBy(s, pid).filter(i => cell(s, i).type === type).length; }

function rentTable(s, idx){
  const c = cell(s, idx);
  if(c.type !== 'property') return null;
  if(c.price === 60 && idx === groupCells(s, c.group)[1]) return RENT_TABLE_60B;
  return RENT_TABLE[c.price];
}
function rentFor(s, idx, diceSum){
  const c = cell(s, idx), pr = s.props[idx];
  if(!pr || !pr.o || pr.m) return 0;
  if(c.type === 'station') return STATION_RENT[Math.max(1, countType(s, pr.o, 'station'))];
  if(c.type === 'utility'){
    const n = countType(s, pr.o, 'utility');
    return (n >= 2 ? 10 : 4) * (diceSum || 7);
  }
  const t = rentTable(s, idx);
  if(pr.h > 0) return t[pr.h];
  return ownsGroup(s, pr.o, c.group) ? t[0] * 2 : t[0];
}
function buildCost(s, idx){ return BUILD_COST[cell(s, idx).group]; }
function houseTotals(s, pid){
  let h = 0, H = 0;
  ownedBy(s, pid).forEach(i => { const n = s.props[i].h; if(n === 5) H++; else h += n; });
  return { h, H };
}
function netWorth(s, pid){
  const p = P(s, pid); if(!p || p.bankrupt) return 0;
  let w = p.cash;
  ownedBy(s, pid).forEach(i => {
    const c = cell(s, i), pr = s.props[i];
    w += pr.m ? c.price / 2 : c.price;
    if(c.group) w += pr.h * BUILD_COST[c.group];
  });
  return Math.round(w);
}
function liquidValue(s, pid){ // ce que le joueur peut encaisser en vendant/hypothéquant tout
  const p = P(s, pid); let w = p.cash;
  ownedBy(s, pid).forEach(i => {
    const c = cell(s, i), pr = s.props[i];
    if(c.group) w += pr.h * BUILD_COST[c.group] / 2;
    if(!pr.m) w += c.price / 2;
  });
  return Math.round(w);
}
function standings(s){
  return s.players.map(p => ({ id:p.id, worth:netWorth(s, p.id), bankrupt:p.bankrupt })).sort((a,b) => (a.bankrupt - b.bankrupt) || (b.worth - a.worth));
}
function actor(s){
  if(s.winner) return null;
  if(s.pending) return s.pending.pid;
  if(s.debt) return s.debt.pid;
  if(s.auction) return s.auction.order[s.auction.turn];
  if(s.trade) return s.trade.to;
  return turnPlayer(s).id;
}

function canBuildInfo(s, pid, idx, free){
  const p = P(s, pid), c = cell(s, idx), pr = s.props[idx];
  if(!pr || pr.o !== pid || c.type !== 'property') return { ok:false, why:"Ce n'est pas un terrain." };
  if(!ownsGroup(s, pid, c.group)) return { ok:false, why:'Il faut posséder tout le groupe.' };
  const g = groupCells(s, c.group);
  if(g.some(i => s.props[i].m)) return { ok:false, why:'Un terrain du groupe est hypothéqué.' };
  if(pr.h >= 5) return { ok:false, why:'Hôtel déjà construit.' };
  const min = Math.min(...g.map(i => s.props[i].h));
  if(pr.h > min) return { ok:false, why:'Construisez de façon régulière dans le groupe.' };
  const cost = BUILD_COST[c.group];
  if(!free && p.cash < cost) return { ok:false, why:`Il vous faut ${fmt(cost)}.`, cost };
  return { ok:true, cost };
}
function canSellInfo(s, pid, idx){
  const c = cell(s, idx), pr = s.props[idx];
  if(!pr || pr.o !== pid || c.type !== 'property' || pr.h <= 0) return { ok:false };
  const g = groupCells(s, c.group);
  const max = Math.max(...g.map(i => s.props[i].h));
  if(pr.h < max) return { ok:false, why:'Vendez d\'abord sur les terrains les plus construits.' };
  return { ok:true, gain: BUILD_COST[c.group] / 2 };
}
function canMortgageInfo(s, pid, idx){
  const c = cell(s, idx), pr = s.props[idx];
  if(!pr || pr.o !== pid) return { ok:false };
  if(pr.m) {
    const cost = Math.ceil(c.price / 2 * 1.1);
    return { ok: P(s, pid).cash >= cost, cost, un:true, why: P(s, pid).cash >= cost ? '' : `Il vous faut ${fmt(cost)}.` };
  }
  if(c.group && groupCells(s, c.group).some(i => s.props[i].h > 0)) return { ok:false, why:'Vendez d\'abord les maisons du groupe.' };
  return { ok:true, gain: c.price / 2 };
}

/* ------------------------------------------------------------------ mouvements d'argent */
function toPot(s, amount){ if(s.rules.jackpot && amount > 0) s.jackpot += amount; }

// Paye `amount` à `to` (id joueur) ou à la banque (null). Si le joueur ne peut pas : dette.
function pay(s, payer, toId, amount, reason, toPotFlag){
  if(amount <= 0) return true;
  if(payer.cash >= amount){
    payer.cash -= amount;
    if(toId){ P(s, toId).cash += amount; }
    else if(toPotFlag) toPot(s, amount);
    ev(s, 'cash', { p: payer.id, d: -amount, why: reason });
    if(toId) ev(s, 'cash', { p: toId, d: amount, why: reason });
    return true;
  }
  s.debt = { pid: payer.id, amount, to: toId || null, pot: !!toPotFlag, reason };
  say(s, `${payer.name} doit ${fmt(amount)} et n'a pas assez : il doit vendre ou hypothéquer.`, payer.id, 'warn');
  ev(s, 'debt', { p: payer.id, amount });
  return false;
}
function trySettleDebt(s){
  const d = s.debt; if(!d) return;
  const payer = P(s, d.pid);
  if(payer.cash >= d.amount){
    s.debt = null;
    pay(s, payer, d.to, d.amount, d.reason, d.pot);
    say(s, `${payer.name} règle sa dette de ${fmt(d.amount)}.`, payer.id, 'money');
  }
}

/* ------------------------------------------------------------------ pouvoirs */
function randomPower(){
  const tot = Object.values(POWERS).reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * tot;
  for(const k in POWERS){ r -= POWERS[k].weight; if(r <= 0) return k; }
  return 'shield';
}
function grantPower(s, p, silent){
  if(!s.rules.powers || p.powers.length >= MAX_POWERS) return null;
  const t = randomPower(); p.powers.push(t);
  if(!silent){ say(s, `${p.name} gagne une carte Pouvoir : ${POWERS[t].name} ${POWERS[t].icon}.`, p.id, 'power'); ev(s, 'gainPower', { p:p.id, type:t }); }
  return t;
}

/* ------------------------------------------------------------------ déplacements */
function pathBetween(from, to, dir){
  const path = [from]; let i = from; let guard = 0;
  while(i !== to && guard++ < 45){ i = (i + dir + 40) % 40; path.push(i); }
  return path;
}
function movePlayer(s, p, target, opts){
  opts = opts || {};
  const dir = opts.back ? -1 : 1;
  const path = opts.noAnim ? [p.pos, target] : pathBetween(p.pos, target, dir);
  let passedGo = false;
  if(dir === 1 && !opts.noSalary){
    // on a passé (ou atterri sur) la case Départ si le chemin repasse par 0 après le départ
    passedGo = !opts.teleport && path.slice(1).includes(0);
  }
  ev(s, 'move', { p: p.id, from: p.pos, to: target, path: opts.teleport ? [p.pos, target] : path, tele: !!opts.teleport });
  p.pos = target;
  if(passedGo){
    p.cash += GO_SALARY;
    ev(s, 'cash', { p: p.id, d: GO_SALARY, why: 'go' });
    say(s, `${p.name} passe par ${cell(s, 0).name} : +${fmt(GO_SALARY)}.`, p.id, 'money');
    grantPower(s, p);
  }
}

function sendToJail(s, p, why){
  p.inJail = true; p.jailTries = 0; p.stats.jailVisits++;
  if(p.pos !== JAIL_POS) ev(s, 'move', { p: p.id, from: p.pos, to: JAIL_POS, path: [p.pos, JAIL_POS], tele: true });
  p.pos = JAIL_POS;
  s.extraRoll = false; s.doubles = 0;
  ev(s, 'jail', { p: p.id });
  say(s, why || `${p.name} file en prison.`, p.id, 'warn');
}

function finishLanding(s){
  const p = turnPlayer(s);
  s._fin = true;
  if(s.winner) return;
  if(p.inJail || p.bankrupt) s.extraRoll = false;
  s.phase = s.extraRoll ? 'roll' : 'end';
  if(s.extraRoll){ s.extraRoll = false; s.doubleAgain = true; }
}

function startAuction(s, idx, starterId){
  const act = active(s).map(p => p.id);
  const k = Math.max(0, act.indexOf(starterId));
  const order = act.slice(k).concat(act.slice(0, k));
  s.auction = { idx, bid: 0, bidder: null, order, turn: 0, passed: [] };
  s.phase = 'auction';
  ev(s, 'auction', { idx });
  say(s, `Enchères pour ${cell(s, idx).name} !`, null, 'auction');
}

function landOn(s, p, o){
  o = o || {};
  if(!o.depth) s._fin = false;
  const c = cell(s, p.pos), idx = p.pos;
  p.stats.landings = (p.stats.landings || 0) + 1;
  switch(c.type){
    case 'property': case 'station': case 'utility': {
      const pr = s.props[idx];
      if(!pr.o){
        s.phase = 'buy';
        say(s, `${p.name} arrive sur ${c.name} (${fmt(c.price)}).`, p.id);
        return;
      }
      if(pr.o !== p.id){
        const owner = P(s, pr.o);
        if(pr.m){ say(s, `${c.name} est hypothéqué : pas de loyer.`, p.id); break; }
        if(owner.strikeUntil >= s.round && s.rules.powers){ say(s, `${owner.name} est en grève : pas de loyer !`, p.id, 'power'); break; }
        const sum = s.dice[0] + s.dice[1];
        let amount;
        if(c.type === 'utility') amount = (o.utilityTen ? 10 : (countType(s, pr.o, 'utility') >= 2 ? 10 : 4)) * (sum || 7);
        else if(c.type === 'station') amount = rentFor(s, idx, sum) * (o.rentMult === 2 ? 2 : 1);
        else amount = rentFor(s, idx, sum);
        if(amount <= 0) break;
        if(p.powers.includes('shield') && s.rules.powers){
          s.pending = { type:'shield', pid:p.id, owner:owner.id, amount, idx };
          s.phase = 'shield';
          return;
        }
        payRent(s, p, owner, amount, idx);
      }
      break;
    }
    case 'tax': {
      const ok = pay(s, p, null, c.amount, 'tax', true);
      say(s, `${p.name} paie ${c.name} : ${fmt(c.amount)}.`, p.id, 'money');
      break;
    }
    case 'parking': {
      if(s.rules.jackpot && s.jackpot > 0){
        const j = s.jackpot; s.jackpot = 0; p.cash += j;
        ev(s, 'cash', { p:p.id, d:j, why:'jackpot' });
        ev(s, 'jackpot', { p:p.id, amount:j });
        say(s, `${p.name} remporte la cagnotte : ${fmt(j)} !`, p.id, 'money');
      }
      break;
    }
    case 'gotojail': sendToJail(s, p, `${p.name} est envoyé en prison !`); break;
    case 'minor': case 'major': drawCard(s, p, c.type, o.depth || 0); if(s.pending || (s.phase === 'buy')) return; break;
    default: break;
  }
  if(!s._fin && !s.pending && s.phase !== 'buy' && s.phase !== 'auction') finishLanding(s);
}

function payRent(s, payer, owner, amount, idx){
  const ok = pay(s, payer, owner.id, amount, 'rent');
  payer.stats.rentPaid += amount; owner.stats.rentGot += amount;
  ev(s, 'rent', { from: payer.id, to: owner.id, amount, idx });
  say(s, `${payer.name} paie ${fmt(amount)} de loyer à ${owner.name} (${cell(s, idx).name}).`, payer.id, 'money');
}

function drawCard(s, p, deckName, depth){
  const deck = s.decks[deckName];
  const cards = deckCards(s, deckName);
  if(!deck.order.length) reshuffleDeck(s, deckName);
  const ci = deck.order.shift();
  const card = cards[ci];
  p.stats.cards++;
  ev(s, 'card', { p: p.id, deck: deckName, text: card.text });
  say(s, `${p.name} pioche : « ${card.text} »`, p.id, 'card');
  if(card.money){
    if(card.money > 0){ p.cash += card.money; ev(s, 'cash', { p:p.id, d:card.money, why:'card' }); }
    else pay(s, p, null, -card.money, 'card', true);
  }
  if(card.goToJail) sendToJail(s, p, `${p.name} file en prison.`);
  else if(typeof card.moveTo === 'number'){
    const wasPos = p.pos;
    movePlayer(s, p, card.moveTo, {});
    if(depth < 2) landOn(s, p, { depth: depth + 1 });
  }
  else if(card.jailFree){ p.jailCards++; deck.held.push(ci); ev(s, 'jailCard', { p:p.id }); }
  else if(card.back){
    const t = (p.pos - card.back + 40) % 40;
    movePlayer(s, p, t, { back:true });
    if(depth < 2) landOn(s, p, { depth: depth + 1 });
  }
  else if(card.eachPay){
    let tot = 0;
    active(s).forEach(o => { if(o.id !== p.id){ const x = Math.min(card.eachPay, o.cash); o.cash -= x; tot += x; ev(s, 'cash', { p:o.id, d:-x, why:'card' }); } });
    p.cash += tot; ev(s, 'cash', { p:p.id, d:tot, why:'card' });
  }
  else if(card.repairs){
    const t = houseTotals(s, p.id);
    const cost = t.h * card.repairs[0] + t.H * card.repairs[1];
    if(cost > 0) pay(s, p, null, cost, 'card', true); else say(s, `Aucun bâtiment : ${p.name} s'en sort bien.`, p.id);
  }
  else if(card.nearest){
    const b = board(s);
    let t = p.pos; for(let k = 1; k <= 40; k++){ const i = (p.pos + k) % 40; if(b[i].type === card.nearest){ t = i; break; } }
    movePlayer(s, p, t, {});
    if(depth < 2) landOn(s, p, { depth: depth + 1, rentMult: card.nearest === 'station' ? 2 : 1, utilityTen: card.nearest === 'utility' });
  }
  // la carte retourne sous le paquet sauf « sortie de prison »
  if(!card.jailFree) deck.order.push(ci);
}

/* ------------------------------------------------------------------ tours */
function nextAlive(s, from){
  let i = from;
  for(let k = 0; k < s.players.length; k++){ i = (i + 1) % s.players.length; if(!s.players[i].bankrupt) return i; }
  return from;
}
function checkWinner(s){
  const alive = active(s);
  if(alive.length <= 1 && !s.winner){
    s.winner = alive[0] ? alive[0].id : null; s.endReason = 'last'; s.phase = 'over';
    ev(s, 'win', { p: s.winner });
    say(s, alive[0] ? `${alive[0].name} remporte la partie !` : 'Partie terminée.', s.winner, 'sys');
    return true;
  }
  return false;
}
function endByRounds(s){
  const st = standings(s);
  s.winner = st[0].id; s.endReason = 'rounds'; s.phase = 'over';
  ev(s, 'win', { p: s.winner });
  say(s, `Fin de la partie ! ${P(s, s.winner).name} est le plus riche.`, s.winner, 'sys');
}
function advanceTurn(s){
  if(checkWinner(s)) return;
  const prev = s.turn;
  const nx = nextAlive(s, prev);
  if(nx <= prev){
    s.round++;
    if(s.rules.end === 'rounds' && s.round > s.rules.rounds){ endByRounds(s); return; }
  }
  s.turn = nx; s.doubles = 0; s.extraRoll = false; s.doubleAgain = false; s.dice = [0, 0];
  s.phase = 'roll';
  const p = turnPlayer(s); p.stats.turns++;
  s.tAct = Date.now();
  ev(s, 'turn', { p: p.id });
  if(p.inJail) say(s, `${p.name} est en prison.`, p.id);
}

/* ------------------------------------------------------------------ faillite */
function declareBankrupt(s, p){
  const d = s.debt;
  const creditor = d && d.to ? P(s, d.to) : null;
  // les bâtiments sont revendus à la banque (moitié du prix)
  ownedBy(s, p.id).forEach(i => { const c = cell(s, i); const pr = s.props[i]; if(pr.h > 0){ p.cash += pr.h * BUILD_COST[c.group] / 2; pr.h = 0; } });
  if(creditor){
    creditor.cash += p.cash; creditor.jailCards += p.jailCards;
    ev(s, 'cash', { p: creditor.id, d: p.cash, why:'bankrupt' });
    ownedBy(s, p.id).forEach(i => { s.props[i].o = creditor.id; });
    say(s, `${p.name} fait faillite ! Ses biens vont à ${creditor.name}.`, p.id, 'warn');
  } else {
    ownedBy(s, p.id).forEach(i => { s.props[i] = { o:null, h:0, m:false }; });
    for(let k = 0; k < p.jailCards; k++){ const h = s.decks.major.held; if(h.length) s.decks.major.order.push(h.pop()); }
    say(s, `${p.name} fait faillite ! Ses biens retournent à la banque.`, p.id, 'warn');
  }
  p.cash = 0; p.bankrupt = true; p.jailCards = 0; p.powers = []; p.inJail = false;
  ev(s, 'bankrupt', { p: p.id });
  s.debt = null; s.pending = null;
  if(s.auction){ // retire le failli des enchères
    s.auction.order = s.auction.order.filter(x => x !== p.id);
  }
  if(checkWinner(s)) return;
  if(turnPlayer(s).id === p.id){ advanceTurn(s); }
}

/* ------------------------------------------------------------------ échanges */
function tradeSide(side){ return { props:(side && side.props || []).map(Number), cash: Math.max(0, Math.round(side && side.cash || 0)), jail: Math.max(0, Math.round(side && side.jail || 0)) }; }
function validateTrade(s, t){
  const A = P(s, t.from), B = P(s, t.to);
  if(!A || !B || A.bankrupt || B.bankrupt || A.id === B.id) return 'Joueurs invalides.';
  for(const [pl, side] of [[A, t.give], [B, t.get]]){
    for(const i of side.props){
      const pr = s.props[i];
      if(!pr || pr.o !== pl.id) return `${cell(s, i).name} n'appartient pas à ${pl.name}.`;
      const g = cell(s, i).group;
      if(g && groupCells(s, g).some(k => s.props[k].h > 0)) return `Vendez d'abord les maisons du groupe de ${cell(s, i).name}.`;
    }
    if(side.cash > pl.cash) return `${pl.name} n'a pas ${fmt(side.cash)}.`;
    if(side.jail > pl.jailCards) return `${pl.name} n'a pas cette carte « prison ».`;
  }
  const empty = !t.give.props.length && !t.get.props.length && !t.give.cash && !t.get.cash && !t.give.jail && !t.get.jail;
  if(empty) return 'Proposez quelque chose.';
  // intérêts de 10 % sur les terrains hypothéqués reçus
  const feeB = t.give.props.reduce((a, i) => a + (s.props[i].m ? Math.ceil(cell(s, i).price / 2 * 0.1) : 0), 0);
  const feeA = t.get.props.reduce((a, i) => a + (s.props[i].m ? Math.ceil(cell(s, i).price / 2 * 0.1) : 0), 0);
  if(B.cash - t.get.cash + t.give.cash < feeB) return `${B.name} ne peut pas payer les intérêts d'hypothèque.`;
  if(A.cash - t.give.cash + t.get.cash < feeA) return `${A.name} ne peut pas payer les intérêts d'hypothèque.`;
  return null;
}
function executeTrade(s, t){
  const A = P(s, t.from), B = P(s, t.to);
  A.cash += t.get.cash - t.give.cash; B.cash += t.give.cash - t.get.cash;
  A.jailCards += t.get.jail - t.give.jail; B.jailCards += t.give.jail - t.get.jail;
  t.give.props.forEach(i => { s.props[i].o = B.id; if(s.props[i].m) B.cash -= Math.ceil(cell(s, i).price / 2 * 0.1); });
  t.get.props.forEach(i => { s.props[i].o = A.id; if(s.props[i].m) A.cash -= Math.ceil(cell(s, i).price / 2 * 0.1); });
  ev(s, 'trade', { a:A.id, b:B.id });
  say(s, `Échange conclu entre ${A.name} et ${B.name} !`, A.id, 'trade');
}

/* ------------------------------------------------------------------ action principale */
function fail(error){ return { ok:false, error }; }
function ok(){ return { ok:true }; }
const MANAGE = new Set(['build','sell','mortgage','unmortgage']);

function act(s, a){
  if(s.winner && a.t !== 'noop') return fail('Partie terminée.');
  const by = P(s, a.by);
  if(!by || by.bankrupt) return fail('Joueur inconnu.');
  const who = actor(s);
  const tp = turnPlayer(s);
  s.events = [];

  if(s.debt && !['payDebt','bankrupt','build','sell','mortgage','unmortgage'].includes(a.t)) return fail('Réglez votre dette.');
  if(s.pending && a.t !== 'shield') return fail('Une décision est attendue.');
  // Actions autorisées hors de son tour (réponse à une demande)
  const responding = ['bid','passBid','tradeAccept','tradeDecline','shield','payDebt','bankrupt'].includes(a.t);
  if(a.t === 'tradeCancel'){
    if(!s.trade || s.trade.from !== by.id) return fail('Aucun échange à annuler.');
    s.trade = null; say(s, `${by.name} annule son offre d'échange.`, by.id, 'trade'); return done(s);
  }
  if(responding){ if(who !== by.id) return fail("Ce n'est pas à vous de répondre."); }
  else if(MANAGE.has(a.t) && s.debt){ if(s.debt.pid !== by.id) return fail('Une dette est en cours.'); }
  else { if(tp.id !== by.id) return fail("Ce n'est pas votre tour."); if(who !== by.id) return fail('Une décision est attendue.'); }

  switch(a.t){

  case 'roll': {
    if(s.phase !== 'roll') return fail('Impossible de lancer maintenant.');
    const d1 = 1 + rnd(6), d2 = 1 + rnd(6);
    return doRoll(s, tp, d1, d2);
  }
  case 'payJail': {
    if(!tp.inJail || s.phase !== 'roll') return fail('Pas en prison.');
    if(tp.cash < JAIL_FINE) return fail(`Il faut ${fmt(JAIL_FINE)}.`);
    tp.cash -= JAIL_FINE; toPot(s, JAIL_FINE); tp.inJail = false; tp.jailTries = 0;
    ev(s, 'cash', { p:tp.id, d:-JAIL_FINE, why:'jail' }); ev(s, 'free', { p:tp.id });
    say(s, `${tp.name} paie ${fmt(JAIL_FINE)} et sort de prison.`, tp.id, 'money');
    return done(s);
  }
  case 'useJailCard': {
    if(!tp.inJail || s.phase !== 'roll' || tp.jailCards < 1) return fail('Pas de carte.');
    tp.jailCards--; tp.inJail = false; tp.jailTries = 0;
    // la carte revient dans le paquet des caisses
    const h = s.decks.major.held; if(h.length) { const ci = h.pop(); s.decks.major.order.push(ci); }
    ev(s, 'free', { p:tp.id }); say(s, `${tp.name} utilise sa carte et sort de prison.`, tp.id);
    return done(s);
  }
  case 'buy': {
    if(s.phase !== 'buy') return fail("Rien à acheter.");
    const c = cell(s, tp.pos);
    if(tp.cash < c.price) return fail(`Il vous faut ${fmt(c.price)}.`);
    tp.cash -= c.price; s.props[tp.pos].o = tp.id; tp.stats.bought++;
    ev(s, 'cash', { p:tp.id, d:-c.price, why:'buy' }); ev(s, 'buy', { p:tp.id, idx:tp.pos });
    say(s, `${tp.name} achète ${c.name} pour ${fmt(c.price)}.`, tp.id, 'buy');
    finishLanding(s); return done(s);
  }
  case 'declineBuy': {
    if(s.phase !== 'buy') return fail("Rien à décliner.");
    if(s.rules.auctions) startAuction(s, tp.pos, tp.id);
    else { say(s, `${tp.name} ne prend pas ${cell(s, tp.pos).name}.`, tp.id); finishLanding(s); }
    return done(s);
  }
  case 'bid': {
    const au = s.auction; if(!au) return fail("Pas d'enchère.");
    const amt = Math.round(a.amount);
    if(!(amt >= au.bid + 10)) return fail('Surenchérissez d\'au moins 10 €.');
    if(amt > by.cash) return fail('Pas assez d\'argent.');
    au.bid = amt; au.bidder = by.id;
    say(s, `${by.name} enchérit à ${fmt(amt)}.`, by.id, 'auction');
    ev(s, 'bid', { p:by.id, amount:amt });
    auctionNext(s); return done(s);
  }
  case 'passBid': {
    const au = s.auction; if(!au) return fail("Pas d'enchère.");
    au.passed.push(by.id);
    say(s, `${by.name} se retire.`, by.id, 'auction');
    auctionNext(s); return done(s);
  }
  case 'endTurn': {
    if(s.phase !== 'end') return fail('Terminez vos actions.');
    if(s.debt) return fail('Réglez votre dette.');
    advanceTurn(s); return done(s);
  }
  case 'build': case 'sell': case 'mortgage': case 'unmortgage': {
    if(s.phase === 'auction' || s.trade || s.pending) return fail('Pas maintenant.');
    const idx = a.idx;
    if(a.t === 'build'){
      const r = canBuildInfo(s, by.id, idx); if(!r.ok) return fail(r.why);
      by.cash -= r.cost; s.props[idx].h++; by.stats.builds++;
      ev(s, 'cash', { p:by.id, d:-r.cost, why:'build' }); ev(s, 'build', { p:by.id, idx });
      say(s, `${by.name} construit sur ${cell(s, idx).name}${s.props[idx].h === 5 ? ' : un hôtel !' : '.'}`, by.id, 'build');
    } else if(a.t === 'sell'){
      const r = canSellInfo(s, by.id, idx); if(!r.ok) return fail(r.why || 'Impossible.');
      s.props[idx].h--; by.cash += r.gain; ev(s, 'cash', { p:by.id, d:r.gain, why:'sell' });
      say(s, `${by.name} revend un bâtiment sur ${cell(s, idx).name}.`, by.id);
    } else if(a.t === 'mortgage'){
      const r = canMortgageInfo(s, by.id, idx); if(!r.ok || r.un) return fail(r.why || 'Impossible.');
      s.props[idx].m = true; by.cash += r.gain; ev(s, 'cash', { p:by.id, d:r.gain, why:'mortgage' });
      say(s, `${by.name} hypothèque ${cell(s, idx).name} (+${fmt(r.gain)}).`, by.id);
    } else {
      const r = canMortgageInfo(s, by.id, idx); if(!r.ok || !r.un) return fail(r.why || 'Impossible.');
      s.props[idx].m = false; by.cash -= r.cost; ev(s, 'cash', { p:by.id, d:-r.cost, why:'unmortgage' });
      say(s, `${by.name} lève l'hypothèque de ${cell(s, idx).name} (-${fmt(r.cost)}).`, by.id);
    }
    if(s.debt) trySettleDebt(s);
    return done(s);
  }
  case 'payDebt': {
    if(!s.debt || s.debt.pid !== by.id) return fail('Aucune dette.');
    if(by.cash < s.debt.amount) return fail(`Il manque ${fmt(s.debt.amount - by.cash)}.`);
    trySettleDebt(s); return done(s);
  }
  case 'bankrupt': {
    if(!s.debt || s.debt.pid !== by.id) return fail('Seul un joueur endetté peut abandonner.');
    declareBankrupt(s, by); return done(s);
  }
  case 'shield': {
    const pd = s.pending; if(!pd || pd.pid !== by.id) return fail('Rien à protéger.');
    s.pending = null;
    const owner = P(s, pd.owner);
    if(a.use){
      by.powers.splice(by.powers.indexOf('shield'), 1); by.stats.powers++;
      ev(s, 'power', { p:by.id, type:'shield' });
      say(s, `${by.name} active son Bouclier : ${owner.name} ne touche rien !`, by.id, 'power');
    } else payRent(s, by, owner, pd.amount, pd.idx);
    finishLanding(s); return done(s);
  }
  case 'tradePropose': {
    if(s.phase !== 'roll' && s.phase !== 'end') return fail('Pas maintenant.');
    if(s.trade) return fail('Un échange est déjà en cours.');
    const t = { from:by.id, to:a.to, give:tradeSide(a.give), get:tradeSide(a.get) };
    const err = validateTrade(s, t); if(err) return fail(err);
    s.trade = t; say(s, `${by.name} propose un échange à ${P(s, t.to).name}.`, by.id, 'trade');
    ev(s, 'tradeOffer', { from:by.id, to:t.to });
    return done(s);
  }
  case 'tradeAccept': {
    const t = s.trade; if(!t || t.to !== by.id) return fail("Pas d'offre.");
    const err = validateTrade(s, t); if(err){ s.trade = null; return fail(err); }
    executeTrade(s, t); s.trade = null; return done(s);
  }
  case 'tradeDecline': {
    const t = s.trade; if(!t || t.to !== by.id) return fail("Pas d'offre.");
    say(s, `${by.name} refuse l'échange de ${P(s, t.from).name}.`, by.id, 'trade');
    ev(s, 'tradeNo', { p:by.id }); s.trade = null; return done(s);
  }
  case 'power': return usePower(s, by, a);
  default: return fail('Action inconnue.');
  }
}

function done(s){ s.seq++; s.tAct = Date.now(); return ok(); }

function auctionNext(s){
  const au = s.auction;
  const left = au.order.filter(id => !au.passed.includes(id));
  if(left.length === 0 || (left.length === 1 && au.bid > 0 && au.bidder === left[0])){
    return auctionEnd(s);
  }
  // prochain non passé
  let t = au.turn;
  for(let k = 0; k < au.order.length; k++){
    t = (t + 1) % au.order.length;
    if(!au.passed.includes(au.order[t])) break;
  }
  au.turn = t;
}
function auctionEnd(s){
  const au = s.auction; const idx = au.idx;
  if(au.bidder && au.bid > 0){
    const w = P(s, au.bidder);
    w.cash -= au.bid; s.props[idx].o = w.id; w.stats.bought++;
    ev(s, 'cash', { p:w.id, d:-au.bid, why:'auction' }); ev(s, 'buy', { p:w.id, idx });
    say(s, `${w.name} remporte ${cell(s, idx).name} aux enchères pour ${fmt(au.bid)} !`, w.id, 'buy');
  } else say(s, `Personne n'enchérit : ${cell(s, idx).name} reste à vendre.`, null, 'auction');
  s.auction = null;
  finishLanding(s);
}

function doRoll(s, p, d1, d2){
  s.dice = [d1, d2];
  const dbl = d1 === d2, sum = d1 + d2;
  ev(s, 'dice', { p:p.id, d:[d1, d2] });
  say(s, `${p.name} lance les dés : ${d1} + ${d2} = ${sum}${dbl ? ' (double !)' : ''}.`, p.id, 'dice');
  s.doubleAgain = false;
  if(p.inJail){
    if(dbl){
      p.inJail = false; p.jailTries = 0; ev(s, 'free', { p:p.id });
      say(s, `${p.name} fait un double et sort de prison !`, p.id);
      movePlayer(s, p, (p.pos + sum) % 40, {}); s.extraRoll = false;
      landOn(s, p); return done(s);
    }
    p.jailTries++;
    if(p.jailTries >= 3){
      say(s, `${p.name} paie ${fmt(JAIL_FINE)} après 3 tentatives.`, p.id, 'money');
      p.inJail = false; p.jailTries = 0; ev(s, 'free', { p:p.id });
      pay(s, p, null, JAIL_FINE, 'jail', true);
      movePlayer(s, p, (p.pos + sum) % 40, {}); s.extraRoll = false;
      landOn(s, p); return done(s);
    }
    say(s, `${p.name} reste en prison (tentative ${p.jailTries}/3).`, p.id);
    s.phase = 'end'; return done(s);
  }
  if(dbl){
    s.doubles++;
    if(s.doubles >= 3){
      sendToJail(s, p, `${p.name} fait trois doubles : direction la prison !`);
      s.phase = 'end'; return done(s);
    }
  }
  s.extraRoll = dbl;
  movePlayer(s, p, (p.pos + sum) % 40, {});
  landOn(s, p);
  return done(s);
}

function usePower(s, by, a){
  if(!s.rules.powers) return fail('Pouvoirs désactivés.');
  const type = a.type;
  if(!by.powers.includes(type)) return fail("Vous n'avez pas cette carte.");
  if(POWERS[type].reactive) return fail('Cette carte se déclenche toute seule.');
  if(s.phase !== 'roll' && s.phase !== 'end') return fail('Pas maintenant.');
  if(s.trade || s.auction || s.debt || s.pending) return fail('Pas maintenant.');
  const spend = () => { by.powers.splice(by.powers.indexOf(type), 1); by.stats.powers++; ev(s, 'power', { p:by.id, type }); };
  switch(type){
    case 'teleport': {
      if(s.phase !== 'roll' || by.inJail || s.doubles > 0) return fail('Utilisable avant votre lancer, hors prison.');
      const idx = a.idx; if(typeof idx !== 'number' || idx < 0 || idx > 39 || idx === by.pos) return fail('Case invalide.');
      spend(); say(s, `${by.name} se téléporte sur ${cell(s, idx).name} ! 🚀`, by.id, 'power');
      movePlayer(s, by, idx, { teleport:true });
      s.extraRoll = false; s.dice = [0, 0];
      landOn(s, by); return done(s);
    }
    case 'racket': {
      spend(); let tot = 0;
      active(s).forEach(o => { if(o.id !== by.id){ const x = Math.min(40, o.cash); o.cash -= x; tot += x; ev(s, 'cash', { p:o.id, d:-x, why:'racket' }); } });
      by.cash += tot; ev(s, 'cash', { p:by.id, d:tot, why:'racket' });
      say(s, `${by.name} fait un racket : +${fmt(tot)} !`, by.id, 'power');
      return done(s);
    }
    case 'builder': {
      const r = canBuildInfo(s, by.id, a.idx, true); if(!r.ok) return fail(r.why);
      spend(); s.props[a.idx].h++; ev(s, 'build', { p:by.id, idx:a.idx });
      say(s, `${by.name} reçoit un chantier offert sur ${cell(s, a.idx).name} !`, by.id, 'power');
      return done(s);
    }
    case 'strike': {
      const t = P(s, a.target); if(!t || t.bankrupt || t.id === by.id) return fail('Cible invalide.');
      spend(); t.strikeUntil = s.round + 2;
      say(s, `${by.name} déclenche une grève chez ${t.name} : plus de loyers pendant 3 tours !`, by.id, 'power');
      return done(s);
    }
  }
  return fail('Pouvoir inconnu.');
}

/* Effet de bord utile à l'interface : cases où l'on peut construire / vendre pour un joueur */
function manageable(s, pid){
  return ownedBy(s, pid).map(i => ({
    idx:i, build:canBuildInfo(s, pid, i), sell:canSellInfo(s, pid, i), mort:canMortgageInfo(s, pid, i),
  }));
}

MP.engine = {
  GO_SALARY, JAIL_FINE, JAIL_POS, MAX_POWERS, BUILD_COST, POWERS, DEFAULT_RULES,
  newGame, act, actor, fmt, clone, rnd, shuffle,
  P, active, turnPlayer, cell, board, theme, isOwnable,
  groupCells, ownedBy, ownsGroup, monopolies, countType,
  rentTable, rentFor, buildCost, netWorth, liquidValue, standings, houseTotals,
  canBuildInfo, canSellInfo, canMortgageInfo, validateTrade, manageable,
  advanceTurn, deckCards,
};
})();
