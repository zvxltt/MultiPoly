/* MultiPoly v2 — sons synthétisés (WebAudio, aucun fichier) + vibrations. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
let ctx = null, master = null, on = true, lastCoin = 0;
try { on = localStorage.getItem('mp_sound') !== '0'; } catch(e){}

function ac(){
  if(!ctx){
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
    } catch(e){ ctx = null; }
  }
  if(ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, t0, dur, type, vol, slideTo){
  const c = ac(); if(!c || !on) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(freq, c.currentTime + t0);
  if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + t0 + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.2, c.currentTime + t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
  o.connect(g); g.connect(master); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + 0.05);
}
function noise(t0, dur, vol, freq){
  const c = ac(); if(!c || !on) return;
  const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for(let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource(); s.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 1800; f.Q.value = 0.9;
  const g = c.createGain(); g.gain.value = vol || 0.3;
  s.connect(f); f.connect(g); g.connect(master); s.start(c.currentTime + t0);
}
const vib = p => { try { if(on && navigator.vibrate) navigator.vibrate(p); } catch(e){} };

const SFX = {
  tap(){ tone(520, 0, .06, 'triangle', .12); },
  dice(){ for(let i = 0; i < 9; i++) noise(i * .085 + Math.random() * .02, .05, .28 - i * .02, 1200 + Math.random() * 1600); vib([20, 40, 20, 40, 30]); },
  step(){ tone(330 + Math.random() * 60, 0, .05, 'square', .05); },
  coin(){ const n = performance.now(); if(n - lastCoin < 90) return; lastCoin = n; tone(988, 0, .08, 'square', .09); tone(1319, .07, .16, 'square', .09); },
  pay(){ tone(330, 0, .12, 'sawtooth', .08, 180); vib(25); },
  buy(){ tone(523, 0, .1, 'triangle', .16); tone(659, .09, .1, 'triangle', .16); tone(784, .18, .22, 'triangle', .18); vib(30); },
  build(){ noise(0, .05, .35, 400); tone(196, .02, .12, 'square', .1); tone(294, .1, .16, 'triangle', .12); },
  card(){ noise(0, .12, .18, 3000); tone(740, .05, .1, 'sine', .1); },
  jail(){ tone(220, 0, .35, 'sawtooth', .13, 70); tone(110, .1, .4, 'square', .08); vib([60, 40, 90]); },
  bad(){ tone(260, 0, .22, 'sawtooth', .1, 120); vib(40); },
  power(){ tone(440, 0, .1, 'sine', .14); tone(660, .08, .1, 'sine', .14); tone(990, .16, .25, 'sine', .16, 1480); },
  turn(){ tone(660, 0, .09, 'sine', .1); tone(880, .09, .12, 'sine', .1); vib(15); },
  bid(){ tone(700, 0, .06, 'square', .08); tone(900, .06, .09, 'square', .08); },
  win(){ [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * .13, .35, 'triangle', .2)); vib([80, 60, 80, 60, 160]); },
  bankrupt(){ tone(300, 0, .6, 'sawtooth', .13, 60); vib([100, 50, 200]); },
};
MP.sound = {
  play(n){ try { if(on && SFX[n]) SFX[n](); } catch(e){} },
  isOn: () => on,
  set(v){ on = !!v; try { localStorage.setItem('mp_sound', on ? '1' : '0'); } catch(e){} if(on) ac(); },
  unlock(){ ac(); },
};
document.addEventListener('pointerdown', () => ac(), { once:true, passive:true });
})();
