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
    // iPhone (iOS 17+): toca mesmo com a chave do silencioso ligada, como um vídeo
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}
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

// ---------- Trilha de piano (gerada na hora, do título até o chefe) ----------
// Progressão em dó maior, 72 bpm, arpejo em colcheias com uma melodia por cima.
const COLCHEIA = 60 / 72 / 2;
const ACORDES = [ // [nota do baixo (midi), terça maior?, melodia nos tempos 1 e 3]
  [48, true, [76, 79]], [43, true, [74, 71]], [45, false, [72, 76]], [41, true, [77, 72]],
  [48, true, [76, 72]], [43, true, [74, 79]], [41, true, [77, 76]], [43, true, [74, null]],
  [45, false, [72, 71]], [41, true, [69, 72]], [48, true, [67, 72]], [43, true, [71, 74]],
  [45, false, [76, 72]], [41, true, [77, 81]], [50, false, [77, 74]], [43, true, [74, 71]],
];
const ARPEJO = [0, 1, 2, 3, 4, 3, 2, 1];
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

let piano = null;

function salaReverb() {
  const dur = 2.8;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
  }
  const r = ctx.createConvolver();
  r.buffer = buf;
  return r;
}

function notaPiano(midi, t, vel, dur) {
  const f = hz(midi);
  const parciais = [1, 0.45, 0.2, 0.1, 0.05];
  parciais.forEach((amp, k) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = f * (k + 1) * (1 + k * 0.0006); // leve desafinação, como corda de verdade
    const d = dur / (1 + k * 0.7); // harmônicos agudos morrem antes
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel * amp, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(piano.entrada);
    o.start(t);
    o.stop(t + d + 0.05);
  });
}

function agendarPiano() {
  while (piano && piano.proximo < ctx.currentTime + 0.6) {
    const t = piano.proximo + (Math.random() - 0.5) * 0.016;
    const passo = piano.passo;
    const [baixo, maior, melodia] = ACORDES[Math.floor(passo / 8) % ACORDES.length];
    const i = passo % 8;
    const terca = maior ? 4 : 3;
    const tons = [baixo + 12, baixo + 19, baixo + 24, baixo + 24 + terca, baixo + 31];
    const v = 0.85 + Math.random() * 0.3;
    if (i === 0) { notaPiano(baixo, t, 0.16 * v, 3.2); notaPiano(baixo - 12, t, 0.08 * v, 3.2); }
    notaPiano(tons[ARPEJO[i]], t, 0.07 * v, 1.8);
    if ((i === 0 || i === 4) && melodia[i / 4]) notaPiano(melodia[i / 4], t + 0.01, 0.15 * v, 2.6);
    piano.proximo += COLCHEIA;
    piano.passo++;
  }
}

export function iniciarPiano() {
  if (!ctx || piano) return;
  const saida = ctx.createGain();
  saida.gain.setValueAtTime(0.0001, ctx.currentTime);
  saida.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 3);
  saida.connect(mestre);
  const entrada = ctx.createBiquadFilter();
  entrada.type = 'lowpass';
  entrada.frequency.value = 3400;
  const seco = ctx.createGain();
  seco.gain.value = 0.75;
  const molhado = ctx.createGain();
  molhado.gain.value = 0.4;
  entrada.connect(seco).connect(saida);
  entrada.connect(salaReverb()).connect(molhado).connect(saida);
  piano = { entrada, saida, proximo: ctx.currentTime + 0.15, passo: 0 };
  piano.timer = setInterval(agendarPiano, 100);
  agendarPiano();
}

export function pararPiano(fade = 2.5) {
  if (!piano) return;
  const p = piano;
  piano = null;
  clearInterval(p.timer);
  p.saida.gain.cancelScheduledValues(ctx.currentTime);
  p.saida.gain.setValueAtTime(Math.max(p.saida.gain.value, 0.0001), ctx.currentTime);
  p.saida.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fade);
  setTimeout(() => p.saida.disconnect(), (fade + 4) * 1000);
}

// ---------- Música depois do chefe (public/assets/audio/musica.mp3) ----------
// Elemento <audio> em vez de Web Audio: toca no Safari do iPhone, no Samsung Internet e no PC,
// e começa a tocar antes de baixar o arquivo inteiro. O iPhone só deixa tocar som a partir
// de um toque, e só conta o toque quando o dedo SAI da tela; por isso todo gesto passa por
// aoGesto(), que destrava o áudio e, se a música estiver esperando, dá o play ali mesmo.
let faixa = null;
let faixaQuerTocar = false;
let faixaFade = null;

function prepararFaixa() {
  if (faixa) return;
  faixa = new Audio('assets/audio/musica.mp3');
  faixa.loop = true;
  faixa.preload = 'auto';
  faixa.setAttribute('playsinline', '');
  // "aquece" o elemento no primeiro gesto: depois disso o iPhone deixa tocar quando quisermos
  faixa.muted = true;
  faixa.play().then(() => { if (!faixaQuerTocar) { faixa.pause(); faixa.currentTime = 0; } faixa.muted = false; })
    .catch(() => { faixa.muted = false; });
}

function tentarFaixa() {
  if (!faixa || !faixaQuerTocar) return;
  faixa.muted = false;
  faixa.volume = 1;
  if (faixa.paused) faixa.play().catch(() => {}); // recusado: o próximo toque tenta de novo
}

export function tocarFaixa() {
  prepararFaixa();
  clearInterval(faixaFade);
  faixaQuerTocar = true;
  faixa.currentTime = 0;
  tentarFaixa();
}

export function pararFaixa(fade = 1200) {
  faixaQuerTocar = false;
  if (!faixa || faixa.paused) return;
  clearInterval(faixaFade);
  const passos = 20;
  let n = 0;
  faixaFade = setInterval(() => {
    n++;
    faixa.volume = Math.max(0, 1 - n / passos); // o iPhone ignora volume; lá ela só para
    if (n >= passos) { clearInterval(faixaFade); faixa.pause(); faixa.volume = 1; }
  }, fade / passos);
}

function aoGesto() {
  destravarAudio();
  prepararFaixa();
  tentarFaixa();
}

export function ouvirGestos() {
  for (const tipo of ['pointerup', 'touchend', 'click', 'keydown']) {
    window.addEventListener(tipo, aoGesto, { capture: true, passive: true });
  }
  // aba em segundo plano / tela apagada: silencia; ao voltar, retoma de onde parou
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      ctx?.suspend();
      faixa?.pause();
    } else {
      ctx?.resume();
      tentarFaixa();
    }
  });
}
