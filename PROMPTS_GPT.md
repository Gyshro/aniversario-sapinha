# Prompts para o GPT

✅ **Lote 1 aprovado (24/09):** `referencias/estilo_*.png`. O visual ficou **pintado à mão em
tudo**, inclusive a corrida (não o 3D brilhante do plano original). Está coerente e fica assim.

## Regras para todos os pedidos
- **Anexe o quadro de estilo indicado** em cada pedido. É ele que mantém a arte igual.
- **A sapinha oficial é a do `estilo_rio.png`**: gordinha, olhos grandes, coroa dourada, lencinho
  coral e folhinha na cabeça. A do `estilo_brejo.png` saiu magra e diferente: não use aquela.
- **A esperminha oficial é a do `estilo_corrida.png`**: branca, coroa dourada, laço coral.
- Folhas de sprite: fundo **magenta chapado #FF00FF**, sem xadrez, sem linhas separando as
  células, cada desenho **inteiro dentro da sua célula** e com folga em volta.
- Se o GPT recusar a palavra "sperm", use "cute cartoon tadpole-like swimmer with a long wavy tail".
- Salve com o nome indicado em `Downloads` e me avise. Eu corto, limpo e coloco no jogo.

Frase de estilo que vai em todos (já está embutida nos prompts abaixo):
> hand-painted 2D storybook illustration, soft painterly brushwork, emerald green and deep blue
> palette with coral accents and warm golden firefly light, same style as the attached image

---

## LOTE 2 — personagens (prioridade)

### B1 · `sheet_sapinha.png` — [anexar estilo_rio.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells. Solid flat magenta background #FF00FF everywhere, no shadows on the background, no checkerboard. The character is the exact cute chubby green frog from the attached image (big eyes, small golden crown, coral neckerchief, little leaf on the head), hand-painted storybook style, full body, side view facing RIGHT, same size and centered in every cell with generous margin. Row 1: (1) standing idle, (2) same pose blinking, (3) crouched ready to jump, (4) mid-jump stretched with legs extended. Row 2: (5) landing squash, (6) mouth wide open facing right with NO tongue drawn, (7) hurt and dazed with swirly eyes, (8) very happy with eyes closed and a big smile.
```

### B2 · `sheet_esperminha.png` — [anexar estilo_corrida.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells. Solid flat magenta background #FF00FF, no shadows, no checkerboard. The character is the exact white cute swimmer from the attached image (round head, big shiny eyes, small golden crown, coral bow), hand-painted storybook style, side view facing RIGHT, whole long tail visible, same size and centered in every cell. Row 1: swim cycle in 4 frames, the tail waving in 4 different phases. Row 2: (5) speed boost, body stretched with speed lines, (6) dizzy with spiral eyes, (7) victory with sparkling eyes and a huge smile, (8) calm idle with eyes closed.
```

