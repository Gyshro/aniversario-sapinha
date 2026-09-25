import { defineConfig } from 'vite';

// Caminhos relativos: o GitHub Pages serve o jogo em /aniversario-sapinha/, não na raiz.
export default defineConfig({
  base: './',
});
