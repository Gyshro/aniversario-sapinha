import Phaser from 'phaser';
import { CORRIDA } from '../conteudo.js';
import { som } from '../som.js';
import { legenda, limparLegenda, esperarToque, espera, esconderTudo, mostrar, hudPosicao } from '../ui.js';
import { escalaPara, QUADRO } from '../catalogo.js';
import { parallax, clarao, tremer, estouro, vagalumesAmbiente, toqueNaTela, texturaBrilho } from '../efeitos.js';

// A corrida não tem câmera andando: tudo é posicionado pela DISTÂNCIA percorrida.
// x na tela = X_HEROI + (distância do objeto − distância da heroína).
const X_HEROI = 330;
const TOPO = 150;
const BASE = 610;
const VELOCIDADE = 430;          // px/s de mundo
const TOTAL = VELOCIDADE * 68;   // ~68 s sem impulso nem batida
const N_RIVAIS = 11;

export class Corrida extends Phaser.Scene {
  constructor() { super('Corrida'); }

  create() {
    esconderTudo();
    this.cameras.main.fadeIn(900, 0, 0, 0);

    this.fundo = parallax(this, ['corrida_1', 'corrida_2', 'corrida_3'], [0.15, 0.45, 1.3]);
    this.fundo.camadas[2].setDepth(40); // a camada da frente passa POR CIMA dos nadadores
    vagalumesAmbiente(this, 14);

    this.anims.create({ key: 'nadar', frames: this.anims.generateFrameNumbers('esperminha', { frames: QUADRO.esperminha.nadar }), frameRate: 10, repeat: -1 });
    for (let i = 0; i < 4; i++) {
      this.anims.create({ key: `rival${i}`, frames: this.anims.generateFrameNumbers('rivais', { frames: [i, i + 4] }), frameRate: 6, repeat: -1 });
    }

    this.dist = 0;
    this.alvoY = 380;
    this.impulsoAte = 0;
    this.lentaAte = 0;
    this.terminou = false;
    this.correndo = false;

    this.heroi = this.add.sprite(X_HEROI, this.alvoY, 'esperminha', 7).setScale(escalaPara(this, 'esperminha')).setDepth(20);
    this.rastro = this.add.particles(0, 0, texturaBrilho(this), {
      follow: this.heroi, followOffset: { x: -34, y: 4 },
      speedX: { min: -220, max: -120 }, speedY: { min: -20, max: 20 },
      scale: { start: 0.35, end: 0 }, alpha: { start: 0.6, end: 0 },
      lifespan: 500, frequency: 40, blendMode: 'ADD', emitting: false,
    }).setDepth(19);

    // rivais começam na frente: ela larga em último
    this.rivais = [];
    for (let i = 0; i < N_RIVAIS; i++) {
      const s = this.add.sprite(0, 0, 'rivais', i % 4).setScale(escalaPara(this, 'rivais')).setDepth(10 + (i % 5));
      s.play({ key: `rival${i % 4}`, startFrame: i % 2 });
      this.rivais.push({
        s,
        d: 140 + i * 170 + Math.random() * 60,
        vel: 0.9 + Math.random() * 0.12,
        faixa: Phaser.Math.Between(TOPO + 20, BASE - 20),
        fase: Math.random() * 10,
      });
    }

    this.obstaculos = [];
    this.proximoObstaculo = 700;

    this.orbe = this.add.image(0, 380, 'itens', QUADRO.itens.orbe).setScale(escalaPara(this, 'itens', 380)).setDepth(5).setVisible(false);

    this.prepararEntrada();
    mostrar('posicao');
    hudPosicao(0, N_RIVAIS + 1);
    this.largada();
  }

  prepararEntrada() {
    this.teclas = this.input.keyboard.addKeys('UP,DOWN,W,S');
    this.arrastando = null;
    this.input.on('pointerdown', (p) => { this.arrastando = p.y; });
    this.input.on('pointermove', (p) => {
      if (this.arrastando === null || !p.isDown) return;
      // arrasto relativo: o dedo não precisa cobrir a personagem
      this.alvoY += (p.y - this.arrastando) * 1.35;
      this.arrastando = p.y;
    });
    this.input.on('pointerup', () => { this.arrastando = null; });
  }

