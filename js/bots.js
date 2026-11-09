/* MultiPoly v2 — cerveau des bots (et du pilote automatique des joueurs absents).
   decide(state, pid) renvoie UNE action à jouer, ou null si ce n'est pas à ce joueur d'agir. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const E = () => MP.engine;

const PROFILE = {
  safe: { reserve:380, buy:0.55, bid:0.72, build:1.0 },
  bal:  { reserve:230, buy:0.40, bid:0.88, build:0.9 },
  agg:  { reserve:130, buy:0.25, bid:1.10, build:0.8 },
};
const prof = p => PROFILE[p.ai] || PROFILE.bal;
const round10 = n => Math.max(10, Math.round(n / 10) * 10);

function freeProps(s){ let n = 0; for(const k in s.props) if(!s.props[k].o) n++; return n; }

// Combien le joueur `pid` valorise la case idx (en €)
function valueFor(s, idx, pid){
  const e = E(), c = e.cell(s, idx);
  let v = c.price;
  if(c.group){
    const g = e.groupCells(s, c.group);
    const mine = g.filter(i => i !== idx && s.props[i].o === pid).length;
    if(mine === g.length - 1) v *= 2.0; else v *= 1 + 0.35 * mine;
    // bloquer un monopole adverse
    const others = g.filter(i => i !== idx);
    if(others.length && others.every(i => s.props[i].o && s.props[i].o === s.props[others[0]].o && s.props[i].o !== pid)) v *= 1.25;
  } else if(c.type === 'station'){
    v *= 1 + 0.3 * (e.countType(s, pid, 'station'));
  } else v *= 0.85;
  return v;
}
function completesGroup(s, idx, pid){
  const e = E(), c = e.cell(s, idx); if(!c.group) return false;
  const g = e.groupCells(s, c.group);
  return g.every(i => i === idx || s.props[i].o === pid);
}

/* ------------- enchères */
function auctionAction(s, p){
  const e = E(), au = s.auction, c = e.cell(s, au.idx), pf = prof(p);
  let limit = c.price * pf.bid * (0.85 + Math.random() * 0.3);
  if(completesGroup(s, au.idx, p.id)) limit = c.price * 2.1;
  else if(c.group){
    const mine = e.groupCells(s, c.group).filter(i => s.props[i].o === p.id).length;
    limit *= 1 + 0.2 * mine;
  }
  const spare = p.cash - (p.cash > 600 ? 120 : 40);
  limit = Math.min(limit, spare);
  const next = au.bid === 0 ? round10(c.price * 0.3) : au.bid + 10 * (1 + e.rnd(3));
  if(next <= limit && next > au.bid && next <= p.cash) return { t:'bid', amount:Math.min(next, Math.floor(limit / 10) * 10 || next), by:p.id };
  if(au.bid + 10 <= limit && au.bid + 10 <= p.cash) return { t:'bid', amount:au.bid + 10, by:p.id };
  return { t:'passBid', by:p.id };
}

/* ------------- dettes : on liquide dans l'ordre le moins douloureux */
function debtAction(s, p){
  const e = E(), d = s.debt;
  if(p.cash >= d.amount) return { t:'payDebt', by:p.id };
  const mine = e.ownedBy(s, p.id);
  // 1) hypothéquer ce qui n'est pas un monopole (et sans maison)
  const mono = new Set(e.monopolies(s, p.id));
  const cand = mine.filter(i => !s.props[i].m && e.canMortgageInfo(s, p.id, i).ok);
  const plain = cand.filter(i => !mono.has(e.cell(s, i).group)).sort((a, b) => e.cell(s, a).price - e.cell(s, b).price);
  if(plain.length) return { t:'mortgage', idx:plain[0], by:p.id };
  // 2) revendre des maisons (les plus construites d'abord)
  const sellable = mine.filter(i => e.canSellInfo(s, p.id, i).ok).sort((a, b) => s.props[b].h - s.props[a].h);
  if(sellable.length) return { t:'sell', idx:sellable[0], by:p.id };
  // 3) hypothéquer le reste
  if(cand.length) return { t:'mortgage', idx:cand[0], by:p.id };
  return { t:'bankrupt', by:p.id };
}

