"""Transforma as imagens do GPT em arquivos do jogo e atualiza public/assets/manifesto.json.

Folha de sprite (grade de quadros sobre magenta):
    python ferramentas/cortar_grade.py sprite  <imagem> <chave> [--grade 4x2] [--altura 256]
    ex.: python ferramentas/cortar_grade.py sprite ~/Downloads/sheet_sapinha.png sapinha

Três camadas de fundo empilhadas numa imagem só (a de cima é opaca, as outras sobre magenta):
    python ferramentas/cortar_grade.py camadas <imagem> <prefixo>
    ex.: python ferramentas/cortar_grade.py camadas ~/Downloads/brejo_camadas.png brejo

Uma camada de fundo por imagem (--opaca na camada do fundo; as outras sobre magenta):
    python ferramentas/cortar_grade.py camada <imagem> <chave> [--opaca]
    ex.: python ferramentas/cortar_grade.py camada ~/Downloads/brejo_1.png brejo_1 --opaca

Música ou áudio:
    python ferramentas/cortar_grade.py audio <arquivo.mp3> <chave>

O que faz com a folha: tira o magenta com borda suave (sem franja rosa), corta todos os quadros
pelo MESMO retângulo (a personagem não "pula" entre quadros) e avisa se algum desenho encosta
na borda da célula (sinal de que o GPT não respeitou a grade).
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "public" / "assets"
MANIFESTO = ASSETS / "manifesto.json"


def ler_manifesto():
    if MANIFESTO.exists():
        return json.loads(MANIFESTO.read_text(encoding="utf-8"))
    return {"sprites": {}, "fundos": {}, "audio": {}}


def gravar_manifesto(m):
    MANIFESTO.write_text(json.dumps(m, indent=2, ensure_ascii=False), encoding="utf-8")


def tirar_magenta(rgb):
    """rgb uint8 (h,w,3) -> rgba uint8. 'Magentice' = quanto R e B passam do G."""
    f = rgb.astype(np.float32)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    m = np.minimum(r, b) - g
    # m >= 150: magenta puro (some). m <= 60: pixel do desenho (fica). No meio: borda suave.
    alfa = np.clip((150.0 - m) / 90.0, 0.0, 1.0)
    # tira o rosa que "vaza" na borda: puxa R e B pra perto do G nos pixels mistos
    vazamento = np.clip(m, 0, None) * (1.0 - alfa)
    r2 = np.clip(r - vazamento, 0, 255)
    b2 = np.clip(b - vazamento, 0, 255)
    rgba = np.dstack([r2, g, b2, alfa * 255.0]).astype(np.uint8)
    return rgba


def caixa(alfa, limiar=24):
    ys, xs = np.where(alfa > limiar)
    if len(xs) == 0:
        return None
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def cmd_sprite(a):
    img = Image.open(a.imagem).convert("RGB")
    cols, lins = (int(v) for v in a.grade.lower().split("x"))
    W, H = img.size
    cw, ch = W / cols, H / lins
    rgba = tirar_magenta(np.asarray(img))

    celulas, caixas = [], []
    for j in range(lins):
        for i in range(cols):
            x0, y0 = round(i * cw), round(j * ch)
            x1, y1 = round((i + 1) * cw), round((j + 1) * ch)
            cel = rgba[y0:y1, x0:x1]
            cx = caixa(cel[..., 3])
            n = len(celulas)
            if cx is None:
                print(f"  ! quadro {n}: vazio")
            else:
                bx0, by0, bx1, by1 = cx
                encosta = bx0 <= 1 or by0 <= 1 or bx1 >= cel.shape[1] - 1 or by1 >= cel.shape[0] - 1
                if encosta:
                    print(f"  ! quadro {n}: o desenho ENCOSTA na borda da célula (pode estar cortado)")
                caixas.append(cx)
            celulas.append(cel)

    if not caixas:
        sys.exit("Nenhum desenho encontrado. O fundo é magenta #FF00FF mesmo?")

    # mesmo retângulo pra todos os quadros
    ux0 = min(c[0] for c in caixas); uy0 = min(c[1] for c in caixas)
    ux1 = max(c[2] for c in caixas); uy1 = max(c[3] for c in caixas)
    pad = 4
    ux0, uy0 = max(0, ux0 - pad), max(0, uy0 - pad)
    fw, fh = ux1 - ux0 + pad, uy1 - uy0 + pad

    escala = min(1.0, a.altura / fh)
    qw, qh = max(1, round(fw * escala)), max(1, round(fh * escala))
    folha = Image.new("RGBA", (qw * len(celulas), qh), (0, 0, 0, 0))
    for n, cel in enumerate(celulas):
        c = np.zeros((fh, fw, 4), np.uint8)
        pedaco = cel[uy0:uy0 + fh, ux0:ux0 + fw]
        c[: pedaco.shape[0], : pedaco.shape[1]] = pedaco
        q = Image.fromarray(c, "RGBA").resize((qw, qh), Image.LANCZOS)
        folha.paste(q, (n * qw, 0))

    destino = ASSETS / "sprites" / f"{a.chave}.webp"
    destino.parent.mkdir(parents=True, exist_ok=True)
    folha.save(destino, "WEBP", quality=90, method=6)
    m = ler_manifesto()
    m["sprites"][a.chave] = {"arquivo": f"sprites/{a.chave}.webp", "larguraQuadro": qw, "alturaQuadro": qh, "quadros": len(celulas)}
    gravar_manifesto(m)
    kb = destino.stat().st_size // 1024
    print(f"ok  {a.chave}: {len(celulas)} quadros de {qw}x{qh} -> {destino.relative_to(RAIZ)} ({kb} KB)")


def emendar(arr, frac=0.08):
    """Suaviza a emenda: o fim da camada vai se misturando com o começo, pra repetir sem corte."""
    w = arr.shape[1]
    b = max(8, int(w * frac))
    arr = arr.astype(np.float32)
    rampa = np.linspace(0, 1, b)[None, :, None]
    arr[:, w - b:] = arr[:, w - b:] * (1 - rampa) + arr[:, :b] * rampa
    return arr.astype(np.uint8)


def cmd_camadas(a):
    img = Image.open(a.imagem).convert("RGB")
    W, H = img.size
    faixa = H / 3
    m = ler_manifesto()
    for k in range(3):
        pedaco = np.asarray(img.crop((0, round(k * faixa), W, round((k + 1) * faixa))))
        if k == 0:
            out = Image.fromarray(emendar(pedaco), "RGB")
        else:
            out = Image.fromarray(emendar(tirar_magenta(pedaco)), "RGBA")
        alvo_h = 720
        if out.height > alvo_h:
            out = out.resize((round(out.width * alvo_h / out.height), alvo_h), Image.LANCZOS)
        chave = f"{a.prefixo}_{k + 1}"
        destino = ASSETS / "fundos" / f"{chave}.webp"
        destino.parent.mkdir(parents=True, exist_ok=True)
        out.save(destino, "WEBP", quality=88, method=6)
        m["fundos"][chave] = f"fundos/{chave}.webp"
        print(f"ok  {chave}: {out.width}x{out.height} ({destino.stat().st_size // 1024} KB)")
    gravar_manifesto(m)


def cmd_camada(a):
    img = Image.open(a.imagem).convert("RGB")
    arr = np.asarray(img)
    out = Image.fromarray(emendar(arr), "RGB") if a.opaca else Image.fromarray(emendar(tirar_magenta(arr)), "RGBA")
    if out.height > 720:
        out = out.resize((round(out.width * 720 / out.height), 720), Image.LANCZOS)
    destino = ASSETS / "fundos" / f"{a.chave}.webp"
    destino.parent.mkdir(parents=True, exist_ok=True)
    out.save(destino, "WEBP", quality=88, method=6)
    m = ler_manifesto()
    m["fundos"][a.chave] = f"fundos/{a.chave}.webp"
    gravar_manifesto(m)
    print(f"ok  {a.chave}: {out.width}x{out.height} ({destino.stat().st_size // 1024} KB)")


def cmd_audio(a):
    origem = Path(a.arquivo)
    destino = ASSETS / "audio" / f"{a.chave}{origem.suffix.lower()}"
    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(origem, destino)
    m = ler_manifesto()
    m["audio"][a.chave] = f"audio/{destino.name}"
    gravar_manifesto(m)
    print(f"ok  {a.chave} -> {destino.relative_to(RAIZ)}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sprite"); s.add_argument("imagem"); s.add_argument("chave")
    s.add_argument("--grade", default="4x2"); s.add_argument("--altura", type=int, default=256)
    s.set_defaults(f=cmd_sprite)
    c = sub.add_parser("camadas"); c.add_argument("imagem"); c.add_argument("prefixo"); c.set_defaults(f=cmd_camadas)
    c1 = sub.add_parser("camada"); c1.add_argument("imagem"); c1.add_argument("chave")
    c1.add_argument("--opaca", action="store_true"); c1.set_defaults(f=cmd_camada)
    au = sub.add_parser("audio"); au.add_argument("arquivo"); au.add_argument("chave"); au.set_defaults(f=cmd_audio)
    a = p.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
