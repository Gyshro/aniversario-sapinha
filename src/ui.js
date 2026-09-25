// Camada HTML: narração, HUD, botões de toque, polaroid, falas e tela final.

const $ = (id) => document.getElementById(id);

export function mostrar(id, sim = true) { $(id).hidden = !sim; }

export function esconderTudo() {
  for (const id of ['legenda', 'hud', 'posicao', 'controles', 'polaroid', 'fala', 'final', 'toque']) mostrar(id, false);
}

// ---------- Narração ----------
export function legenda(html, { titulo = false } = {}) {
  const el = $('legenda');
  el.classList.toggle('titulo', titulo);
  el.innerHTML = html;
  // reinicia a animação de entrada
  el.hidden = true; void el.offsetWidth; el.hidden = false;
}
export function limparLegenda() { mostrar('legenda', false); }

// Espera um toque/clique/tecla em qualquer lugar. Devolve uma Promise.
export function esperarToque({ aviso = true, atraso = 400 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (aviso) mostrar('toque');
      const fim = (e) => {
        if (e.type === 'keydown' && !['Space', 'Enter', 'ArrowRight', 'KeyX'].includes(e.code)) return;
        window.removeEventListener('pointerdown', fim);
        window.removeEventListener('keydown', fim);
        mostrar('toque', false);
        resolve();
      };
      window.addEventListener('pointerdown', fim);
      window.addEventListener('keydown', fim);
    }, atraso);
  });
}

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- HUD ----------
export function hudCoracoes(vivos, total) {
  const el = $('hud-coracoes');
  if (el.children.length !== total) {
    el.innerHTML = '';
    for (let i = 0; i < total; i++) { const c = document.createElement('span'); c.className = 'coracao'; el.appendChild(c); }
  }
  [...el.children].forEach((c, i) => c.classList.toggle('vazio', i >= vivos));
}
export function hudVagalumes(n) { $('hud-vagalumes').textContent = n; }

let ultimaPosicao = null;
export function hudPosicao(progresso, posicao) {
  $('posicao-barra').style.width = `${Math.min(100, progresso * 100).toFixed(1)}%`;
  if (posicao !== ultimaPosicao) {
    const el = $('posicao-num');
    el.textContent = `${posicao}º`;
    if (ultimaPosicao !== null && posicao < ultimaPosicao) {
      el.classList.remove('subiu'); void el.offsetWidth; el.classList.add('subiu');
    }
    ultimaPosicao = posicao;
  }
}

// ---------- Controles de toque ----------
// Estado compartilhado com as cenas: entrada.esq, entrada.dir, entrada.pulo, entrada.lingua
export const entrada = { esq: false, dir: false, pulo: false, lingua: false };

export function prepararControles() {
  for (const btn of document.querySelectorAll('.btn-toque')) {
    const tecla = btn.dataset.tecla;
    const liga = (e) => { e.preventDefault(); entrada[tecla] = true; btn.classList.add('ativo'); btn.setPointerCapture?.(e.pointerId); };
    const desliga = (e) => { e.preventDefault(); entrada[tecla] = false; btn.classList.remove('ativo'); };
    btn.addEventListener('pointerdown', liga);
    btn.addEventListener('pointerup', desliga);
    btn.addEventListener('pointercancel', desliga);
    btn.addEventListener('lostpointercapture', desliga);
  }
  window.addEventListener('contextmenu', (e) => e.preventDefault());
}

export function soltarControles() {
  for (const k of Object.keys(entrada)) entrada[k] = false;
  document.querySelectorAll('.btn-toque.ativo').forEach((b) => b.classList.remove('ativo'));
}

// ---------- Polaroid ----------
export function polaroid({ foto, frase }) {
  const f = $('polaroid-foto');
  if (foto) { f.style.backgroundImage = `url("assets/fotos/${foto}")`; f.textContent = ''; }
  else { f.style.backgroundImage = ''; f.textContent = 'foto aqui'; }
  $('polaroid-frase').textContent = frase;
  mostrar('polaroid');
  return new Promise((resolve) => {
    const fechar = () => {
      $('polaroid').removeEventListener('pointerdown', fechar);
      window.removeEventListener('keydown', fecharTecla);
      mostrar('polaroid', false);
      resolve();
    };
    const fecharTecla = (e) => { if (['Space', 'Enter', 'ArrowRight'].includes(e.code)) fechar(); };
    setTimeout(() => {
      $('polaroid').addEventListener('pointerdown', fechar);
      window.addEventListener('keydown', fecharTecla);
    }, 600);
  });
}

// ---------- Falas dos amigos ----------
export function fala({ nome, texto, indice, total }) {
  $('fala-nome').textContent = nome;
  $('fala-texto').textContent = texto;
  $('fala-texto').scrollTop = 0;
  $('fala-contagem').textContent = `${indice + 1} de ${total}`;
  $('fala-seguir').textContent = indice + 1 === total ? 'Continuar' : 'Próximo';
  const el = $('fala');
  el.hidden = true; void el.offsetWidth; el.hidden = false;
  return new Promise((resolve) => {
    const btn = $('fala-seguir');
    const ok = () => {
      btn.removeEventListener('click', ok);
      window.removeEventListener('keydown', tecla);
      mostrar('fala', false);
      resolve();
    };
    const tecla = (e) => { if (['Space', 'Enter', 'ArrowRight'].includes(e.code)) { e.preventDefault(); ok(); } };
    setTimeout(() => {
      btn.addEventListener('click', ok);
      window.addEventListener('keydown', tecla);
      btn.focus({ preventScroll: true });
    }, 500);
  });
}

// ---------- Tela final ----------
export function telaFinal(html, { rever, jogar }) {
  $('final-texto').innerHTML = html;
  mostrar('final');
  $('final-rever').onclick = () => { mostrar('final', false); rever(); };
  $('final-jogar').onclick = () => { mostrar('final', false); jogar(); };
}
