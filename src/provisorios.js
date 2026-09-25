// Desenhos PROVISÓRIOS, só pra o jogo rodar enquanto as imagens do GPT não chegam.
// Toda chave que tiver arquivo em public/assets/ ignora isto sozinha.

const Q = 128; // lado do quadro provisório

const COR = {
  esperma: '#e8f1fb', espermaSombra: '#9fb8d6',
  coroa: '#f3c64a', laco: '#e0604f',
  sapo: '#6fb04a', sapoEscuro: '#3f7a2c', barriga: '#d9e8a0',
  olho: '#141a22',
};

function folha(cena, chave, n, desenhar, w = Q, h = Q) {
  if (cena.textures.exists(chave)) return;
  const tex = cena.textures.createCanvas(chave, w * n, h);
  const ctx = tex.getContext();
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.translate(i * w, 0);
    desenhar(ctx, i, w, h);
    ctx.restore();
    tex.add(i, 0, i * w, 0, w, h);
  }
  tex.refresh();
}

function olhos(ctx, x, y, r, fechado = false) {
  if (fechado) {
    ctx.strokeStyle = COR.olho; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0.2, Math.PI - 0.2); ctx.stroke();
    return;
  }
  ctx.fillStyle = COR.olho;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x + r * 0.3, y - r * 0.35, r * 0.32, 0, Math.PI * 2); ctx.fill();
}

function coroa(ctx, x, y, s = 1) {
  ctx.fillStyle = COR.coroa;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y); ctx.lineTo(x - 12 * s, y - 12 * s); ctx.lineTo(x - 6 * s, y - 5 * s);
  ctx.lineTo(x, y - 15 * s); ctx.lineTo(x + 6 * s, y - 5 * s); ctx.lineTo(x + 12 * s, y - 12 * s);
  ctx.lineTo(x + 12 * s, y); ctx.closePath(); ctx.fill();
}

function esperminha(ctx, fase, { cor = COR.esperma, sombra = COR.espermaSombra, real = true, cara = 'feliz', esticado = 1 } = {}) {
  // cauda ondulada
  ctx.strokeStyle = sombra; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let t = 0; t <= 1; t += 0.05) {
    const x = 70 - t * 64 * esperminha.esticar(esticado);
    const y = 68 + Math.sin(t * 7 + fase) * 12 * t;
    t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  // cabeça
  const g = ctx.createRadialGradient(80, 56, 4, 86, 66, 32);
  g.addColorStop(0, '#fff'); g.addColorStop(1, cor);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(88, 66, 30 * esticado, 26, 0, 0, Math.PI * 2); ctx.fill();
  if (cara === 'tonta') {
    ctx.strokeStyle = COR.olho; ctx.lineWidth = 2;
    for (const ox of [82, 100]) { ctx.beginPath(); ctx.arc(ox, 60, 5, 0, 5); ctx.stroke(); }
  } else {
    olhos(ctx, 82, 60, 6, cara === 'piscando');
    olhos(ctx, 100, 60, 6, cara === 'piscando');
  }
  ctx.fillStyle = '#c9423a';
  ctx.beginPath(); ctx.arc(92, 74, cara === 'vitoria' ? 9 : 6, 0, Math.PI); ctx.fill();
  if (real) {
    coroa(ctx, 90, 42);
    ctx.fillStyle = COR.laco;
    ctx.beginPath(); ctx.moveTo(62, 76); ctx.lineTo(50, 68); ctx.lineTo(50, 86); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(62, 76); ctx.lineTo(74, 68); ctx.lineTo(74, 86); ctx.closePath(); ctx.fill();
  }
}
esperminha.esticar = (e) => e;

