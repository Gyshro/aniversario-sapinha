import Phaser from 'phaser';
import { LEMBRANCAS, AMIGOS, FINAL, EASTER_EGG } from '../conteudo.js';
import { jornada } from '../jornada.js';
import { som, tocarMusica } from '../som.js';
import { legenda, limparLegenda, espera, esconderTudo, polaroid, fala, telaFinal, easterEgg } from '../ui.js';
import { escalaPara, QUADRO } from '../catalogo.js';
import { parallax, clarao, estouro, texturaBrilho, toqueNaTela, vagalumesAmbiente, movimentoReduzido } from '../efeitos.js';

const PASSO = 390;          // distância entre vitórias-régias
const Y_FOLHA = 585;
const INICIO = 220;
const MAX_ENXAME = 90;

export class Rio extends Phaser.Scene {
  constructor() { super('Rio'); }

  create() {
    esconderTudo();
    this.cameras.main.fadeIn(1600, 0, 0, 0);
    tocarMusica(this, 'musica_rio', { volume: 0.5, fade: 2500 });

    // folhas: início, uma por lembrança, e a última (onde tudo acontece)
    this.folhas = [{ x: INICIO, lembranca: null }];
    LEMBRANCAS.forEach((l, i) => this.folhas.push({ x: INICIO + PASSO * (i + 1), lembranca: l }));
    this.ultimaX = INICIO + PASSO * (LEMBRANCAS.length + 1);
    this.folhas.push({ x: this.ultimaX, lembranca: null, ultima: true });
    this.margemX = this.ultimaX + 330;
    this.larguraMundo = this.margemX + AMIGOS.length * 230 + 500;

    this.cameras.main.setBounds(0, 0, this.larguraMundo, 720);
    this.fundo = parallax(this, ['rio_1', 'rio_2', 'rio_3'], [0.05, 0.25, 0.6]);
    vagalumesAmbiente(this, 18, { fixo: true, area: { x: 0, y: 60, w: 1280, h: 380 } });

    this.montarFolhas();
    this.montarMargem();
    this.montarHeroina();
    this.montarEnxame();

    this.indice = 0;
    this.pulando = false;
    this.livre = false;
    this.input.on('pointerdown', () => this.pedirPulo());
    this.input.keyboard.on('keydown', (e) => { if (['Space', 'ArrowRight', 'Enter', 'KeyD'].includes(e.code)) this.pedirPulo(); });
    this.abertura();
  }

  async abertura() {
    await espera(1400);
    legenda(toqueNaTela() ? 'Toque pra pular' : 'Espaço ou clique pra pular');
    this.livre = true;
    await espera(2600);
    limparLegenda();
  }