### B3 · `sheet_rivais.png` — [anexar estilo_corrida.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells. Solid flat magenta background #FF00FF, no shadows. Four rival swimmers in the same hand-painted style as the attached image, side view facing RIGHT, NO crown and NO bow, same size in every cell. Each COLUMN is one rival; row 1 has the tail up, row 2 has the same rival with the tail down. Column 1: purple, grumpy and smug. Column 2: yellow with big round glasses, goofy. Column 3: green with a leaf on the head, sneaky grin. Column 4: pink, cheerful and a bit clueless.
```

---

## LOTE 3 — cenário (uma camada por imagem)

Formato **paisagem 3:2**, e a camada tem de **emendar sozinha pelas bordas esquerda e direita**
(repete sem corte). A camada `_1` é o fundo inteiro; a `_2` e a `_3` ficam sobre magenta.

### Corrida — [anexar estilo_corrida.png]
**`corrida_1.png`**
```
Wide landscape background layer for a side-scrolling game, 3:2, seamlessly tileable left to right (the left and right edges must match). Same hand-painted style as the attached image: the far background of the magical underwater forest, misty emerald and teal, distant twisted trees and glowing golden lights. No characters, no foreground objects, nothing in the middle band that would distract from gameplay.
```
**`corrida_2.png`**
```
Wide landscape layer for a side-scrolling game, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted style as the attached image: only the translucent flowing water tunnel ribbons with bubbles, running horizontally across the middle of the image. Everything else is magenta. No characters.
```
**`corrida_3.png`**
```
Wide landscape foreground layer for a side-scrolling game, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted style as the attached image: only dark curling plant silhouettes and a few glowing golden bulbs along the BOTTOM fifth of the image. The top four fifths are pure magenta. No characters.
```

### Brejo — [anexar estilo_brejo.png]
**`brejo_1.png`**
```
Wide landscape background layer for a side-scrolling platformer, 3:2, seamlessly tileable left to right. Same hand-painted style as the attached image: a Louisiana bayou at dusk, coral and violet sunset sky, far misty cypress trees with Spanish moss, a distant stilt house with warm windows, calm reflective water at the bottom. No characters, no platforms, no enemies.
```
**`brejo_2.png`**
```
Wide landscape layer for a side-scrolling platformer, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted style as the attached image: mid-distance cypress trunks and hanging Spanish moss framing the top, darker than the far background. Keep the middle and the lower half mostly magenta so gameplay stays readable. No characters.
```
**`brejo_3.png`**
```
Wide landscape foreground layer for a side-scrolling platformer, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted style as the attached image: only dark reeds, cattails and a few pink swamp flowers along the BOTTOM sixth of the image, slightly out of focus. Everything above is pure magenta.
```

### Rio — [anexar estilo_rio.png]
**`rio_1.png`**
```
Wide landscape background layer, 3:2, seamlessly tileable left to right. Same hand-painted night style as the attached image: deep blue night sky, big full moon, soft clouds, stars. The bottom 40% is calm dark water with the moon's reflection. No trees in front, no lily pads, no characters.
```
**`rio_2.png`**
```
Wide landscape layer, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted night style as the attached image: the far riverbank only, dark trees with hanging moss, a small wooden stilt house and dock with warm lanterns, sitting on a horizon line at 55% of the image height. Everything above the treetops and below the horizon is pure magenta. No characters.
```
**`rio_3.png`**
```
Wide landscape layer, 3:2, seamlessly tileable left to right, on a solid flat magenta #FF00FF background. Same hand-painted night style as the attached image: only the near water surface in the bottom half, dark blue with gentle ripples and golden reflections. The top half is pure magenta. No lily pads, no characters.
```

---

## LOTE 4 — objetos (grades 4×2, mesmas regras do lote 2)

### C1 · `sheet_inimigos.png` — [anexar estilo_brejo.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells, solid flat magenta #FF00FF background, no shadows. Same hand-painted style as the attached image, all characters facing LEFT, goofy and harmless-looking. Row 1: (1) the big-eyed mosquito from the attached image flying, wings up, (2) same mosquito wings down, (3) a round purple beetle walking, legs forward, (4) same beetle legs back. Row 2: (5) a cross-eyed dragonfly flying, wings up, (6) same dragonfly wings down, (7) mini-boss: a big grumpy toad wearing a small red necktie, like a tired office boss, (8) the same toad defeated, dizzy with little stars around the head.
```

### C2 · `sheet_itens.png` — [anexar estilo_corrida.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells, solid flat magenta #FF00FF background. Same hand-painted style as the attached image. Row 1: (1)(2)(3) the cute glowing yellow firefly from the attached image in 3 frames with the glow pulsing small, medium, large, (4) a small coral heart. Row 2: (5) the glowing golden ring from the attached image, seen from the front, (6) the red spiky ball obstacle from the attached image, (7) a giant glowing golden sun-orb portal, (8) an empty cream-colored polaroid photo frame.
```

### C3 · `sheet_plataformas.png` — [anexar estilo_brejo.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells, solid flat magenta #FF00FF background. Same hand-painted style as the attached image, side view. Row 1: (1) a floating mossy log, (2) a twisted mossy branch, (3) a small lily pad seen from the side, (4) a chunk of muddy ground with grass on top, straight vertical sides so it can repeat side by side. Row 2: (5) a tree stump, (6) a blank wooden sign on a stake, (7) a wooden checkpoint stick with a coral ribbon, (8) a small wooden dock section.
```

