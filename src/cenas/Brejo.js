import Phaser from 'phaser';
import { BREJO } from '../conteudo.js';
import { jornada } from '../jornada.js';
import { som, tocarMusica } from '../som.js';
import { legenda, limparLegenda, esperarToque, espera, esconderTudo, mostrar, hudCoracoes, hudVagalumes, entrada, soltarControles } from '../ui.js';
import { escalaPara, QUADRO } from '../catalogo.js';
import { parallax, tremer, estouro, texturaBrilho, toqueNaTela, vagalumesAmbiente } from '../efeitos.js';

const Y_CHAO = 600;
const LARGURA_MUNDO = 7600;
const ARENA = { de: 6250, ate: 7450 };
const VIDAS = 3;

// Mapa da fase. x em pixels do mundo; y é o TOPO da plataforma.
const MAPA = {
  chao: [[0, 900], [1060, 1800], [2050, 2900], [3150, 3900], [4300, 5000], [5200, LARGURA_MUNDO]],
  plataformas: [
    { x: 980, y: 560, tipo: 'folha' },
    { x: 1400, y: 470, tipo: 'tronco', w: 220 },
    { x: 1925, y: 555, tipo: 'folha' },
    { x: 2400, y: 480, tipo: 'galho', w: 200 },
    { x: 2660, y: 385, tipo: 'galho', w: 200 },
    { x: 3025, y: 545, tipo: 'folha' },
    { x: 3500, y: 470, tipo: 'tronco', w: 240 },
    { x: 3990, y: 560, tipo: 'folha' },
    { x: 4175, y: 520, tipo: 'folha' },
    { x: 4600, y: 460, tipo: 'galho', w: 200 },
    { x: 4860, y: 370, tipo: 'galho', w: 200 },
    { x: 5100, y: 555, tipo: 'folha' },
    { x: 5650, y: 450, tipo: 'tronco', w: 240 },
  ],
  placas: [500, 2230, 4470],
  checkpoints: [150, 2150, 4380, 6120],
  mosquitos: [[1250, 430], [2520, 300], [3320, 400], [4720, 300], [5480, 430], [5850, 360]],
  besouros: [[1500, 1100, 1780], [2700, 2100, 2880], [3650, 3200, 3880], [5450, 5220, 6000]],
  libelulas: [[3800, 290], [5050, 270]],
  vagalumes: [
    // pequenos arcos que ensinam o caminho
    ...arco(380, 470, 4, 60), ...arco(980, 470, 3, 50), ...arco(1400, 390, 4, 50),
    ...arco(1925, 470, 3, 50), ...arco(2400, 400, 3, 50), ...arco(2660, 300, 4, 50),
    ...arco(3025, 460, 3, 50), ...arco(3500, 390, 4, 50), ...arco(4080, 440, 4, 55),
    ...arco(4600, 380, 3, 50), ...arco(4860, 290, 4, 50), ...arco(5100, 470, 3, 50),
    ...arco(5650, 370, 4, 50), ...arco(5950, 520, 3, 60),
  ],
};

function arco(cx, cy, n, passo) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5;
    return [cx + t * passo * (n - 1), cy - Math.cos(t * Math.PI) * 30];
  });
}

export class Brejo extends Phaser.Scene {
  constructor() { super('Brejo'); }

  create() {
    esconderTudo();
    soltarControles();
    this.cameras.main.fadeIn(900, 0, 0, 0);
    tocarMusica(this, 'musica_brejo', { volume: 0.45 });
    this.physics.world.setBounds(0, -400, LARGURA_MUNDO, 1300);
    this.cameras.main.setBounds(0, 0, LARGURA_MUNDO, 720);

    this.fundo = parallax(this, ['brejo_1', 'brejo_2', 'brejo_3'], [0.08, 0.3, 1.15]);
    this.fundo.camadas[2].setDepth(60).setAlpha(0.9);
    vagalumesAmbiente(this, 10);

    this.vidas = VIDAS;
    this.checkpoint = MAPA.checkpoints[0];
    this.imuneAte = 0;
    this.linguaOcupada = false;
    this.ativo = false;
    this.vagalumesAntes = jornada.vagalumes;

    this.montarMapa();
    this.montarHeroina();
    this.montarInimigos();
    this.montarVagalumes();
    this.montarChefe();

    this.teclas = this.input.keyboard.addKeys('LEFT,RIGHT,A,D,UP,W,SPACE,X,J,Z');
    this.lingua = this.add.graphics().setDepth(26);

    mostrar('hud');
    hudCoracoes(this.vidas, VIDAS);
    hudVagalumes(jornada.vagalumes);
    this.abertura();
  }