/* ------------- échanges */
function tradeValue(s, pid, give, get){ // du point de vue de pid qui reçoit `get` et cède `give`
  const e = E();
  let v = 0;
  get.props.forEach(i => { v += valueFor(s, i, pid); });
  give.props.forEach(i => {
    v -= valueFor(s, i, pid);
    const partner = s.trade ? (s.trade.from === pid ? s.trade.to : s.trade.from) : null;
    if(partner && completesGroup(s, i, partner)) v -= e.cell(s, i).price * 0.5;
    if(e.cell(s, i).group && e.ownsGroup(s, pid, e.cell(s, i).group)) v -= e.cell(s, i).price * 1.5;
  });
  v += get.cash - give.cash + 30 * (get.jail - give.jail);
  return v;
}
function tradeResponse(s, p){
  const t = s.trade, e = E();
  const v = tradeValue(s, p.id, t.get, t.give); // je reçois t.give, je cède t.get
  const total = t.give.props.reduce((a, i) => a + e.cell(s, i).price, 0) + t.give.cash + t.get.props.reduce((a, i) => a + e.cell(s, i).price, 0) + t.get.cash;
  const need = total * (p.ai === 'agg' ? 0.06 : p.ai === 'safe' ? 0.16 : 0.1);
  return { t: v >= need ? 'tradeAccept' : 'tradeDecline', by:p.id };
}
function tradeProposal(s, p){
  const e = E();
  if(p.bt && p.bt.tradeRound >= s.round - 1) return null;
  const gs = ['g0','g1','g2','g3','g4','g5','g6','g7'];
  for(const g of gs){
    const cells = e.groupCells(s, g);
    const mine = cells.filter(i => s.props[i].o === p.id);
    const miss = cells.filter(i => s.props[i].o !== p.id);
    if(miss.length !== 1 || mine.length !== cells.length - 1) continue;
    const m = miss[0], pr = s.props[m];
    if(!pr.o || e.P(s, pr.o).bankrupt) continue;
    if(e.groupCells(s, g).some(i => s.props[i].h > 0)) continue;
    const price = e.cell(s, m).price;
    const budget = Math.floor((p.cash - 80) / 10) * 10;
    if(budget < price * 1.2) continue;
    const cash = Math.min(budget, round10(price * (1.6 + Math.random() * 0.8)));
    p.bt = p.bt || {}; p.bt.tradeRound = s.round;
    return { t:'tradePropose', to:pr.o, give:{ props:[], cash, jail:0 }, get:{ props:[m], cash:0, jail:0 }, by:p.id };
  }
  return null;
}

/* ------------- pouvoirs */
function powerAction(s, p){
  const e = E();
  if(!s.rules.powers || !p.powers.length) return null;
  if(p.powers.includes('builder')){
    const c = e.ownedBy(s, p.id).filter(i => e.canBuildInfo(s, p.id, i, true).ok).sort((a, b) => e.cell(s, b).price - e.cell(s, a).price);
    if(c.length) return { t:'power', type:'builder', idx:c[0], by:p.id };
  }
  const opps = e.active(s).filter(o => o.id !== p.id);
  if(p.powers.includes('strike')){
    const t = opps.map(o => ({ o, n: e.ownedBy(s, o.id).length + 3 * e.monopolies(s, o.id).length })).sort((a, b) => b.n - a.n)[0];
    if(t && t.n >= 4) return { t:'power', type:'strike', target:t.o.id, by:p.id };
  }
  if(p.powers.includes('racket') && opps.reduce((a, o) => a + Math.min(40, o.cash), 0) >= 100) return { t:'power', type:'racket', by:p.id };
  if(p.powers.includes('teleport') && s.phase === 'roll' && !p.inJail && s.doubles === 0){
    const b = e.board(s); let best = null, bs = 0;
    b.forEach((c, i) => {
      if(i === p.pos || !e.isOwnable(c) || s.props[i].o) return;
      if(p.cash < c.price + 60) return;
      let sc = 0;
      if(completesGroup(s, i, p.id)) sc = 100 + c.price / 10;
      else if(c.price >= 300) sc = 40;
      if(sc > bs){ bs = sc; best = i; }
    });
    if(best !== null && bs >= 40) return { t:'power', type:'teleport', idx:best, by:p.id };
  }
  return null;
}

