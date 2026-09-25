// Efeitos sintetizados na hora (não pesam nada no download) + música opcional por arquivo.

let ctx = null;
let mestre = null;

export function destravarAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    mestre = ctx.createGain();
    mestre.gain.value = 0.35;
    mestre.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function tom({ tipo = 'sine', de, ate, dur = 0.15, vol = 0.6, atraso = 0 }) {
  if (!ctx) return;
  const t = ctx.currentTime + atraso;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(ate ?? de, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(mestre);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function ruido({ dur = 0.3, vol = 0.4, filtro = 900 }) {
  if (!ctx) return;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = filtro;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(mestre);
  src.start();
}

export const som = {
  pulo: () => tom({ tipo: 'square', de: 260, ate: 520, dur: 0.12, vol: 0.18 }),
  lingua: () => tom({ tipo: 'sawtooth', de: 900, ate: 300, dur: 0.1, vol: 0.12 }),
  nhac: () => { tom({ de: 400, ate: 120, dur: 0.12, vol: 0.4 }); ruido({ dur: 0.08, vol: 0.2, filtro: 2000 }); },
  vagalume: () => { tom({ tipo: 'triangle', de: 1320, dur: 0.08, vol: 0.25 }); tom({ tipo: 'triangle', de: 1760, dur: 0.14, vol: 0.25, atraso: 0.06 }); },
  dor: () => tom({ tipo: 'square', de: 300, ate: 90, dur: 0.3, vol: 0.2 }),
  splash: () => ruido({ dur: 0.45, vol: 0.5, filtro: 1400 }),
  impulso: () => tom({ tipo: 'triangle', de: 400, ate: 1400, dur: 0.35, vol: 0.3 }),
  batida: () => { ruido({ dur: 0.2, vol: 0.4, filtro: 500 }); tom({ de: 180, ate: 60, dur: 0.2, vol: 0.3 }); },
  ultrapassou: () => tom({ tipo: 'triangle', de: 880, ate: 1320, dur: 0.12, vol: 0.2 }),
  clarao: () => { for (let k = 0; k < 6; k++) tom({ tipo: 'sine', de: 523 * 2 ** (k / 4), dur: 1.4, vol: 0.18, atraso: k * 0.09 }); },
  puf: () => { ruido({ dur: 0.5, vol: 0.5, filtro: 700 }); tom({ de: 200, ate: 80, dur: 0.4, vol: 0.3 }); },
  sino: () => { tom({ tipo: 'sine', de: 1046, dur: 1.2, vol: 0.25 }); tom({ tipo: 'sine', de: 1568, dur: 1.4, vol: 0.15, atraso: 0.05 }); },
  pingo: () => tom({ tipo: 'sine', de: 700, ate: 1100, dur: 0.18, vol: 0.2 }),
};

// Música: toca se o arquivo existir em public/assets/audio/ (musica_corrida.mp3 etc.). Sem arquivo, silêncio.
let atual = null;
export function tocarMusica(cena, chave, { volume = 0.5, fade = 1200 } = {}) {
  if (atual?.key === chave) return;
  pararMusica(cena, fade);
  if (!cena.cache.audio.exists(chave)) return;
  atual = cena.sound.add(chave, { loop: true, volume: 0 });
  atual.play();
  cena.tweens.add({ targets: atual, volume, duration: fade });
}

export function pararMusica(cena, fade = 800) {
  if (!atual) return;
  const velha = atual;
  atual = null;
  cena.tweens.add({ targets: velha, volume: 0, duration: fade, onComplete: () => velha.destroy() });
}
