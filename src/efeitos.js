import Phaser from 'phaser';

export const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const toqueNaTela = () => window.matchMedia('(pointer: coarse)').matches;

// Textura de brilho (luz, não arte): base dos vagalumes e dos clarões.
export function texturaBrilho(cena) {
  if (cena.textures.exists('brilho')) return 'brilho';
  const t = cena.textures.createCanvas('brilho', 64, 64);
  const ctx = t.getContext();
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,250,215,1)');
  g.addColorStop(0.25, 'rgba(255,225,120,.85)');
  g.addColorStop(1, 'rgba(255,210,90,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  t.refresh();
  return 'brilho';
}

// Vagalumes soltos pela tela, presos à câmera.
export function vagalumesAmbiente(cena, n = 20, { fixo = true, area = null } = {}) {
  const chave = texturaBrilho(cena);
  const a = area || { x: 0, y: 0, w: 1280, h: 720 };
  const grupo = [];
  for (let i = 0; i < n; i++) {
    const v = cena.add.image(a.x + Math.random() * a.w, a.y + Math.random() * a.h, chave)
      .setScale(0.25 + Math.random() * 0.35)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.2 + Math.random() * 0.6);
    if (fixo) v.setScrollFactor(0);
    cena.tweens.add({
      targets: v,
      x: v.x + Phaser.Math.Between(-80, 80),
      y: v.y + Phaser.Math.Between(-60, 60),
      alpha: { from: v.alpha, to: 0.1 },
      duration: Phaser.Math.Between(2500, 5000),
      yoyo: true, repeat: -1, ease: 'Sine.inOut',
      delay: Math.random() * 2000,
    });
    grupo.push(v);
  }
  return grupo;
}

// Clarão branco/dourado em tela cheia.
export function clarao(cena, { cor = 0xfff4d0, dur = 900 } = {}) {
  if (movimentoReduzido()) { cena.cameras.main.fadeIn(dur, 255, 244, 208); return; }
  const r = (cor >> 16) & 255, g = (cor >> 8) & 255, b = cor & 255;
  cena.cameras.main.flash(dur, r, g, b);
}

export function tremer(cena, dur = 180, forca = 0.006) {
  if (movimentoReduzido()) return;
  cena.cameras.main.shake(dur, forca);
}

// Estouro de partículas de luz num ponto do mundo.
export function estouro(cena, x, y, { n = 14, raio = 90, escala = 0.5, dur = 700 } = {}) {
  const chave = texturaBrilho(cena);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + Math.random() * 0.4;
    const p = cena.add.image(x, y, chave).setBlendMode(Phaser.BlendModes.ADD).setScale(escala).setDepth(50);
    cena.tweens.add({
      targets: p,
      x: x + Math.cos(ang) * raio * (0.6 + Math.random() * 0.6),
      y: y + Math.sin(ang) * raio * (0.6 + Math.random() * 0.6),
      scale: 0, alpha: 0, duration: dur, ease: 'Expo.out',
      onComplete: () => p.destroy(),
    });
  }
}

// Fundo em camadas com parallax. Cada textura é esticada pra altura da tela e repete na horizontal.
// fatores: quanto cada camada anda em relação à câmera (0 = parada, 1 = junto com o mundo).
export function parallax(cena, chaves, fatores, { tint = null } = {}) {
  const camadas = chaves.map((chave, i) => {
    const src = cena.textures.get(chave).getSourceImage();
    const ts = cena.add.tileSprite(0, 0, 1280, 720, chave).setOrigin(0).setScrollFactor(0).setDepth(-100 + i);
    const escala = 720 / src.height;
    ts.setTileScale(escala, escala);
    if (tint !== null) ts.setTint(tint);
    ts.fator = fatores[i];
    ts.escala = escala;
    return ts;
  });
  return {
    camadas,
    // deslocamento extra (usado na corrida, onde o "mundo" anda sem câmera)
    atualizar(scrollX, extra = 0) {
      for (const c of camadas) c.tilePositionX = (scrollX * c.fator + extra * c.fator) / c.escala;
    },
  };
}