  async largada() {
    legenda(toqueNaTela() ? 'Arraste o dedo pra cima e pra baixo' : 'Use ↑ e ↓');
    await espera(2200);
    for (const n of ['3', '2', '1']) { legenda(`<span style="font-style:normal;font-size:1.6em">${n}</span>`); som.pingo(); await espera(700); }
    legenda('<span style="font-style:normal;font-size:1.6em">Já!</span>');
    som.impulso();
    this.correndo = true;
    this.heroi.play('nadar');
    this.rastro.emitting = true;
    await espera(700);
    limparLegenda();
  }

  update(_t, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    const agora = this.time.now;

    // --- controle vertical ---
    if (!this.terminou) {
      const k = this.teclas;
      if (k.UP.isDown || k.W.isDown) this.alvoY -= 520 * dt;
      if (k.DOWN.isDown || k.S.isDown) this.alvoY += 520 * dt;
      this.alvoY = Phaser.Math.Clamp(this.alvoY, TOPO, BASE);
      this.heroi.y = Phaser.Math.Linear(this.heroi.y, this.alvoY, 1 - Math.pow(0.0005, dt));
      this.heroi.rotation = Phaser.Math.Clamp((this.alvoY - this.heroi.y) / 400, -0.35, 0.35);
    }

    // --- velocidade ---
    let mult = 1;
    if (agora < this.impulsoAte) mult = 1.65;
    if (agora < this.lentaAte) mult = 0.45;
    const v = this.correndo ? VELOCIDADE * mult : (this.terminou ? VELOCIDADE * 0.6 : 0);
    this.dist += v * dt;
    this.fundo.atualizar(0, this.dist);

    // --- rivais (ajustados por baixo: ela sempre alcança, mas parece apertado) ---
    const prog = this.dist / TOTAL;
    let naFrente = 0;
    for (const r of this.rivais) {
      const diff = r.d - this.dist;
      let fator = r.vel;
      if (diff < -500) fator = 1.08;           // quem ficou muito pra trás volta pro pelotão
      if (prog > 0.55) fator *= 0.94;
      if (prog > 0.85) fator *= 0.85;
      if (prog > 0.95 && diff > 0) fator = 0.5; // reta final: ninguém segura a coroa
      if (this.correndo || this.terminou) r.d += VELOCIDADE * fator * dt;
      if (r.d > this.dist) naFrente++;
      r.fase += dt * 2;
      const x = X_HEROI + (r.d - this.dist);
      r.s.setPosition(x, r.faixa + Math.sin(r.fase) * 26).setVisible(x > -80 && x < 1400);
    }

    if (this.correndo) {
      const posicao = naFrente + 1;
      if (posicao < (this.ultimaPosicao ?? 99)) som.ultrapassou();
      this.ultimaPosicao = posicao;
      hudPosicao(prog, posicao);
      this.gerarObstaculos();
    }
    this.moverObstaculos(dt);

    // --- orbe dourado na reta final ---
    if (prog > 0.9) {
      const x = X_HEROI + (TOTAL + 520 - this.dist);
      this.orbe.setVisible(true).setPosition(x, 380);
      this.orbe.rotation += dt * 0.3;
    }
    if (this.correndo && this.dist >= TOTAL) this.chegada();
  }

  gerarObstaculos() {
    if (this.dist < this.proximoObstaculo || this.dist > TOTAL - 1600) return;
    const anel = Math.random() < 0.34;
    const y = Phaser.Math.Between(TOPO + 10, BASE - 10);
    const s = this.add.image(0, y, 'itens', anel ? QUADRO.itens.estrela : QUADRO.itens.bolha)
      .setScale(escalaPara(this, 'itens', anel ? 110 : 70)).setDepth(15);
    if (anel) s.setBlendMode(Phaser.BlendModes.ADD);
    this.obstaculos.push({ s, d: this.dist + 1150, y0: y, tipo: anel ? 'anel' : 'bolha', onda: Math.random() < 0.4 ? Phaser.Math.Between(40, 110) : 0, fase: Math.random() * 6 });
    // fica mais cheio com o tempo, mas sem virar parede
    const ritmo = Phaser.Math.Linear(560, 330, Math.min(1, this.dist / TOTAL));
    this.proximoObstaculo = this.dist + ritmo * (0.7 + Math.random() * 0.6);
  }

