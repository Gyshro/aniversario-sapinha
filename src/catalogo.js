// O que cada folha de sprite contém. A ordem dos quadros segue a grade 4×2 pedida ao GPT
// (linha de cima, da esquerda pra direita, depois a de baixo).
// "altura" é a altura na tela, em pixels do mundo (1280×720), seja qual for a resolução do arquivo.

export const SPRITES = {
  esperminha: { quadros: 8, altura: 70 },   // 0-3 nadar · 4 impulso · 5 tonta · 6 vitória · 7 parada
  rivais: { quadros: 8, altura: 62 },       // coluna = rival; linha 1 e 2 = os 2 quadros do nado
  sapinha: { quadros: 8, altura: 88 },      // 0 parada · 1 piscando · 2 agachada · 3 no ar · 4 pouso · 5 boca aberta · 6 machucada · 7 feliz
  inimigos: { quadros: 8, altura: 54 },     // 0-1 mosquito · 2-3 besouro · 4-5 libélula · 6 chefe · 7 chefe derrotado
  itens: { quadros: 8, altura: 36 },        // 0-2 vagalume · 3 coração · 4 estrela · 5 bolha · 6 orbe · 7 polaroid
  plataformas: { quadros: 8, altura: 60 },  // 0 tronco · 1 galho · 2 folha · 3 chão · 4 toco · 5 placa · 6 bandeira · 7 deque
  vitorias_regias: { quadros: 8, altura: 70 }, // 0-3 folhas · 4 flor fechada · 5 meio aberta · 6 aberta · 7 juncos
  princesa: { quadros: 1, altura: 250 },
};

// Camadas de fundo: cada uma vira um TileSprite com parallax próprio.
export const FUNDOS = [
  'corrida_1', 'corrida_2', 'corrida_3',
  'brejo_1', 'brejo_2', 'brejo_3',
  'rio_1', 'rio_2', 'rio_3',
];

export const QUADRO = {
  esperminha: { nadar: [0, 1, 2, 3], impulso: 4, tonta: 5, vitoria: 6, parada: 7 },
  sapinha: { parada: 0, piscando: 1, agachada: 2, noAr: 3, pouso: 4, boca: 5, machucada: 6, feliz: 7 },
  inimigos: { mosquito: [0, 1], besouro: [2, 3], libelula: [4, 5], chefe: 6, chefeDerrotado: 7 },
  itens: { vagalume: [0, 1, 2], coracao: 3, estrela: 4, bolha: 5, orbe: 6, polaroid: 7 },
  plataformas: { tronco: 0, galho: 1, folha: 2, chao: 3, toco: 4, placa: 5, bandeira: 6, deque: 7 },
  vitorias_regias: { folhas: [0, 1, 2, 3], flores: [4, 5, 6], juncos: 7 },
};

// Escala pra um sprite ficar com a altura pedida, qualquer que seja o tamanho do quadro no arquivo.
export function escalaPara(cena, chave, altura) {
  const quadro = cena.textures.getFrame(chave, 0) || cena.textures.getFrame(chave);
  const alvo = altura ?? SPRITES[chave]?.altura ?? 64;
  return alvo / quadro.height;
}
