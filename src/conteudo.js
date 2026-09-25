// Tudo o que é texto, nome ou foto mora aqui. Trocar o conteúdo não exige mexer no jogo.
// Fotos: coloque em public/assets/fotos/ e escreva só o nome do arquivo.
// Áudio de amigo (opcional): public/assets/audio/, mesmo esquema.

export const NOME = 'Fulana';

export const INTRO = [
  'Muito antes de existir uma princesa…',
  '…existia alguém que iria se tornar surreal.',
];

export const CORRIDA = {
  vitoria: 'Parabéns. Você venceu.',
  complicacao: 'Infelizmente, houve complicações.',
};

// Piadas internas do brejo. O chefe é o mini-chefe do fim; as placas aparecem pelo caminho.
export const BREJO = {
  chefe: 'A Segunda-Feira',
  placas: [
    'Placa 1',
    'Placa 2',
    'Placa 3',
  ],
  fim: 'Agora o caminho é pelo rio.',
};

// Uma vitória-régia por lembrança. foto = null mostra só a moldura.
export const LEMBRANCAS = [
  { foto: null, frase: 'Lembrança 1: uma frase curta' },
  { foto: null, frase: 'Lembrança 2' },
  { foto: null, frase: 'Lembrança 3' },
  { foto: null, frase: 'Lembrança 4' },
  { foto: null, frase: 'Lembrança 5' },
];

// sprite = nome da imagem do amigo em public/assets/sprites/ (sem extensão).
// Enquanto não existir, aparece uma silhueta provisória.
export const AMIGOS = [
  { nome: 'Amigo 1', sprite: 'amigo_1', audio: null, texto: 'Mensagem do amigo 1.\nPode ter várias linhas.' },
  { nome: 'Amiga 2', sprite: 'amigo_2', audio: null, texto: 'Mensagem da amiga 2.' },
  { nome: 'Amigo 3', sprite: 'amigo_3', audio: null, texto: 'Mensagem do amigo 3.' },
  { nome: 'Amiga 4', sprite: 'amigo_4', audio: null, texto: 'Mensagem da amiga 4.' },
  { nome: 'Amigo 5', sprite: 'amigo_5', audio: null, texto: 'Mensagem do amigo 5.' },
];

export const FINAL = {
  texto: `Feliz aniversário, <strong>${NOME}</strong>.<br>Depois de tanta fase, ainda bem que você venceu essa corrida.`,
};
