import Phaser from 'phaser';
import { Carregar } from './cenas/Carregar.js';
import { Titulo } from './cenas/Titulo.js';
import { Corrida } from './cenas/Corrida.js';
import { Brejo } from './cenas/Brejo.js';
import { Rio } from './cenas/Rio.js';
import { prepararControles, entrada } from './ui.js';

export const LARGURA = 1280;
export const ALTURA = 720;

prepararControles();


const jogo = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jogo',
  width: LARGURA,
  height: ALTURA,
  backgroundColor: '#0b1a22',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug: false } },
  input: { activePointers: 3 },
  // ?teste: setTimeout no lugar do requestAnimationFrame (o navegador de teste roda em segundo plano)
  fps: new URLSearchParams(location.search).has('teste') ? { forceSetTimeOut: true, target: 60 } : {},
  render: { antialias: true, roundPixels: false },
  scene: [Carregar, Titulo, Corrida, Brejo, Rio],
});

// Atalho de desenvolvimento: ?fase=Brejo abre direto na fase.
if (import.meta.env.DEV) Object.assign(window, { __jogo: jogo, __entrada: entrada });