  moverObstaculos(dt) {
    for (const o of this.obstaculos) {
      if (o.usado) continue;
      o.fase += dt * 1.8;
      o.s.x = X_HEROI + (o.d - this.dist);
      o.s.y = o.y0 + Math.sin(o.fase) * o.onda;
      if (o.tipo === 'bolha') o.s.rotation -= dt * 1.5;
      if (o.s.x < -100) { o.usado = true; o.s.destroy(); continue; }
      if (!this.correndo) continue;
      const perto = Math.abs(o.s.x - this.heroi.x) < (o.tipo === 'anel' ? 42 : 40) && Math.abs(o.s.y - this.heroi.y) < (o.tipo === 'anel' ? 62 : 38);
      if (!perto) continue;
      o.usado = true;
      if (o.tipo === 'anel') {
        this.impulsoAte = this.time.now + 1700;
        this.lentaAte = 0;
        som.impulso();
        estouro(this, o.s.x, o.s.y, { n: 10, raio: 70 });
        this.heroi.setFrame(QUADRO.esperminha.impulso);
        this.heroi.anims.pause();
        this.time.delayedCall(450, () => this.correndo && this.heroi.anims.resume());
        o.s.destroy();
      } else if (this.time.now > this.imuneAte || !this.imuneAte) {
        this.lentaAte = this.time.now + 850;
        this.imuneAte = this.time.now + 1300;
        som.batida();
        tremer(this, 160, 0.008);
        this.heroi.anims.pause();
        this.heroi.setFrame(QUADRO.esperminha.tonta);
        this.tweens.add({ targets: this.heroi, alpha: 0.4, duration: 110, yoyo: true, repeat: 4, onComplete: () => this.heroi.setAlpha(1) });
        this.time.delayedCall(850, () => this.correndo && this.heroi.anims.resume());
        this.tweens.add({ targets: o.s, scale: 0, alpha: 0, duration: 300, onComplete: () => o.s.destroy() });
      }
    }
  }

  async chegada() {
    this.correndo = false;
    this.terminou = true;
    this.rastro.emitting = false;
    hudPosicao(1, 1);
    this.input.removeAllListeners();

    // câmera lenta enquanto ela entra no orbe
    this.tweens.timeScale = 0.35;
    this.heroi.anims.stop();
    this.heroi.setFrame(QUADRO.esperminha.vitoria);
    this.tweens.add({ targets: this.heroi, x: this.orbe.x, y: 380, rotation: 0, duration: 1800, ease: 'Sine.inOut' });
    await espera(1600 / 0.6);
    this.tweens.timeScale = 1;

    som.clarao();
    clarao(this, { dur: 1400 });
    mostrar('posicao', false);
    this.heroi.setVisible(false);
    estouro(this, this.orbe.x, 380, { n: 30, raio: 260, escala: 0.8, dur: 1400 });
    legenda(CORRIDA.vitoria);
    await esperarToque();

    // *puf*: vira sapinha
    limparLegenda();
    this.orbe.setVisible(false);
    this.rivais.forEach((r) => r.s.setVisible(false));
    const cx = 640, cy = 400;
    som.puf();
    const fumaca = this.add.image(cx, cy, texturaBrilho(this)).setScale(0).setTint(0xcfe8d0).setDepth(30);
    this.tweens.add({ targets: fumaca, scale: 6, alpha: 0, duration: 900, ease: 'Expo.out' });
    const sapo = this.add.sprite(cx, cy, 'sapinha', 6).setScale(0).setDepth(31);
    this.tweens.add({ targets: sapo, scale: escalaPara(this, 'sapinha', 170), duration: 600, ease: 'Back.out' });
    await espera(1500);
    legenda(`<span style="position:relative;top:-22vh">${CORRIDA.complicacao}</span>`);
    await esperarToque();
    limparLegenda();
    this.cameras.main.fadeOut(900, 0, 0, 0);
    await espera(950);
    this.scene.start('Brejo');
  }
}
