import Phaser from 'phaser';
import { gerarProvisorios, gerarAmigoProvisorio } from '../provisorios.js';
import { AMIGOS } from '../conteudo.js';

// Lê public/assets/manifesto.json (escrito pelo cortador de grades) e carrega o que existir.
// O que faltar vira desenho provisório. Trocar arte = rodar o cortador, sem mexer em código.
export class Carregar extends Phaser.Scene {
  constructor() { super('Carregar'); }

  preload() {
    this.load.json('manifesto', 'assets/manifesto.json');
    this.load.on('loaderror', () => {}); // arquivo faltando não trava o jogo
  }

  create() {
    const m = this.cache.json.get('manifesto') || {};
    const barra = this.add.rectangle(640, 360, 0, 6, 0xf3c64a).setOrigin(0, 0.5);
    barra.x = 440;
    this.load.on('progress', (p) => { barra.width = 400 * p; });

    for (const [chave, s] of Object.entries(m.sprites || {})) {
      this.load.spritesheet(chave, `assets/${s.arquivo}`, { frameWidth: s.larguraQuadro, frameHeight: s.alturaQuadro });
    }
    for (const [chave, arq] of Object.entries(m.fundos || {})) this.load.image(chave, `assets/${arq}`);
    for (const [chave, arq] of Object.entries(m.audio || {})) this.load.audio(chave, `assets/${arq}`);

    this.load.once('complete', async () => {
      gerarProvisorios(this);
      AMIGOS.forEach((a, i) => { if (!this.textures.exists(a.sprite)) gerarAmigoProvisorio(this, a.sprite, i); });
      await document.fonts?.ready;
      const fase = new URLSearchParams(location.search).get('fase');
      this.scene.start(fase && this.scene.get(fase) ? fase : 'Titulo');
    });
    this.load.start();
  }
}