  async abertura() {
    await espera(900);
    legenda(toqueNaTela()
      ? 'Setas pra andar, Pular e Língua.<small>a língua mira sozinha</small>'
      : '← → pra andar · Espaço pula · X lança a língua<small>a língua mira sozinha</small>');
    this.ativo = true;
    mostrar('controles', toqueNaTela());
    await espera(3200);
    limparLegenda();
  }

  // ---------- Mundo ----------
  montarMapa() {
    this.solidos = this.physics.add.staticGroup();
    this.passarelas = this.physics.add.staticGroup();

    // água: faixa escura no fundo, visível nos buracos
    const agua = this.add.rectangle(0, Y_CHAO + 40, LARGURA_MUNDO, 200, 0x1d3a3a).setOrigin(0).setDepth(-10);
    this.tweens.add({ targets: agua, alpha: 0.8, duration: 1800, yoyo: true, repeat: -1 });

    const altChao = 720 - Y_CHAO + 20;
    for (const [de, ate] of MAPA.chao) {
      const w = ate - de;
      const vis = this.add.tileSprite(de, Y_CHAO - 14, w, altChao + 14, 'plataformas', QUADRO.plataformas.chao).setOrigin(0).setDepth(5);
      const q = this.textures.getFrame('plataformas', QUADRO.plataformas.chao);
      const esc = (altChao + 14) / q.height;
      vis.setTileScale(esc, esc);
      const corpo = this.add.zone(de + w / 2, Y_CHAO + altChao / 2, w, altChao);
      this.solidos.add(corpo);
    }

    for (const p of MAPA.plataformas) {
      const quadro = QUADRO.plataformas[p.tipo];
      const w = p.w ?? 130;
      const img = this.add.image(p.x, p.y, 'plataformas', quadro).setOrigin(0.5, 0.25).setDepth(6);
      img.setScale(w / img.frame.width);
      const corpo = this.add.zone(p.x, p.y + 8, w * 0.9, 16);
      this.passarelas.add(corpo);
      corpo.body.checkCollision.down = false;
      corpo.body.checkCollision.left = false;
      corpo.body.checkCollision.right = false;
      if (p.tipo === 'folha') this.tweens.add({ targets: img, y: p.y + 4, duration: 1400 + Math.random() * 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    this.placas = MAPA.placas.map((x, i) => {
      const img = this.add.image(x, Y_CHAO + 4, 'plataformas', QUADRO.plataformas.placa).setOrigin(0.5, 1).setDepth(4);
      img.setScale(escalaPara(this, 'plataformas', 110));
      const texto = this.add.text(x, Y_CHAO - 150, BREJO.placas[i] ?? '', {
        fontFamily: 'Nunito', fontStyle: '800', fontSize: '24px', color: '#f6f0dc',
        backgroundColor: '#10222bee', padding: { x: 16, y: 10 }, align: 'center',
        wordWrap: { width: 380 },
      }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
      return { x, texto, visivel: false };
    });

    this.bandeiras = MAPA.checkpoints.slice(1).map((x) => {
      const b = this.add.image(x, Y_CHAO + 4, 'plataformas', QUADRO.plataformas.bandeira).setOrigin(0.5, 1).setDepth(4).setAlpha(0.55);
      b.setScale(escalaPara(this, 'plataformas', 120));
      return { x, b, pego: false };
    });
  }

  montarHeroina() {
    const h = this.physics.add.sprite(this.checkpoint, Y_CHAO - 60, 'sapinha', 0).setDepth(25);
    h.setScale(escalaPara(this, 'sapinha'));
    const f = h.frame;
    h.body.setSize(f.width * 0.5, f.height * 0.62).setOffset(f.width * 0.25, f.height * 0.34);
    h.setCollideWorldBounds(true);
    h.body.setMaxVelocity(420, 1400);
    this.heroi = h;
    this.virado = 1;
    this.noChaoAte = 0;   // "tempo de coiote": pular logo depois de sair da beirada
    this.puloPedidoAte = 0;
    this.physics.add.collider(h, this.solidos);
    this.physics.add.collider(h, this.passarelas);
    this.cameras.main.startFollow(h, true, 0.12, 0.12);
    this.cameras.main.setFollowOffset(-160, 0);
    this.cameras.main.setDeadzone(60, 720);

    this.paredeArena = this.add.zone(ARENA.de - 20, 300, 40, 900);
    this.physics.add.existing(this.paredeArena, true);
    this.paredeArena.body.enable = false;
    this.physics.add.collider(h, this.paredeArena);
  }

  montarInimigos() {
    this.anims.exists('mosquito') || this.anims.create({ key: 'mosquito', frames: this.anims.generateFrameNumbers('inimigos', { frames: QUADRO.inimigos.mosquito }), frameRate: 14, repeat: -1 });
    this.anims.exists('besouro') || this.anims.create({ key: 'besouro', frames: this.anims.generateFrameNumbers('inimigos', { frames: QUADRO.inimigos.besouro }), frameRate: 6, repeat: -1 });
    this.anims.exists('libelula') || this.anims.create({ key: 'libelula', frames: this.anims.generateFrameNumbers('inimigos', { frames: QUADRO.inimigos.libelula }), frameRate: 16, repeat: -1 });

    this.inimigos = this.physics.add.group({ allowGravity: false, immovable: true });
    const criar = (x, y, tipo, extra) => {
      const s = this.inimigos.create(x, y, 'inimigos', 0).setDepth(20);
      s.setScale(escalaPara(this, 'inimigos', tipo === 'libelula' ? 58 : 50));
      s.play({ key: tipo, startFrame: Math.random() < 0.5 ? 0 : 1 });
      s.body.setSize(s.frame.width * 0.6, s.frame.height * 0.5);
      Object.assign(s, { tipo, x0: x, y0: y, fase: Math.random() * 6 }, extra);
      return s;
    };
    for (const [x, y] of MAPA.mosquitos) criar(x, y, 'mosquito');
    for (const [x, de, ate] of MAPA.besouros) criar(x, Y_CHAO - 22, 'besouro', { de, ate, dir: -1 });
    for (const [x, y] of MAPA.libelulas) criar(x, y, 'libelula');

    this.physics.add.overlap(this.heroi, this.inimigos, (_h, e) => this.machucar(e.x));
  }

  montarVagalumes() {
    this.anims.exists('vagalume') || this.anims.create({ key: 'vagalume', frames: this.anims.generateFrameNumbers('itens', { frames: QUADRO.itens.vagalume }), frameRate: 6, repeat: -1, yoyo: true });
    const brilho = texturaBrilho(this);
    this.vagalumes = MAPA.vagalumes.map(([x, y]) => {
      const aura = this.add.image(x, y, brilho).setBlendMode(Phaser.BlendModes.ADD).setScale(0.9).setAlpha(0.55).setDepth(18);
      const s = this.add.sprite(x, y, 'itens', 0).setDepth(19);
      s.setScale(escalaPara(this, 'itens', 34));
      s.play({ key: 'vagalume', startFrame: Phaser.Math.Between(0, 2) });
      this.tweens.add({ targets: [s, aura], y: y - 8, duration: 900 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      return { s, aura, pego: false };
    });
  }

  montarChefe() {
    const c = this.physics.add.sprite(7100, Y_CHAO - 120, 'inimigos', QUADRO.inimigos.chefe).setDepth(22);
    c.setScale(escalaPara(this, 'inimigos', 170));
    c.body.setSize(c.frame.width * 0.7, c.frame.height * 0.7).setOffset(c.frame.width * 0.15, c.frame.height * 0.28);
    c.vida = 3;
    c.imuneAte = 0;
    c.acordado = false;
    this.physics.add.collider(c, this.solidos);
    this.physics.add.overlap(this.heroi, c, () => c.vida > 0 && this.machucar(c.x));
    this.chefe = c;
    this.nomeChefe = this.add.text(c.x, c.y - 130, BREJO.chefe, {
      fontFamily: 'Fraunces', fontStyle: '700', fontSize: '30px', color: '#f3c64a',
      stroke: '#10222b', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(40);
  }

  // ---------- Laço principal ----------
  update(_t, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    this.fundo.atualizar(this.cameras.main.scrollX);
    this.moverInimigos(dt);
    this.moverChefe();
    this.nomeChefe.setPosition(this.chefe.x, this.chefe.y - this.chefe.displayHeight * 0.62);
    this.desenharLingua();
    if (!this.ativo) return;

    const h = this.heroi;
    const k = this.teclas;
    const esq = k.LEFT.isDown || k.A.isDown || entrada.esq;
    const dir = k.RIGHT.isDown || k.D.isDown || entrada.dir;
    const pulo = k.UP.isDown || k.W.isDown || k.SPACE.isDown || entrada.pulo;
    const lingua = Phaser.Input.Keyboard.JustDown(k.X) || Phaser.Input.Keyboard.JustDown(k.J) || Phaser.Input.Keyboard.JustDown(k.Z) || (entrada.lingua && !this.linguaSegurada);
    this.linguaSegurada = entrada.lingua;

    const noChao = h.body.blocked.down || h.body.touching.down;
    if (noChao) this.noChaoAte = this.time.now + 110;
    if (pulo && !this.puloSegurado) this.puloPedidoAte = this.time.now + 130;
    this.puloSegurado = pulo;

    const machucada = this.time.now < this.empurradaAte;
    if (!machucada) {
      const alvo = (dir ? 1 : 0) - (esq ? 1 : 0);
      const acel = noChao ? 0.25 : 0.12;
      h.setVelocityX(Phaser.Math.Linear(h.body.velocity.x, alvo * 330, acel));
      if (alvo !== 0) {
        this.virado = alvo;
        h.setFlipX(alvo < 0);
        this.cameras.main.followOffset.x = Phaser.Math.Linear(this.cameras.main.followOffset.x, -160 * alvo, 0.03);
      }
    }

    if (this.puloPedidoAte > this.time.now && this.noChaoAte > this.time.now) {
      h.setVelocityY(-760);
      this.puloPedidoAte = 0;
      this.noChaoAte = 0;
      som.pulo();
    }
    if (!pulo && h.body.velocity.y < -300) h.setVelocityY(h.body.velocity.y * 0.85); // pulo curto ao soltar cedo

    if (lingua) this.lancarLingua();
    this.animarHeroina(noChao, Math.abs(h.body.velocity.x) > 40);
    this.coletarPorToque();
    this.conferirPlacas();
    this.conferirCheckpoints();

    if (!this.arenaFechada && h.x > ARENA.de + 60) this.fecharArena();
    if (h.y > 760) this.cairNaAgua();
  }

  animarHeroina(noChao, andando) {
    const h = this.heroi;
    if (this.time.now < this.empurradaAte) return h.setFrame(QUADRO.sapinha.machucada);
    if (this.linguaOcupada) return h.setFrame(QUADRO.sapinha.boca);
    if (!noChao) return h.setFrame(h.body.velocity.y < 0 ? QUADRO.sapinha.noAr : QUADRO.sapinha.pouso);
    if (andando) {
      // sapo não anda: dá pulinhos
      const passo = Math.floor(this.time.now / 130) % 2;
      return h.setFrame(passo ? QUADRO.sapinha.agachada : QUADRO.sapinha.parada);
    }
    const piscar = this.time.now % 3200 < 160;
    h.setFrame(piscar ? QUADRO.sapinha.piscando : QUADRO.sapinha.parada);
  }

  // ---------- Língua ----------
  boca() {
    const h = this.heroi;
    return { x: h.x + this.virado * h.displayWidth * 0.3, y: h.y - h.displayHeight * 0.05 };
  }

  lancarLingua() {
    if (this.linguaOcupada) return;
    const b = this.boca();
    const alcance = 320;
    const candidatos = [];
    for (const e of this.inimigos.getChildren()) if (e.active) candidatos.push({ alvo: e, tipo: 'inimigo' });
    for (const v of this.vagalumes) if (!v.pego) candidatos.push({ alvo: v.s, tipo: 'vagalume', ref: v });
    if (this.chefe.vida > 0 && this.chefe.acordado) candidatos.push({ alvo: this.chefe, tipo: 'chefe' });

    let melhor = null;
    for (const c of candidatos) {
      const dx = c.alvo.x - b.x;
      const dy = c.alvo.y - b.y;
      if (dx * this.virado < -30 || Math.abs(dy) > 230) continue;
      const d = Math.hypot(dx, dy);
      // inimigo tem prioridade sobre vagalume a distância parecida
      const peso = d - (c.tipo === 'vagalume' ? 0 : 60);
      if (d < alcance && (!melhor || peso < melhor.peso)) melhor = { ...c, peso };
    }

    this.linguaOcupada = true;
    som.lingua();
    const destino = melhor ? { x: melhor.alvo.x, y: melhor.alvo.y } : { x: b.x + this.virado * 200, y: b.y - 10 };
    this.pontaLingua = { t: 0, destino };
    this.tweens.add({
      targets: this.pontaLingua, t: 1, duration: 110, ease: 'Quad.out',
      onComplete: () => {
        if (melhor) this.acertar(melhor);
        this.tweens.add({
          targets: this.pontaLingua, t: 0, duration: 140, delay: 40, ease: 'Quad.in',
          onComplete: () => { this.pontaLingua = null; this.time.delayedCall(120, () => { this.linguaOcupada = false; }); },
        });
      },
    });
  }

  desenharLingua() {
    this.lingua.clear();
    if (!this.pontaLingua) return;
    const b = this.boca();
    const { t, destino } = this.pontaLingua;
    const x = Phaser.Math.Linear(b.x, destino.x, t);
    const y = Phaser.Math.Linear(b.y, destino.y, t);
    this.lingua.lineStyle(9, 0xd9546a, 1).lineBetween(b.x, b.y, x, y);
    this.lingua.lineStyle(3, 0xf29aa8, 1).lineBetween(b.x, b.y - 2, x, y - 2);
    this.lingua.fillStyle(0xc2435a, 1).fillCircle(x, y, 10);
  }

  acertar({ alvo, tipo, ref }) {
    if (tipo === 'vagalume') return this.pegarVagalume(ref);
    if (tipo === 'chefe') return this.baterNoChefe();
    som.nhac();
    estouro(this, alvo.x, alvo.y, { n: 8, raio: 50, escala: 0.35 });
    alvo.disableBody(true, false);
    this.tweens.add({ targets: alvo, scale: 0, angle: 200, duration: 250, onComplete: () => alvo.destroy() });
    this.somarVagalumes(1);
  }

  // ---------- Coleta, placas, checkpoints ----------
  coletarPorToque() {
    const h = this.heroi;
    for (const v of this.vagalumes) {
      if (!v.pego && Math.abs(v.s.x - h.x) < 42 && Math.abs(v.s.y - h.y) < 52) this.pegarVagalume(v);
    }
  }

  pegarVagalume(v) {
    if (v.pego) return;
    v.pego = true;
    som.vagalume();
    this.tweens.add({ targets: [v.s, v.aura], scale: 0, alpha: 0, y: v.s.y - 40, duration: 300, onComplete: () => { v.s.destroy(); v.aura.destroy(); } });
    this.somarVagalumes(1);
  }

  somarVagalumes(n) {
    jornada.vagalumes += n;
    hudVagalumes(jornada.vagalumes);
  }

  conferirPlacas() {
    for (const p of this.placas) {
      const perto = Math.abs(this.heroi.x - p.x) < 230;
      if (perto !== p.visivel) {
        p.visivel = perto;
        this.tweens.add({ targets: p.texto, alpha: perto ? 1 : 0, y: perto ? Y_CHAO - 160 : Y_CHAO - 150, duration: 350, ease: 'Expo.out' });
      }
    }
  }

  conferirCheckpoints() {
    for (const c of this.bandeiras) {
      if (c.pego || this.heroi.x < c.x) continue;
      c.pego = true;
      this.checkpoint = c.x;
      this.vidas = VIDAS;
      hudCoracoes(this.vidas, VIDAS);
      som.sino();
      c.b.setAlpha(1);
      this.tweens.add({ targets: c.b, scaleY: c.b.scaleY * 1.15, duration: 160, yoyo: true });
      estouro(this, c.x, Y_CHAO - 80, { n: 10, raio: 70, escala: 0.4 });
    }
  }

  // ---------- Dano (ninguém perde: só volta ao último checkpoint) ----------
  machucar(deX) {
    if (!this.ativo || this.time.now < this.imuneAte) return;
    this.imuneAte = this.time.now + 1400;
    this.empurradaAte = this.time.now + 380;
    this.vidas--;
    hudCoracoes(Math.max(0, this.vidas), VIDAS);
    som.dor();
    tremer(this);
    const lado = this.heroi.x < deX ? -1 : 1;
    this.heroi.setVelocity(lado * 320, -420);
    this.tweens.add({ targets: this.heroi, alpha: 0.35, duration: 100, yoyo: true, repeat: 6, onComplete: () => this.heroi.setAlpha(1) });
    if (this.vidas <= 0) this.time.delayedCall(450, () => this.renascer());
  }

  cairNaAgua() {
    if (this.renascendo) return;
    som.splash();
    estouro(this, this.heroi.x, Y_CHAO + 40, { n: 12, raio: 60, escala: 0.4 });
    this.renascer();
  }

  renascer() {
    if (this.renascendo) return;
    this.renascendo = true;
    this.ativo = false;
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(280, () => {
      const x = this.arenaFechada ? ARENA.de + 120 : this.checkpoint;
      this.heroi.setPosition(x, Y_CHAO - 80).setVelocity(0, 0).setAlpha(1);
      this.vidas = VIDAS;
      hudCoracoes(this.vidas, VIDAS);
      this.imuneAte = this.time.now + 1200;
      this.cameras.main.fadeIn(300, 0, 0, 0);
      this.ativo = true;
      this.renascendo = false;
    });
  }

  // ---------- Inimigos ----------
  moverInimigos(dt) {
    for (const e of this.inimigos.getChildren()) {
      if (!e.body?.enable) continue;
      e.fase += dt;
      if (e.tipo === 'mosquito') {
        e.x = e.x0 + Math.sin(e.fase * 0.9) * 90;
        e.y = e.y0 + Math.sin(e.fase * 2.3) * 40;
        e.setFlipX(Math.cos(e.fase * 0.9) > 0);
      } else if (e.tipo === 'libelula') {
        e.x = e.x0 + Math.sin(e.fase * 0.7) * 260;
        e.y = e.y0 + Math.sin(e.fase * 3.1) * 18;
        e.setFlipX(Math.cos(e.fase * 0.7) > 0);
      } else {
        e.x += e.dir * 70 * dt;
        if (e.x < e.de) e.dir = 1;
        if (e.x > e.ate) e.dir = -1;
        e.setFlipX(e.dir > 0);
      }
      e.body.updateFromGameObject();
    }
  }

  // ---------- Chefe ----------
  async fecharArena() {
    this.arenaFechada = true;
    this.paredeArena.body.enable = true;
    this.cameras.main.setBounds(ARENA.de - 30, 0, ARENA.ate - ARENA.de + 60, 720);
    tremer(this, 400, 0.01);
    som.batida();
    legenda(`<span style="position:relative;top:-24vh">Chefe: ${BREJO.chefe}</span>`);
    await espera(1800);
    limparLegenda();
    this.chefe.acordado = true;
    this.proximoPuloChefe = this.time.now + 600;
  }

  moverChefe() {
    const c = this.chefe;
    if (!c.acordado || c.vida <= 0) return;
    const noChao = c.body.blocked.down;
    if (noChao) c.setVelocityX(c.body.velocity.x * 0.85);
    if (noChao && this.time.now > this.proximoPuloChefe) {
      const lado = Math.sign(this.heroi.x - c.x) || -1;
      c.setFlipX(lado > 0);
      c.setVelocity(lado * Phaser.Math.Between(180, 300), -Phaser.Math.Between(480, 640));
      this.proximoPuloChefe = this.time.now + Phaser.Math.Between(1100, 1700) + 400 * c.vida;
      this.quicou = true;
    }
    if (noChao && this.quicou) { this.quicou = false; tremer(this, 120, 0.005); som.batida(); }
    c.x = Phaser.Math.Clamp(c.x, ARENA.de + 60, ARENA.ate - 60);
  }

  baterNoChefe() {
    const c = this.chefe;
    if (this.time.now < c.imuneAte || c.vida <= 0) return;
    c.vida--;
    c.imuneAte = this.time.now + 900;
    som.nhac();
    tremer(this, 200, 0.01);
    estouro(this, c.x, c.y, { n: 12, raio: 90, escala: 0.45 });
    c.setTint(0xffb0b0);
    this.time.delayedCall(250, () => c.clearTint());
    c.setVelocity(Math.sign(c.x - this.heroi.x) * 260, -300);
    this.proximoPuloChefe = this.time.now + 1300;
    if (c.vida <= 0) this.venceuChefe();
  }

  async venceuChefe() {
    const c = this.chefe;
    c.setFrame(QUADRO.inimigos.chefeDerrotado);
    this.tweens.add({ targets: this.nomeChefe, alpha: 0, duration: 600 });
    await espera(700);
    this.ativo = false;
    soltarControles();
    mostrar('controles', false);
    this.heroi.setVelocityX(0);
    this.heroi.setFrame(QUADRO.sapinha.feliz);
    som.sino();
    for (let i = 0; i < 8; i++) this.time.delayedCall(i * 90, () => { estouro(this, c.x, c.y - 40, { n: 6, raio: 120, escala: 0.4 }); som.vagalume(); });
    this.somarVagalumes(8);
    await espera(1200);
    legenda(BREJO.fim);
    await esperarToque();
    limparLegenda();
    this.cameras.main.fadeOut(1200, 0, 0, 0);
    await espera(1300);
    this.scene.start('Rio');
  }
}
