/* MultiPoly v2 — profil local (pseudo, emblème, XP, niveaux).
   Même clé de stockage que la v1 : ta progression est conservée. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const KEY = 'multipoly_profile_v1';
const DEV_KEY = 'multipoly_device_v2';
const XP_PER_LEVEL = 100;

const EMBLEMS = [
  { e:'⭐', c:'#f1c40f', unlock:1 }, { e:'🔥', c:'#e74c3c', unlock:1 }, { e:'💎', c:'#3498db', unlock:1 },
  { e:'🌟', c:'#9b59b6', unlock:1 }, { e:'🎯', c:'#2ecc71', unlock:1 }, { e:'🎖️', c:'#e67e22', unlock:1 },
  { e:'🏅', c:'#1abc9c', unlock:1 }, { e:'⚡', c:'#f39c12', unlock:1 },
  { e:'👑', c:'#f1c40f', unlock:2 }, { e:'🚀', c:'#34495e', unlock:3 }, { e:'🦁', c:'#d35400', unlock:4 },
  { e:'🐉', c:'#27ae60', unlock:5 }, { e:'🛡️', c:'#2980b9', unlock:6 }, { e:'💫', c:'#8e44ad', unlock:7 },
  { e:'🌈', c:'#c0392b', unlock:8 }, { e:'🎇', c:'#16a085', unlock:9 },
  // secret : invisible tant que le pseudo ne correspond pas
  { e:'🎮', c:'#5a4a8f', secretName:'zvxlt' },
];

function load(){
  const d = { pseudo:'', emblemIdx:0, xp:0, gamesPlayed:0, gamesWon:0, bestWorth:0, rentTotal:0 };
  try {
    const raw = localStorage.getItem(KEY);
    if(raw){ const p = JSON.parse(raw); for(const k in d) if(typeof p[k] === typeof d[k]) d[k] = p[k]; }
  } catch(e){}
  return d;
}
let profile = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch(e){} };

const level = () => Math.floor(profile.xp / XP_PER_LEVEL) + 1;
const xpInto = () => profile.xp % XP_PER_LEVEL;
const unlocked = (em, lvl, pseudo) => em.secretName ? !!(pseudo && pseudo.trim().toLowerCase() === em.secretName) : em.unlock <= lvl;
function emblem(){
  const em = EMBLEMS[profile.emblemIdx];
  return em && unlocked(em, level(), profile.pseudo) ? em : EMBLEMS[0];
}
const has = () => !!(profile.pseudo && profile.pseudo.trim());

function deviceId(){
  let d = null;
  try { d = localStorage.getItem(DEV_KEY); } catch(e){}
  if(!d){ d = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); try { localStorage.setItem(DEV_KEY, d); } catch(e){} }
  return d;
}

MP.profile = {
  EMBLEMS, XP_PER_LEVEL, get: () => profile, save, level, xpInto, emblem, has, unlocked, deviceId,
  setPseudo(v){ profile.pseudo = v.trim().slice(0, 16); save(); },
  setEmblem(i){ profile.emblemIdx = i; save(); },
  addXP(n){ profile.xp += n; save(); },
  recordGame(won, worth, rent){
    profile.gamesPlayed++; if(won) profile.gamesWon++;
    profile.bestWorth = Math.max(profile.bestWorth, worth || 0); profile.rentTotal += rent || 0; save();
  },
};

})();
