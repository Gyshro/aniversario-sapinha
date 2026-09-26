// Tudo o que é texto, nome ou foto mora aqui. Trocar o conteúdo não exige mexer no jogo.
// Fotos: coloque em public/assets/fotos/ e escreva só o nome do arquivo.
// Áudio de amigo (opcional): public/assets/audio/, mesmo esquema.

export const NOME = 'Arya';

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
  { nome: 'Gi', sprite: 'amigo_1', audio: null, texto: 'Mensagem da Gi.\nPode ter várias linhas.' },
  {
    nome: 'Richard', sprite: 'amigo_2', audio: null, texto: `Feliz aniversário, Porrinha! 🥳

Mesmo você sendo teoricamente um projeto de criança que ainda nem saiu do saco do Kael, já conseguiu conquistar o cargo de sobrinha virtual KKKKKKK. Eu ainda lembro quando te batizei de Merida, mas Mirabel acabou combinando muito mais — principalmente porque além de parecer contigo, ainda tem a vantagem de ser biscoito. (Bônus x2 de Apelido)

Você é uma das criaturinhas mais fofas que eu conheço, e justamente por isso acho incrível o contraste de você ser toda delicadinha e ao mesmo tempo gostar de uns dark romances que fariam qualquer adulto responsável pedir explicações. (por favor não me colocar no meio disso)

Enfim, espero que seu dia seja muito bom, que você ganhe bastante carinho, presentes e, principalmente, que o Kael finalmente pare de te deixar guardada no inventário dele.

Feliz aniversário, Aria! 🐸`,
  },
  {
    nome: 'Eliza', sprite: 'amigo_3', audio: null,
    texto: 'É a porra mais amada de todas, não tem outra. Mas falando sério, espero que seu aniversário seja da cor que você ainda tem ai dentro do saco do seu pai, reluzente. E de verdade mesmo, você é muito querida entre a gente e realmente já soube isso bem no fundinho quando você apareceu de repente. Sei que por muitas nuances não estamos lá nessa proximidade toda, mas queria que soubesse que pode contar conosco pra o que precisar, inclusive até pra compartilhar um pouco desses momentos juntos. Claro, além das fofocas..... por isso, feliz aniversário pra você Arya! Amo você netinha, vê se nasce logo',
  },
  {
    nome: 'Dylan', sprite: 'amigo_4', audio: null,
    texto: 'Porrinha, minha neta favorita! Mal nasceu mas já está ganhando seus parabéns, estou orgulhoso do que você tem se tornado até agora. Difícil descrever pouco mesmo te conhecendo à pouco também, mas de certo posso te dizer que você terá um futuro enorme pela frente! Você merece tudo de melhor na sua vida, deixando um pouco as brincadeiras de lado, sua energia como pessoa é extraordinária. Espero que você consiga tudo o que quer em sua vida, e que muitos outros aniversários pra você sejam um pouquinho tão especiais quanto este pra que você sempre se sinta lembrada e abraçada. Aproveite, você merece.',
  },
  {
    nome: 'Kaia', sprite: 'amigo_5', audio: null,
    texto: 'Feliz aniversário, subrinhaaa. Espero que seu dia seja muito especial e cheio de coisas boas. Que esse novo ciclo traga muita felicidade, saúde, conquistas e momentos incríveis. Que você continue realizando seus planos e que não faltem motivos para sorrir. Aproveite muito seu dia!',
  },
  {
    nome: 'LP', sprite: 'amigo_6', audio: null,
    texto: 'Conhecer você foi uma das coisas mais loucas que eu já fiz na vida. Em um ambiente caótico, com pessoas de índoles questionáveis, mas que não foram suficientes para mudar a percepção que sempre tive de você. Mesmo com nossas diferenças, principalmente na personalidade, mas ainda gosto de você. Gosto do ser humano e incrível e da amiga que você é. Amo você, linda. Feliz Aniversário!',
  },
  {
    nome: 'Elodie', sprite: 'amigo_7', audio: null, texto: `Parabéns para você!

Que esse novo ciclo venha cheio de luz, de sonhos bonitos e caminhos que te levem onde o coração conduz. Que nunca te falte coragem para acreditar, nem motivos para sorrir, sonhar e recomeçar.

Que a vida te presenteie com momentos especiais, com amor, paz, conquistas e dias cada vez mais leves e ideais. E que tudo aquilo que hoje parece um sonho distante, se torne realidade no momento certo e de uma forma linda e radiante.

Mesmo não sendo tão próximas, tenho muito carinho por ti e espero de coração que esse novo ano da tua vida seja maravilhoso.`,
  },
  { nome: 'Lulu', sprite: 'amigo_8', audio: null, texto: 'Mensagem da Lulu.' },
  // Juno e Venecas escreveram juntos: a mensagem começa num e termina no outro.
  {
    nome: 'Juno', sprite: 'amigo_10', audio: null, texto: `Querida Arya,

Talvez não faça tanto tempo que nos conhecemos, mas parece que você já faz parte da nossa família há muito mais tempo do que podemos contar. Por isso, queríamos que você soubesse o quanto é especial para nós.

O carinho que cultivamos por você e os sorrisos que suas piadas tirou de nós se tornaram naturais, gestos e reações inevitáveis pela pessoa divertida e incrível que você é…`,
  },
  {
    nome: 'Venecas', sprite: 'amigo_9', audio: null, texto: `…e esperamos que seu dia seja cheio de tudo aquilo que faz você feliz e que você sempre esteja rodeada de quem te ama, incluindo nós. Estamos felizes de ter te conhecido e de nos tornarmos seus amigos. Nós te adoramos!

Por favor, fique longe de sapos suspeitos querendo te beijar.

Um beijo enorme e todo o nosso carinho,
do seu ex-inimigo Arturo e usuário de ifunny Evan.`,
  },
  { nome: 'Letícia', sprite: 'amigo_11', audio: null, texto: 'Parabéns Princesa!!! Espero que seu dia seja lindo e abençoado, lhe desejo todas as coisas boas do mundo!!' },
  { nome: 'Zayn', sprite: 'amigo_12', audio: null, texto: 'feliz niver, tamo junto bochechão, te amo' },
  { nome: 'Maya', sprite: 'amigo_13', audio: null, texto: 'Parabens kengona veia' },
];

// GIF surpresa que aparece no finalzinho, depois de tudo (public/assets/fotos/).
export const EASTER_EGG = 'easter_egg.webp';

export const FINAL = {
  texto: `Feliz aniversário, <strong>${NOME}</strong>.<br>Depois de tanta fase, ainda bem que você venceu essa corrida.`,
};