/* ------------- gestion du patrimoine (hors dette) */
function manageAction(s, p, allowTrade){
  const e = E(), pf = prof(p);
  const mine = e.ownedBy(s, p.id);
  // lever des hypothèques si on est à l'aise
  const un = mine.filter(i => s.props[i].m).sort((a, b) => e.cell(s, b).price - e.cell(s, a).price);
  for(const i of un){
    const r = e.canMortgageInfo(s, p.id, i);
    if(r.ok && p.cash - r.cost > pf.reserve + 150) return { t:'unmortgage', idx:i, by:p.id };
  }
  // construire sur les monopoles
  if(e.monopolies(s, p.id).length){
    const opts = mine.filter(i => e.canBuildInfo(s, p.id, i).ok)
      .map(i => ({ i, cost:e.buildCost(s, i), h:s.props[i].h }))
      .filter(o => p.cash - o.cost >= pf.reserve * pf.build)
      .sort((a, b) => a.h - b.h || b.cost - a.cost);
    if(opts.length) return { t:'build', idx:opts[0].i, by:p.id };
  }
  const pw = powerAction(s, p); if(pw) return pw;
  if(allowTrade){ const tr = tradeProposal(s, p); if(tr) return tr; }
  return null;
}

/* ------------- achat */
function buyDecision(s, p){
  const e = E(), c = e.cell(s, p.pos), pf = prof(p);
  if(p.cash < c.price) return { t:'declineBuy', by:p.id };
  const after = p.cash - c.price;
  if(completesGroup(s, p.pos, p.id) && after >= 20) return { t:'buy', by:p.id };
  const early = freeProps(s) > 12 ? 0.6 : 1;
  const need = pf.reserve * pf.buy * early;
  let want = after >= need;
  if(c.type === 'utility' && Math.random() < 0.35) want = false;
  if(c.type === 'station' && after >= 40) want = true;
  return { t: want ? 'buy' : 'declineBuy', by:p.id };
}

/* ------------- point d'entrée */
function decide(s, pid){
  const e = E();
  if(s.winner) return null;
  const p = e.P(s, pid);
  if(!p || p.bankrupt || e.actor(s) !== pid) return null;
  if(s.pending) return { t:'shield', use: s.pending.amount >= 50 || e.rnd(3) === 0, by:pid };
  if(s.debt) return debtAction(s, p);
  if(s.auction) return auctionAction(s, p);
  if(s.trade) return s.trade.to === pid ? tradeResponse(s, p) : null;
  if(s.phase === 'buy') {
    const m = manageAction(s, p, false);
    if(m && m.t === 'unmortgage') return buyDecision(s, p); // pas de dépense avant de décider
    return buyDecision(s, p);
  }
  if(s.phase === 'roll'){
    if(p.inJail){
      if(p.jailCards > 0) return { t:'useJailCard', by:pid };
      const early = freeProps(s) > 10;
      if(early && p.cash >= JAIL_OK(p)) return { t:'payJail', by:pid };
    }
    const m = manageAction(s, p, false);
    if(m) return m;
    return { t:'roll', by:pid };
  }
  if(s.phase === 'end'){
    const m = manageAction(s, p, true);
    if(m) return m;
    return { t:'endTurn', by:pid };
  }
  return null;
}
const JAIL_OK = p => p.ai === 'safe' ? 400 : 250;

MP.bots = { decide, valueFor, completesGroup };
})();