### C4 · `sheet_vitorias_regias.png` — [anexar estilo_rio.png]
```
Sprite sheet for a 2D game. Grid of 4 columns × 2 rows, 8 equal square cells, no lines between cells, solid flat magenta #FF00FF background. Same hand-painted night style as the attached image, seen from a low side angle. Row 1: four giant water lily pads with slightly raised rims, four different sizes and shapes. Row 2: (5) pink water-lily flower closed, (6) half open, (7) fully open and glowing, (8) a cluster of reeds and cattails.
```

---

## LOTE 5 — a princesa e os amigos (quando tiver as fotos)

### D1 · `princesa.png` — [anexar estilo_princesa.png + foto dela]
```
Single full-body character on a solid flat magenta #FF00FF background, no shadow. The princess from the attached scene (flowing green and gold leaf gown, coral bow, small golden crown), but with the face, skin tone and hair of the person in the attached photo, stylized in the same hand-painted storybook style. Standing, arms slightly open, joyful, facing the viewer. Whole body visible with margin around it.
```

### D2 · `amigo_N.png` (um por amigo) — [anexar estilo_amigos.png + foto do amigo]
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. The person from the attached photo drawn in the same hand-painted storybook style as the attached scene, full body, 3/4 view facing left. Left cell: standing, friendly smile. Right cell: the same person waving. Same size and position in both cells.
```

### D2 · os 6 amigos (avatares do Habbo, 25/09) — [anexar estilo_amigos.png + o print do avatar]

Cada prompt descreve o avatar por escrito, para a arte não depender só de o gerador "ler" o
print pixelado. Salve com o nome indicado.

| Arquivo a gerar | Print de origem (Downloads) |
|---|---|
| `amigo_1.png` · **Gi** | `20260925_022806.jpg` (moça de rosa, chapéu de plumas) |
| `amigo_2.png` · **Richard** | `Captura_de_tela_2026-09-24_220717.png` (fada verde com estrela) |
| `amigo_3.png` · **Eliza** | `Captura_de_tela_2026-09-24_222137.png` (cobra verde) |
| `amigo_4.png` · **Max** | `Captura_de_tela_2026-09-24_223902.png` (criatura branca peluda) |
| `amigo_5.png` · **Kaia** | `image.png` (moça de turbante branco) |
| `amigo_6.png` · **LP** | `w1X04gAAAAGSURBVAMAc9wMdymvA9sAAAAASUVORK5CYII.png` (sapo verde) |

**`amigo_1.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a young woman with light tan skin, green eyes and light brown hair tied in a low bun, wearing a 1920s flapper look all in pink: a pink cloche hat decorated with tall pink feathers, a big pink rose and a small golden fan ornament, a fluffy pink feather-boa sleeveless top, a long pink skirt and pink shoes. Elegant, slightly deadpan expression. Full body, 3/4 view facing left. Left cell: standing, a small confident smile. Right cell: the same character waving. Same size and position in both cells.
```

**`amigo_2.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a cheerful green-skinned swamp fairy boy with a huge toothy grin, messy dark green hair crowned with moss and little leaves, an antenna headband topped by a glowing golden star, a striped green and brown sweater, a fluffy lime-green grass tutu, and one translucent fairy wing on his back. Full body, 3/4 view facing left. Left cell: standing, big grin. Right cell: the same character waving. Same size and position in both cells.
```

**`amigo_3.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a chubby, friendly swamp snake with smooth moss-green scales and a lighter green belly, coiled in thick round loops with the tail curling out at the bottom, big red eyes and a small open mouth with a surprised, goofy look. Cute, not scary. Full body, 3/4 view facing left. Left cell: coiled and looking surprised. Right cell: the same snake happily waving the tip of its tail. Same size and position in both cells.
```

**`amigo_4.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a mysterious, very fluffy all-white furry creature, like a small cuddly yeti, with a tall pointed white hood that curls at the tip like whipped cream, the face almost hidden behind a thick white fur collar, soft white fur everywhere and small white boots. Cozy and funny, not scary. Full body, 3/4 view facing left. Left cell: standing, only a hint of eyes peeking over the collar. Right cell: the same creature waving a fluffy paw. Same size and position in both cells.
```

**`amigo_5.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a stylish woman with dark brown skin, a tall white turban headwrap, black sunglasses, large gold hoop earrings and a gold bracelet, a white dress with a green leaf print, a green and white patterned scarf over the shoulders, and white sandals. Glamorous and relaxed. Full body, 3/4 view facing left. Left cell: standing, a cool smile. Right cell: the same character waving. Same size and position in both cells.
```

**`amigo_6.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a goofy bright green frog-like creature with huge round googly white eyes of slightly different sizes, glossy red lips, two little pointed ears on top of the head, a pointed yellow-green collar around the neck, a muscular green bodysuit, green trousers and green boots. Silly and lovable. Full body, 3/4 view facing left. Left cell: standing, googly-eyed and grinning. Right cell: the same creature waving. Same size and position in both cells.
```

### D2 · amigos 11 a 13 (25/09) — [anexar estilo_amigos.png + o print do avatar]

| Arquivo a gerar | Origem |
|---|---|
| `amigo_11.png` · **Letícia** | `leticia.png` (ruivo de bigode, terno bege) |
| `amigo_12.png` · **Zayn** | `image.webp.png` (cartola com caveira, terno magenta) |
| `amigo_13.png` · **Maya** | sem print: é um jacaré |

**`amigo_11.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a pale-skinned person with voluminous swept-back ginger red hair and a big bushy ginger handlebar mustache, sleepy half-closed eyes and a dry, unimpressed expression, wearing a loose beige tan suit with a matching jacket and trousers, an olive green scarf knotted loosely at the neck, and dark navy shoes. Old-timey explorer vibe, funny and charming. Full body, 3/4 view facing left. Left cell: standing, arms relaxed, deadpan look. Right cell: the same character waving. Same size and position in both cells.
```

**`amigo_12.png`**
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a charismatic man with warm brown skin and shoulder-length dark hair, a tall black top hat with a dark blue band and a small white skull ornament on the front, a fitted magenta crimson suit, a necklace of ivory fang charms over the chest, brown and white shoes, and a thin purple walking cane with a golden handle. Sly, playful showman smile, like a mysterious New Orleans magician, fun and not scary. Full body, 3/4 view facing left. Left cell: standing, holding the cane, sly smile. Right cell: the same character tipping his top hat with a wave. Same size and position in both cells.
```

