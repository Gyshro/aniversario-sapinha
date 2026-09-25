# Do Esperminha à Princesa — plano

Jogo de aniversário. 5 a 7 minutos. **Ninguém perde**: é presente, não desafio.
Todo erro só atrasa, nunca dá "game over".

## O fio que costura tudo

A mesma **coroinha dourada + lacinho rosa** aparece no esperminha, no sapinho e na
princesa. É assim que ela se reconhece em cada fase sem precisar de texto.
Os **vagalumes** são a moeda do jogo e viram a coroa no final.

## Fases

| # | Fase | Duração | Visual | Controle celular | Controle PC |
|---|---|---|---|---|---|
| 0 | Título "Toque para começar" | — | escuro, texto épico exagerado | toque (libera som e tela cheia) | clique |
| 1 | A Grande Corrida | 60–90 s | 3D brilhante tipo brinquedo (ref. 1), túnel mágico rosa/violeta | arrastar o dedo pra cima/baixo | setas / W S |
| 2 | O Brejo | 2–3 min | pintado à mão tipo Rayman (ref. 2), bayou dourado de tarde | ◀ ▶ no polegar esquerdo, PULO e LÍNGUA no direito | setas, espaço, X |
| 3 | O Rio das Vitórias-Régias | 1–2 min | noite violeta/azul (ref. 3), vagalumes | tocar = pula pra próxima folha | espaço / clique |
| 4 | Os Amigos | depende do nº | mesma noite, câmera aproxima e anda pra direita | tocar = próxima mensagem | espaço / clique |
| 5 | A Transformação | ~30 s | clarão dourado, princesa | — | — |

### 1. A Grande Corrida
- Rolagem automática pra direita. Ela só sobe e desce.
- Rivais cômicos: um de óculos escuros (o convencido), um dormindo, um em pânico.
- Obstáculos bobos (bolhas-armadilha, correnteza), estrelinhas de impulso.
- Barra no topo com a posição: 12º → 5º → 1º. A corrida é **ajustada por baixo**
  pra ela sempre ganhar no fim, mas parecer apertado.
- Final: orbe dourado gigante, câmera lenta, clarão, "Parabéns. Você venceu." …
  *puf* → sapinho. "Infelizmente, houve complicações."

### 2. O Brejo
- Uma fase só, em 3 trechos, com checkpoints.
- Língua com **mira automática** no inimigo mais próximo à frente (no celular não dá pra mirar).
- Inimigos: mosquitos (1 linguada), besouros, libélulas. Mini-chefe no fim do trecho 3
  com nome de piada interna ("O Boleto", "A Segunda-Feira"…).
- Placas de madeira com frases que só o grupo entende (texto escrito pelo código, dá pra trocar).
- Coleta vagalumes. Se cair ou apanhar, volta ao checkpoint na hora.
- A língua é desenhada em código (linha elástica + ponta), não em imagem.

### 3. O Rio
- Acabou o perigo. Música desacelera.
- Cada vitória-régia é uma lembrança: ao pousar, sobe uma polaroid (foto + frase curta).
- Os vagalumes coletados seguem o sapinho e clareiam a cena.

### 4. Os Amigos
- Na última folha o controle é tirado com suavidade.
- Câmera: zoom-in lento, depois travelling pra direita revelando a margem.
- Um amigo por vez acende: nome + mensagem (texto em HTML por cima, nítido no celular).
  Botão "próximo", sem tempo fixo. Áudio opcional por amigo.
- Cada mensagem solta mais vagalumes em volta dela.

### 5. A Transformação
- Vagalumes formam uma coroa, música sobe, clarão, princesa (cartoon **dela**, feita a partir de foto).
- "Feliz aniversário, [NOME]. Depois de tanta fase, ainda bem que você venceu essa corrida."
- 2 segundos de silêncio… um esperminha passa correndo no fundo.
- Botões: "rever as mensagens" / "jogar de novo".

## Tecnologia

**Vite + Phaser 3**, JavaScript. Texto das mensagens em HTML/CSS por cima do canvas.

- Phaser já traz o que o jogo pede: sprites animados, física de plataforma, câmera com
  `zoomTo`/`pan`, parallax, toque e teclado.
- **Sem Three.js**: o visual vem das imagens pintadas, não de 3D. Seria peso e trabalho a mais.
- **Sem React/Tailwind**: a parte de interface é pequena (título, balão, botões).
- Base 1280×720, escala "caber na tela". **Celular deitado**; em pé aparece "vire o celular".
- Imagens em WebP, meta de **< 15 MB** no total pra abrir bem no 4G.
- Publicação: Vercel, link privado pra mandar no WhatsApp.

## Fluxo das imagens (GPT)

1. **Quadros de estilo** primeiro (uma tela-exemplo por fase). Aprovou, vira referência.
2. Depois as **folhas de sprite** e as **camadas de fundo**, sempre anexando o quadro aprovado.
3. Sprites em grade de células iguais sobre fundo **magenta chapado #FF00FF**
   (o GPT costuma desenhar o "xadrez transparente" em vez de transparência real,
   como na ref. 1, e verde não serve porque o sapo é verde). Eu corto a grade e
   tiro o magenta por script.

## O que preciso de você

- Nome dela e data do aniversário (prazo).
- 3 a 6 piadas internas (inimigos, chefe, placas).
- 5 a 8 lembranças: foto + frase curta.
- Uma foto dela de rosto (pra princesa se parecer com ela).
- Amigos: nome, foto, texto (e áudio, se tiver). Pode vir depois.

---

## Estado (24/09) e como usar

**O jogo inteiro já roda** com desenhos provisórios: título → corrida → brejo (chefe) → rio
(lembranças) → amigos → transformação → tela final. Cada imagem que chega do GPT substitui o
provisório sozinha, sem mexer em código.

- Rodar: `npm run dev` e abrir o endereço que aparecer (no celular, o da rede, com o PC e o celular no mesmo Wi-Fi).
- Pular direto pra uma fase: `?fase=Corrida`, `?fase=Brejo`, `?fase=Rio`.
- Textos, nomes, fotos e piadas: **só em `src/conteudo.js`**. Fotos em `public/assets/fotos/`.

### Cortar as imagens do GPT
```
python ferramentas/cortar_grade.py sprite  <png> sapinha
python ferramentas/cortar_grade.py sprite  <png> esperminha
python ferramentas/cortar_grade.py sprite  <png> rivais
python ferramentas/cortar_grade.py sprite  <png> inimigos
python ferramentas/cortar_grade.py sprite  <png> itens
python ferramentas/cortar_grade.py sprite  <png> plataformas
python ferramentas/cortar_grade.py sprite  <png> vitorias_regias
python ferramentas/cortar_grade.py sprite  <png> princesa --grade 1x1 --altura 512
python ferramentas/cortar_grade.py sprite  <png> amigo_1  --grade 2x1 --altura 512
python ferramentas/cortar_grade.py camada  <png> brejo_1 --opaca     (as _1 são opacas)
python ferramentas/cortar_grade.py camada  <png> brejo_2             (as _2 e _3 sobre magenta)
python ferramentas/cortar_grade.py audio   <mp3> musica_brejo
```