  // ---------- Cenário ----------
  montarFolhas() {
    const variantes = QUADRO.vitorias_regias.folhas;
    this.folhas.forEach((f, i) => {
      const alt = f.ultima ? 120 : 90;
      f.img = this.add.image(f.x, Y_FOLHA, 'vitorias_regias', variantes[i % variantes.length]).setOrigin(0.5, 0.6).setDepth(10);
      f.img.setScale(escalaPara(this, 'vitorias_regias', alt));
      if (f.ultima) f.img.setScale(f.img.scale * 1.25);
      this.tweens.add({ targets: f.img, y: Y_FOLHA + 3, duration: 1800 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      if (f.lembranca) {
        const brilho = this.add.image(f.x, Y_FOLHA - 95, texturaBrilho(this)).setBlendMode(Phaser.BlendModes.ADD).setScale(2.2).setAlpha(0.35).setDepth(11);
        const moldura = this.add.image(f.x, Y_FOLHA - 95, 'itens', QUADRO.itens.polaroid).setDepth(12);
        moldura.setScale(escalaPara(this, 'itens', 64));
        this.tweens.add({ targets: [moldura, brilho], y: Y_FOLHA - 110, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.tweens.add({ targets: brilho, alpha: 0.6, duration: 1100, yoyo: true, repeat: -1 });
        f.moldura = moldura;
        f.brilho = brilho;
      }
    });
    // flores e folhinhas soltas, só enfeite
    for (let x = 80; x < this.ultimaX + 200; x += 140 + Math.random() * 120) {
      const perto = Math.random() < 0.5;
      const q = Math.random() < 0.45 ? Phaser.Utils.Array.GetRandom(QUADRO.vitorias_regias.flores) : Phaser.Utils.Array.GetRandom(variantes);
      const y = perto ? Phaser.Math.Between(650, 700) : Phaser.Math.Between(470, 520);
      const img = this.add.image(x, y, 'vitorias_regias', q).setDepth(perto ? 30 : 5);
      img.setScale(escalaPara(this, 'vitorias_regias', perto ? 70 : 34));
      if (!perto) img.setAlpha(0.8).setTint(0xaab8cc);
    }
  }

  montarMargem() {
    const de = this.ultimaX + 160;
    const w = this.larguraMundo - de;
    const q = this.textures.getFrame('plataformas', QUADRO.plataformas.chao);
    const chao = this.add.tileSprite(de, 520, w, 220, 'plataformas', QUADRO.plataformas.chao).setOrigin(0).setDepth(8).setTint(0x6a7a8a);
    chao.setTileScale(220 / q.height, 220 / q.height);
    for (let i = 0; i < 6; i++) {
      const j = this.add.image(de + 40 + i * (w / 6), 540, 'vitorias_regias', QUADRO.vitorias_regias.juncos).setOrigin(0.5, 1).setDepth(9).setTint(0x7a8a9a);
      j.setScale(escalaPara(this, 'vitorias_regias', 150));
    }

    this.amigos = AMIGOS.map((a, i) => {
      const x = this.margemX + 120 + i * 230;
      const s = this.add.sprite(x, 545, a.sprite, 0).setOrigin(0.5, 1).setDepth(12 + (i % 2));
      s.setScale(escalaPara(this, a.sprite, 250 + (i % 2) * 14));
      s.setTint(0x2c3444);
      const luz = this.add.image(x, 430, texturaBrilho(this)).setBlendMode(Phaser.BlendModes.ADD).setScale(7).setAlpha(0).setDepth(11);
      return { ...a, s, luz, x };
    });
  }

  montarHeroina() {
    this.heroi = this.add.sprite(INICIO, Y_FOLHA - 30, 'sapinha', QUADRO.sapinha.parada).setOrigin(0.5, 0.85).setDepth(20);
    this.heroi.setScale(escalaPara(this, 'sapinha', 80));
    this.cameras.main.startFollow(this.heroi, true, 0.06, 0.06, 0, 120);
    this.cameras.main.setFollowOffset(-200, 0);
  }

  // ---------- Enxame de vagalumes (o que ela coletou no brejo) ----------
  montarEnxame() {
    this.enxame = [];
    this.modoEnxame = 'seguir';
    const n = Phaser.Math.Clamp(jornada.vagalumes, 6, 45);
    for (let i = 0; i < n; i++) this.addVagalume(this.heroi.x + Phaser.Math.Between(-200, 200), Phaser.Math.Between(300, 600));
  }

  addVagalume(x, y) {
    if (this.enxame.length >= MAX_ENXAME) return;
    const v = this.add.image(x, y, texturaBrilho(this)).setBlendMode(Phaser.BlendModes.ADD).setScale(0.28 + Math.random() * 0.2).setDepth(25);
    v.ang = Math.random() * Math.PI * 2;
    v.raio = 60 + Math.random() * 110;
    v.vel = 0.3 + Math.random() * 0.6;
    v.pisca = Math.random() * 10;
    this.enxame.push(v);
  }

  pontosCoroa(cx, cy, n) {
    // contorno de coroa: base + 3 pontas
    const perfil = [[-1, 0.5], [-1, -0.5], [-0.5, 0.05], [0, -0.75], [0.5, 0.05], [1, -0.5], [1, 0.5]];
    const segs = [];
    for (let i = 0; i < perfil.length; i++) segs.push([perfil[i], perfil[(i + 1) % perfil.length]]);
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * segs.length;
      const [a, b] = segs[Math.floor(t)];
      const f = t % 1;
      return { x: cx + Phaser.Math.Linear(a[0], b[0], f) * 70, y: cy + Phaser.Math.Linear(a[1], b[1], f) * 60 };
    });
  }

  update(t, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    this.fundo.atualizar(this.cameras.main.scrollX);
    const h = this.heroi;
    const coroa = this.modoEnxame === 'coroa' ? this.pontosCoroa(h.x, h.y - h.displayHeight - 60, this.enxame.length) : null;
    this.enxame.forEach((v, i) => {
      v.ang += v.vel * dt;
      v.pisca += dt * 3;
      let tx, ty, k;
      if (coroa) { tx = coroa[i].x; ty = coroa[i].y; k = 0.08; }
      else if (this.modoEnxame === 'fechar') { tx = h.x + Math.cos(v.ang * 6) * 30; ty = h.y - 40 + Math.sin(v.ang * 6) * 30; k = 0.1; }
      else { tx = h.x + Math.cos(v.ang) * v.raio; ty = h.y - 60 + Math.sin(v.ang * 1.3) * v.raio * 0.55; k = 0.025; }
      v.x += (tx - v.x) * k;
      v.y += (ty - v.y) * k;
      v.setAlpha(0.55 + Math.sin(v.pisca) * 0.35);
    });
  }

  // ---------- Pulo de folha em folha ----------
  pedirPulo() {
    if (!this.livre || this.pulando || this.indice >= this.folhas.length - 1) return;
    this.pular();
  }

  async pular() {
    this.pulando = true;
    limparLegenda();
    const h = this.heroi;
    const de = { x: h.x, y: h.y };
    this.indice++;
    const folha = this.folhas[this.indice];
    const para = { x: folha.x, y: Y_FOLHA - 30 };

    h.setFrame(QUADRO.sapinha.agachada);
    await espera(110);
    h.setFrame(QUADRO.sapinha.noAr);
    som.pulo();
    const arco = { t: 0 };
    await new Promise((resolve) => this.tweens.add({
      targets: arco, t: 1, duration: 620, ease: 'Sine.inOut',
      onUpdate: () => {
        h.x = Phaser.Math.Linear(de.x, para.x, arco.t);
        h.y = Phaser.Math.Linear(de.y, para.y, arco.t) - Math.sin(arco.t * Math.PI) * 150;
      },
      onComplete: resolve,
    }));
    h.setFrame(QUADRO.sapinha.pouso);
    som.pingo();
    this.onda(folha.x);
    this.tweens.add({ targets: folha.img, y: folha.img.y + 8, duration: 140, yoyo: true, ease: 'Quad.out' });
    await espera(160);
    h.setFrame(QUADRO.sapinha.parada);

    if (folha.lembranca) await this.abrirLembranca(folha);
    if (folha.ultima) return this.revelarAmigos();
    this.pulando = false;
  }

  onda(x) {
    const g = this.add.ellipse(x, Y_FOLHA + 12, 60, 14).setStrokeStyle(2, 0xcfe4f0, 0.7).setDepth(9);
    this.tweens.add({ targets: g, scaleX: 4, scaleY: 3, alpha: 0, duration: 1100, ease: 'Expo.out', onComplete: () => g.destroy() });
  }

  async abrirLembranca(folha) {
    this.livre = false;
    som.sino();
    this.tweens.add({ targets: [folha.moldura, folha.brilho], alpha: 0, scale: 0, duration: 400 });
    await espera(300);
    await polaroid(folha.lembranca);
    // cada lembrança vira luz que se junta ao enxame
    for (let i = 0; i < 3; i++) this.addVagalume(folha.x + Phaser.Math.Between(-30, 30), Y_FOLHA - 110);
    estouro(this, folha.x, Y_FOLHA - 110, { n: 8, raio: 60, escala: 0.35 });
    som.vagalume();
    this.livre = true;
  }

  // ---------- Os amigos ----------
  async revelarAmigos() {
    this.livre = false;
    const cam = this.cameras.main;
    this.heroi.setFrame(QUADRO.sapinha.parada);
    await espera(600);

    cam.stopFollow();
    const reduzido = movimentoReduzido();
    // zoom lento na sapinha…
    cam.pan(this.heroi.x, this.heroi.y - 80, reduzido ? 1 : 2200, 'Sine.easeInOut');
    cam.zoomTo(1.45, reduzido ? 1 : 2600, 'Sine.easeInOut');
    await espera(reduzido ? 400 : 3200);
    // …e o travelling pra direita, revelando a margem
    cam.setBounds(0, -200, this.larguraMundo, 1120);
    const centroAmigos = (this.amigos[0].x + this.amigos[this.amigos.length - 1].x) / 2;
    cam.zoomTo(1.05, reduzido ? 1 : 4200, 'Sine.easeInOut');
    cam.pan(centroAmigos, 420, reduzido ? 1 : 4800, 'Sine.easeInOut');
    await espera(reduzido ? 400 : 5000);

    await this.mensagens();
    this.transformar();
  }

  async mensagens() {
    const cam = this.cameras.main;
    for (let i = 0; i < this.amigos.length; i++) {
      const a = this.amigos[i];
      cam.pan(a.x + 90, 440, 1400, 'Sine.easeInOut');
      cam.zoomTo(1.3, 1400, 'Sine.easeInOut');
      this.acender(a, true);
      a.s.setFrame(1);
      this.time.delayedCall(900, () => a.s.setFrame(0));
      const audio = a.audio && this.cache.audio.exists(a.audio) ? this.sound.add(a.audio) : null;
      await espera(900);
      audio?.play();
      await fala({ nome: a.nome, texto: a.texto, indice: i, total: this.amigos.length });
      audio?.stop();
      // a mensagem vira luz que voa até ela
      for (let k = 0; k < 6; k++) this.addVagalume(a.x + Phaser.Math.Between(-40, 40), 330 + Phaser.Math.Between(-40, 40));
      som.vagalume();
      this.acender(a, false);
    }
  }

  acender(a, ligar) {
    const de = ligar ? 0x2c3444 : 0xffffff;
    const para = ligar ? 0xffffff : 0x9aa6b8;
    const c0 = Phaser.Display.Color.IntegerToColor(de);
    const c1 = Phaser.Display.Color.IntegerToColor(para);
    this.tweens.addCounter({
      from: 0, to: 100, duration: 700,
      onUpdate: (tw) => {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(c0, c1, 100, tw.getValue());
        a.s.setTint(Phaser.Display.Color.GetColor(c.r, c.g, c.b));
      },
    });
    this.tweens.add({ targets: a.luz, alpha: ligar ? 0.35 : 0, duration: 700 });
  }

  // ---------- A transformação ----------
  async transformar() {
    const cam = this.cameras.main;
    const h = this.heroi;
    tocarMusica(this, 'musica_final', { volume: 0.6, fade: 2000 });
    cam.pan(h.x, h.y - 110, 2600, 'Sine.easeInOut');
    cam.zoomTo(1.25, 2600, 'Sine.easeInOut');
    await espera(2400);

    this.modoEnxame = 'coroa';
    som.sino();
    await espera(3200);
    this.modoEnxame = 'fechar';
    await espera(1500);

    som.clarao();
    clarao(this, { dur: 2200 });
    h.setVisible(false);
    estouro(this, h.x, h.y - 60, { n: 40, raio: 320, escala: 0.8, dur: 1800 });
    const p = this.add.sprite(h.x, Y_FOLHA - 10, 'princesa', 0).setOrigin(0.5, 1).setDepth(20);
    p.setScale(escalaPara(this, 'princesa', 270));
    this.princesa = p;
    this.modoEnxame = 'seguir';
    this.heroi = p; // o enxame passa a orbitar a princesa
    this.amigos.forEach((a) => this.acender(a, true));
    cam.zoomTo(1, 3000, 'Sine.easeInOut');
    cam.pan(h.x + 440, 360, 3000, 'Sine.easeInOut');
    await espera(2600);
    this.mostrarFinal();
  }

  mostrarFinal() {
    telaFinal(FINAL.texto, {
      rever: async () => { await this.mensagens(); this.amigos.forEach((a) => this.acender(a, true)); this.cameras.main.pan(this.princesa.x + 440, 360, 2000, 'Sine.easeInOut'); this.cameras.main.zoomTo(1, 2000); await espera(2000); this.mostrarFinal(); },
      jogar: () => { jornada.vagalumes = 0; this.cameras.main.fadeOut(900, 0, 0, 0); this.time.delayedCall(950, () => this.scene.start('Titulo')); },
    });
    // …e pra destruir completamente o clima
    this.time.delayedCall(4200, () => this.esperminhaIntrusa());
    // e, depois de tudo, o easter egg (uma vez só)
    if (!this.ovoMostrado) {
      this.ovoMostrado = true;
      this.time.delayedCall(7800, () => easterEgg(EASTER_EGG));
    }
  }

  esperminhaIntrusa() {
    const cam = this.cameras.main;
    const y = 470;
    const x0 = cam.worldView.x - 100;
    const s = this.add.sprite(x0, y, 'esperminha', 0).setDepth(6).setScale(escalaPara(this, 'esperminha', 40));
    if (this.anims.exists('nadar')) s.play('nadar');
    som.impulso();
    this.tweens.add({
      targets: s, x: cam.worldView.right + 120, duration: 1600, ease: 'Linear',
      onUpdate: () => { s.y = y + Math.sin(s.x / 40) * 6; },
      onComplete: () => s.destroy(),
    });
  }
}
