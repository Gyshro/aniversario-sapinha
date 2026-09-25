import Phaser from 'phaser';
import { INTRO } from '../conteudo.js';
import { destravarAudio, som, tocarMusica } from '../som.js';
import { legenda, limparLegenda, esperarToque, espera, esconderTudo } from '../ui.js';
import { escalaPara } from '../catalogo.js';
import { vagalumesAmbiente, toqueNaTela } from '../efeitos.js';

export class Titulo extends Phaser.Scene {
  constructor() { super('Titulo'); }

  create() {
    esconderTudo();
    this.cameras.main.fadeIn(800, 11, 26, 34);

    this.add.image(640, 360, 'corrida_1').setDisplaySize(1280, 720).setTint(0x556677);
    vagalumesAmbiente(this, 26);

    const heroi = this.add.sprite(640, 470, 'esperminha', 7).setScale(escalaPara(this, 'esperminha', 150));
    this.tweens.add({ targets: heroi, y: 455, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.time.addEvent({ delay: 2600, loop: true, callback: () => { heroi.setFrame(6); this.time.delayedCall(700, () => heroi.setFrame(7)); } });

    legenda('Do Esperminha<br>à Princesa<small>toque para começar</small>', { titulo: true });
    this.comecar(heroi);
  }

  async comecar(heroi) {
    await esperarToque({ aviso: false, atraso: 300 });
    destravarAudio();
    telaCheia();
    som.sino();
    tocarMusica(this, 'musica_corrida', { volume: 0.45 });
    limparLegenda();

    this.tweens.add({ targets: heroi, alpha: 0, duration: 600 });
    this.cameras.main.fadeOut(900, 0, 0, 0);
    await espera(1000);

    for (const linha of INTRO) {
      legenda(linha);
      await espera(2600);
    }
    limparLegenda();
    this.scene.start('Corrida');
  }
}

function telaCheia() {
  const el = document.documentElement;
  const pedir = el.requestFullscreen || el.webkitRequestFullscreen;
  // só no celular: no PC, tela cheia sem pedir incomoda mais do que ajuda
  if (!pedir || document.fullscreenElement || !toqueNaTela()) return;
  Promise.resolve(pedir.call(el, { navigationUI: 'hide' }))
    .then(() => screen.orientation?.lock?.('landscape').catch(() => {}))
    .catch(() => {});
}
