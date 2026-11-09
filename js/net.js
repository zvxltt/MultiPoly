/* MultiPoly v2 — transport en ligne (MQTT sur WebSocket, courtier public HiveMQ).
   Aucun compte, aucun serveur à toi : un « salon » = deux sujets MQTT.
     …/<CODE>/s  : état complet du salon (retenu) — écrit UNIQUEMENT par l'hôte
     …/<CODE>/i  : messages des joueurs vers l'hôte (join, act, ping…) */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const PREFIX = 'multipoly-v2/r/';
let client = null, status = 'connecting';
const subs = new Map(), statusCbs = [];
const setStatus = s => { status = s; statusCbs.forEach(f => { try { f(s); } catch(e){} }); };

function connect(){
  if(client) return;
  if(typeof mqtt === 'undefined'){ setStatus('bad'); return; }
  try {
    client = mqtt.connect(BROKER, { clientId:'mp2-' + Math.random().toString(16).slice(2, 10), clean:true, reconnectPeriod:2000, connectTimeout:8000, keepalive:30 });
  } catch(e){ setStatus('bad'); return; }
  client.on('connect', () => { setStatus('ok'); subs.forEach((h, t) => client.subscribe(t, { qos:1 })); });
  client.on('reconnect', () => setStatus('connecting'));
  client.on('offline', () => setStatus('bad'));
  client.on('error', () => setStatus('bad'));
  client.on('message', (topic, payload) => {
    const h = subs.get(topic); if(!h) return;
    let m; try { m = JSON.parse(payload.toString()); } catch(e){ return; }
    try { h(m); } catch(e){ console.error(e); }
  });
}

MP.net = {
  connect,
  status: () => status,
  onStatus(f){ statusCbs.push(f); f(status); },
  ready: () => !!(client && client.connected),
  topicS: code => PREFIX + code + '/s',
  topicI: code => PREFIX + code + '/i',
  sub(topic, h){ subs.set(topic, h); if(client && client.connected) client.subscribe(topic, { qos:1 }); },
  unsub(topic){ subs.delete(topic); if(client && client.connected) client.unsubscribe(topic); },
  pub(topic, obj, retain){ if(!client || !client.connected) return false; client.publish(topic, JSON.stringify(obj), { qos:1, retain:!!retain }); return true; },
  clear(topic){ if(client && client.connected) client.publish(topic, '', { qos:1, retain:true }); },
  waitReady(ms){
    return new Promise(res => {
      if(MP.net.ready()) return res(true);
      let t = 0; const iv = setInterval(() => { t += 150; if(MP.net.ready()){ clearInterval(iv); res(true); } else if(t >= (ms || 8000)){ clearInterval(iv); res(false); } }, 150);
    });
  },
  code(){ const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for(let i = 0; i < 5; i++) c += A[Math.floor(Math.random() * A.length)]; return c; },
};
})();