**`amigo_13.png`** (Maya virou jacaré em 25/09; o tubarão foi descartado)
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. A cute friendly alligator character in the same hand-painted storybook style as the attached scene: a chubby swamp alligator standing upright on its hind legs like a person, olive and moss green bumpy back with a soft pale yellow belly, a long rounded snout with a big goofy happy grin showing small rounded teeth, big warm amber eyes, little rosy cheeks, short stubby arms and a thick curling tail behind. Adorable and huggable, a gentle bayou friend, not scary, no water. Full body, 3/4 view facing left. Left cell: standing upright, big happy grin. Right cell: the same alligator waving one little claw. Same size and position in both cells.
```

### D2 · `amigo_14.png` · **Kael** (25/09) — [anexar estilo_amigos.png + o print do avatar]
```
Two versions of the same character side by side, in 2 equal cells, no line between them, solid flat magenta #FF00FF background, no shadow. Reinterpret the pixel-art avatar in the attached screenshot as a character in the same hand-painted storybook style as the attached scene: a young man with warm medium-brown skin, short straight black hair in a neat bowl cut with a straight fringe over the forehead, calm half-lidded eyes and a relaxed, slightly shy expression, wearing a blue button-up jacket with a small stand collar and little gold buttons over a darker navy top, a thin silver bracelet on one wrist, loose dark navy jeans and dark grey sneakers. Chill and friendly. Full body, 3/4 view facing left. Left cell: standing relaxed, hands at his sides, soft smile. Right cell: the same character waving. Same size and position in both cells.
```

---

## Música (opcional)
Mande mp3 com estes nomes que eu encaixo: `musica_corrida`, `musica_brejo`, `musica_rio`,
`musica_final`. Sem arquivo, a fase fica só com os efeitos sonoros.