function sapinha(ctx, i) {
  const agach = i === 2 || i === 4;
  const noAr = i === 3;
  const cy = agach ? 88 : noAr ? 70 : 80;
  // pernas
  ctx.fillStyle = COR.sapoEscuro;
  if (noAr) {
    ctx.beginPath(); ctx.ellipse(38, 96, 22, 7, -0.5, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.ellipse(46, 106, 18, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(86, 108, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
  // corpo
  ctx.fillStyle = COR.sapo;
  ctx.beginPath(); ctx.ellipse(64, cy, 36, agach ? 24 : 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COR.barriga;
  ctx.beginPath(); ctx.ellipse(74, cy + 10, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
  // olhos em calombo
  ctx.fillStyle = COR.sapo;
  ctx.beginPath(); ctx.arc(66, cy - 26, 13, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(90, cy - 22, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(67, cy - 27, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(91, cy - 23, 8, 0, Math.PI * 2); ctx.fill();
  const fechado = i === 1 || i === 7;
  if (i === 6) {
    ctx.strokeStyle = COR.olho; ctx.lineWidth = 2;
    for (const [x, y] of [[67, cy - 27], [91, cy - 23]]) { ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke(); }
  } else {
    olhos(ctx, 69, cy - 27, 5, fechado);
    olhos(ctx, 93, cy - 23, 4.5, fechado);
  }
  // boca
  ctx.strokeStyle = COR.sapoEscuro; ctx.lineWidth = 3;
  if (i === 5) {
    ctx.fillStyle = '#7a2a33';
    ctx.beginPath(); ctx.ellipse(94, cy - 4, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(88, cy - 8, 12, 0.2, Math.PI - 0.6); ctx.stroke();
  }
  coroa(ctx, 72, cy - 36, 0.8);
  // lencinho coral
  ctx.fillStyle = COR.laco;
  ctx.beginPath(); ctx.moveTo(50, cy - 6); ctx.lineTo(34, cy - 14); ctx.lineTo(38, cy + 2); ctx.closePath(); ctx.fill();
}

function inimigo(ctx, i) {
  const a = i % 2;
  if (i <= 1 || i === 4 || i === 5) {
    // mosquito / libélula
    const lib = i >= 4;
    ctx.fillStyle = lib ? '#4fa3a8' : '#6b5a4a';
    ctx.beginPath(); ctx.ellipse(64, 70, lib ? 34 : 20, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(lib ? 34 : 46, 66, 12, 0, Math.PI * 2); ctx.fill();
    olhos(ctx, lib ? 30 : 42, 62, 5); olhos(ctx, lib ? 40 : 52, 64, 4);
    if (!lib) { ctx.strokeStyle = '#6b5a4a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(36, 70); ctx.lineTo(16, 78); ctx.stroke(); }
    ctx.fillStyle = 'rgba(220,240,255,.7)';
    ctx.beginPath(); ctx.ellipse(64, a ? 44 : 52, 14, a ? 22 : 12, a ? -0.3 : -1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(78, a ? 46 : 54, 12, a ? 18 : 10, a ? 0.3 : 1, 0, Math.PI * 2); ctx.fill();
  } else if (i <= 3) {
    // besouro
    ctx.fillStyle = '#3d2f55';
    ctx.beginPath(); ctx.ellipse(66, 80, 34, 26, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(32, 78, 68, 10);
    ctx.fillStyle = '#2a2140';
    ctx.beginPath(); ctx.arc(34, 76, 13, 0, Math.PI * 2); ctx.fill();
    olhos(ctx, 30, 72, 5);
    ctx.strokeStyle = '#2a2140'; ctx.lineWidth = 4;
    for (let k = 0; k < 3; k++) { const x = 46 + k * 18; ctx.beginPath(); ctx.moveTo(x, 88); ctx.lineTo(x + (a ? 6 : -6), 102); ctx.stroke(); }
  } else {
    // chefe: sapão de gravata
    const derrotado = i === 7;
    ctx.fillStyle = '#7b8a45';
    ctx.beginPath(); ctx.ellipse(64, 78, 52, 40, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c8cf8c';
    ctx.beginPath(); ctx.ellipse(56, 92, 32, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8323a';
    ctx.beginPath(); ctx.moveTo(56, 70); ctx.lineTo(50, 96); ctx.lineTo(56, 104); ctx.lineTo(62, 96); ctx.closePath(); ctx.fill();
    if (derrotado) {
      ctx.fillStyle = COR.coroa;
      for (const [x, y] of [[40, 30], [64, 22], [88, 30]]) { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); }
      olhos(ctx, 42, 52, 6, true); olhos(ctx, 70, 50, 6, true);
    } else {
      olhos(ctx, 42, 52, 7); olhos(ctx, 70, 50, 7);
      ctx.strokeStyle = '#3c4520'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(32, 40); ctx.lineTo(50, 46); ctx.moveTo(80, 40); ctx.lineTo(62, 46); ctx.stroke();
    }
  }
}

function item(ctx, i) {
  if (i <= 2) {
    const r = [14, 18, 22][i];
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, r * 2);
    g.addColorStop(0, '#fff6c8'); g.addColorStop(0.35, '#f5d45a'); g.addColorStop(1, 'rgba(245,212,90,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(64, 64, r * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe98a'; ctx.beginPath(); ctx.arc(64, 64, 12, 0, Math.PI * 2); ctx.fill();
  } else if (i === 3) {
    ctx.fillStyle = COR.laco;
    ctx.beginPath(); ctx.moveTo(64, 100); ctx.bezierCurveTo(10, 60, 40, 20, 64, 46); ctx.bezierCurveTo(88, 20, 118, 60, 64, 100); ctx.fill();
  } else if (i === 4) {
    ctx.strokeStyle = '#f5d45a'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.ellipse(64, 64, 22, 50, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,240,170,.5)'; ctx.lineWidth = 18; ctx.stroke();
  } else if (i === 5) {
    ctx.fillStyle = '#b8323a';
    ctx.beginPath(); ctx.arc(64, 64, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f0a19a';
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; ctx.beginPath(); ctx.arc(64 + Math.cos(a) * 36, 64 + Math.sin(a) * 36, 8, 0, Math.PI * 2); ctx.fill(); }
  } else if (i === 6) {
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, '#fffbe0'); g.addColorStop(0.5, '#f5c84a'); g.addColorStop(1, 'rgba(245,200,74,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#f4efe2'; ctx.fillRect(28, 20, 72, 86);
    ctx.fillStyle = '#3a5560'; ctx.fillRect(34, 26, 60, 60);
  }
}

function plataforma(ctx, i, w, h) {
  const madeira = '#6a4a30', musgo = '#5d8a3a';
  if (i === 0 || i === 1 || i === 4) {
    ctx.fillStyle = madeira;
    const alt = i === 4 ? 70 : 34;
    ctx.fillRect(6, h - alt - 20, w - 12, alt);
    ctx.fillStyle = musgo; ctx.fillRect(6, h - alt - 24, w - 12, 10);
  } else if (i === 2) {
    ctx.fillStyle = '#5f9a44'; ctx.beginPath(); ctx.ellipse(64, 90, 58, 16, 0, 0, Math.PI * 2); ctx.fill();
  } else if (i === 3) {
    ctx.fillStyle = '#3b2e24'; ctx.fillRect(0, 30, w, h - 30);
    ctx.fillStyle = musgo; ctx.fillRect(0, 22, w, 14);
  } else if (i === 5) {
    ctx.fillStyle = madeira; ctx.fillRect(60, 60, 8, 60);
    ctx.fillStyle = '#8a6440'; ctx.fillRect(22, 24, 84, 48);
  } else if (i === 6) {
    ctx.fillStyle = madeira; ctx.fillRect(40, 20, 6, 100);
    ctx.fillStyle = COR.laco; ctx.beginPath(); ctx.moveTo(46, 24); ctx.lineTo(96, 40); ctx.lineTo(46, 58); ctx.fill();
  } else {
    ctx.fillStyle = '#7b5a3a'; ctx.fillRect(0, 70, w, 16);
    ctx.fillStyle = madeira; for (const x of [10, 110]) ctx.fillRect(x, 80, 8, 48);
  }
}

function vitoriaRegia(ctx, i) {
  if (i <= 3) {
    const rx = [58, 50, 44, 60][i];
    ctx.fillStyle = '#2f5e3a'; ctx.beginPath(); ctx.ellipse(64, 84, rx, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5e9a4c'; ctx.beginPath(); ctx.ellipse(64, 80, rx - 4, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3f7a3c'; ctx.lineWidth = 2;
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(64, 80); ctx.lineTo(64 + Math.cos(a) * (rx - 6), 80 + Math.sin(a) * 12); ctx.stroke(); }
  } else if (i <= 6) {
    const abre = i - 4;
    ctx.fillStyle = '#e38aa8';
    for (let k = -2; k <= 2; k++) { ctx.save(); ctx.translate(64, 90); ctx.rotate(k * (0.25 + abre * 0.18)); ctx.beginPath(); ctx.ellipse(0, -22, 9, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    if (abre === 2) { ctx.fillStyle = '#ffe98a'; ctx.beginPath(); ctx.arc(64, 84, 8, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.strokeStyle = '#4a6a3a'; ctx.lineWidth = 4;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(40 + k * 12, 124); ctx.quadraticCurveTo(38 + k * 12, 60, 46 + k * 10, 20 + k * 6); ctx.stroke(); }
  }
}

function silhuetaAmigo(ctx, i, w, h, semente) {
  const tons = ['#c98b6b', '#8d5a3b', '#e0b08f', '#6e4430', '#d49a7a'];
  const roupas = ['#4a7a5a', '#b5563f', '#d8b24a', '#5a6fa8', '#8a4f7a'];
  const s = semente % 5;
  ctx.fillStyle = roupas[s];
  ctx.beginPath(); ctx.moveTo(34, h); ctx.lineTo(40, 120); ctx.quadraticCurveTo(64, 100, 88, 120); ctx.lineTo(94, h); ctx.fill();
  ctx.fillStyle = tons[s];
  ctx.beginPath(); ctx.arc(64, 84, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2a1d18';
  ctx.beginPath(); ctx.arc(64, 76, 28, Math.PI, 0); ctx.fill();
  olhos(ctx, 56, 88, 3.5); olhos(ctx, 72, 88, 3.5);
  ctx.strokeStyle = '#3a2418'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(64, 96, 7, 0.2, Math.PI - 0.2); ctx.stroke();
  // braço (acenando no quadro 1)
  ctx.strokeStyle = tons[s]; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(88, 130);
  i === 1 ? ctx.lineTo(108, 86) : ctx.lineTo(100, 176);
  ctx.stroke();
}

function princesa(ctx, _i, w, h) {
  ctx.fillStyle = '#4f8a4a';
  ctx.beginPath(); ctx.moveTo(64, 100); ctx.lineTo(10, h - 6); ctx.quadraticCurveTo(64, h + 10, 118, h - 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8d9a0';
  ctx.beginPath(); ctx.moveTo(64, 120); ctx.lineTo(34, h - 10); ctx.lineTo(94, h - 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9a6040'; ctx.beginPath(); ctx.arc(64, 70, 24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2a1a14'; ctx.beginPath(); ctx.ellipse(64, 72, 36, 42, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(28, 70, 14, 60); ctx.fillRect(86, 70, 14, 60);
  olhos(ctx, 56, 72, 3, true); olhos(ctx, 72, 72, 3, true);
  coroa(ctx, 64, 38, 1.1);
}

function camada(cena, chave, desenhar, w = 1280, h = 720) {
  if (cena.textures.exists(chave)) return;
  const tex = cena.textures.createCanvas(chave, w, h);
  desenhar(tex.getContext(), w, h);
  tex.refresh();
}

function arvores(ctx, w, h, cor, base, alt, n, semente) {
  ctx.fillStyle = cor;
  let r = semente;
  const rand = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let k = 0; k <= n; k++) {
    const x = (k / n) * w;
    const a = alt * (0.6 + rand() * 0.6);
    ctx.fillRect(x - 6, base - a, 12, a);
    ctx.beginPath(); ctx.ellipse(x, base - a, 50 + rand() * 40, 40 + rand() * 30, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillRect(0, base, w, h - base);
}

export function gerarProvisorios(cena) {
  folha(cena, 'esperminha', 8, (ctx, i) => {
    if (i <= 3) esperminha(ctx, i * (Math.PI / 2));
    else if (i === 4) esperminha(ctx, 0, { esticado: 1.25 });
    else if (i === 5) esperminha(ctx, 1, { cara: 'tonta' });
    else if (i === 6) esperminha(ctx, 2, { cara: 'vitoria' });
    else esperminha(ctx, 0, { cara: 'piscando' });
  });
  const coresRivais = [['#c9b8ea', '#8f7cc0'], ['#f0e3a0', '#c9b760'], ['#f4c3d3', '#d58aa3'], ['#cfe0e8', '#95aab5']];
  folha(cena, 'rivais', 8, (ctx, i) => {
    const [cor, sombra] = coresRivais[i % 4];
    esperminha(ctx, i >= 4 ? Math.PI : 0, { cor, sombra, real: false });
  });
  folha(cena, 'sapinha', 8, sapinha);
  folha(cena, 'inimigos', 8, inimigo);
  folha(cena, 'itens', 8, item);
  folha(cena, 'plataformas', 8, plataforma);
  folha(cena, 'vitorias_regias', 8, vitoriaRegia);
  folha(cena, 'princesa', 1, princesa, 128, 256);

  camada(cena, 'corrida_1', (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#12303a'); g.addColorStop(0.5, '#1f4a4f'); g.addColorStop(1, '#0f2229');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    arvores(ctx, w, h, 'rgba(10,30,34,.6)', h * 0.8, 260, 7, 3);
  });
  camada(cena, 'corrida_2', (ctx, w, h) => {
    ctx.fillStyle = 'rgba(150,210,220,.18)';
    ctx.beginPath(); ctx.moveTo(0, h * 0.3);
    ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.45, w, h * 0.3);
    ctx.lineTo(w, h * 0.78); ctx.bezierCurveTo(w * 0.6, h * 0.9, w * 0.3, h * 0.7, 0, h * 0.78); ctx.fill();
    ctx.strokeStyle = 'rgba(220,245,250,.35)'; ctx.lineWidth = 2;
    for (let k = 0; k < 40; k++) { ctx.beginPath(); ctx.arc((k * 197) % w, h * 0.3 + ((k * 131) % (h * 0.45)), 3 + (k % 5), 0, Math.PI * 2); ctx.stroke(); }
  });
  camada(cena, 'corrida_3', (ctx, w, h) => {
    ctx.fillStyle = '#081418';
    for (let k = 0; k < 9; k++) { const x = k * (w / 8); ctx.beginPath(); ctx.ellipse(x, h + 20, 60, 120 + (k % 3) * 40, 0.2 * ((k % 3) - 1), 0, Math.PI * 2); ctx.fill(); }
    for (let k = 0; k < 10; k++) {
      const g = ctx.createRadialGradient((k * 151) % w, h - 60 - (k % 4) * 40, 0, (k * 151) % w, h - 60 - (k % 4) * 40, 16);
      g.addColorStop(0, 'rgba(255,220,120,.9)'); g.addColorStop(1, 'rgba(255,220,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
  });

  camada(cena, 'brejo_1', (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2b3d55'); g.addColorStop(0.45, '#b0655a'); g.addColorStop(0.75, '#3f5a4a'); g.addColorStop(1, '#22352e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    arvores(ctx, w, h, 'rgba(30,50,48,.7)', h * 0.72, 300, 6, 7);
  });
  camada(cena, 'brejo_2', (ctx, w, h) => arvores(ctx, w, h, '#1f3a30', h * 0.8, 360, 4, 11));
  camada(cena, 'brejo_3', (ctx, w, h) => {
    ctx.fillStyle = '#10201a';
    for (let k = 0; k < 30; k++) { const x = (k * 97) % w; ctx.beginPath(); ctx.moveTo(x, h); ctx.quadraticCurveTo(x + 10, h - 80, x + 20 + (k % 3) * 8, h - 120 - (k % 4) * 30); ctx.lineTo(x + 14, h); ctx.fill(); }
  });

  camada(cena, 'rio_1', (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0b1830'); g.addColorStop(0.6, '#1a3350'); g.addColorStop(1, '#10243a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f3ecc8'; ctx.beginPath(); ctx.arc(w * 0.7, h * 0.18, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    for (let k = 0; k < 60; k++) ctx.fillRect((k * 211) % w, (k * 97) % (h * 0.45), 2, 2);
  });
  camada(cena, 'rio_2', (ctx, w, h) => arvores(ctx, w, h, '#0e2230', h * 0.55, 200, 7, 5));
  camada(cena, 'rio_3', (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
    g.addColorStop(0, '#1c3a55'); g.addColorStop(1, '#0a1624');
    ctx.fillStyle = g; ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.fillStyle = 'rgba(243,236,200,.18)';
    for (let k = 0; k < 14; k++) ctx.fillRect(w * 0.7 - 60 + (k % 3) * 20, h * 0.58 + k * 18, 120 - k * 6, 3);
  });
}

export function gerarAmigoProvisorio(cena, chave, indice) {
  folha(cena, chave, 2, (ctx, i, w, h) => silhuetaAmigo(ctx, i, w, h, indice), 128, 256);
}
