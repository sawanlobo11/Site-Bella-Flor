(() => {
  "use strict";

  /* =========================================================
   * Utilidades
   * ========================================================= */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const formatar = (v) => moeda.format(v);
  const escapar = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Gerador pseudoaleatório com semente, para que cada produto tenha sempre a mesma ilustração
  function gerador(semente) {
    let h = 1779033703 ^ semente.length;
    for (let i = 0; i < semente.length; i++) {
      h = Math.imul(h ^ semente.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  /* =========================================================
   * Ilustrações SVG (usadas quando o produto não tem foto)
   * ========================================================= */
  const VERDES = ["#4f7a5a", "#5f8f68", "#3f6a4b", "#7aa57f"];

  function escurecer(hex, f = 0.78) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * f);
    const g = Math.round(((n >> 8) & 255) * f);
    const b = Math.round((n & 255) * f);
    return `rgb(${r},${g},${b})`;
  }

  function folha(x, y, ang, tam, cor) {
    return `<path d="M0 0 C ${tam * 0.35} ${-tam * 0.35}, ${tam * 0.75} ${-tam * 0.3}, ${tam} 0 C ${tam * 0.75} ${tam * 0.3}, ${tam * 0.35} ${tam * 0.35}, 0 0Z" fill="${cor}" transform="translate(${x} ${y}) rotate(${ang})"/>`;
  }

  function flor(x, y, r, cor, tipo, rnd) {
    const borda = escurecer(cor);
    const giro = Math.round(rnd() * 360);
    if (tipo === 0) {
      // Rosa: camadas em espiral
      let s = `<g transform="translate(${x} ${y}) rotate(${giro})">`;
      s += `<circle r="${r}" fill="${cor}" stroke="${borda}" stroke-width="0.8"/>`;
      for (let i = 1; i <= 3; i++) {
        const rr = r * (1 - i * 0.22);
        s += `<path d="M ${-rr} 0 A ${rr} ${rr} 0 1 1 ${rr * 0.7} ${rr * 0.7}" fill="none" stroke="${borda}" stroke-width="${1.1 - i * 0.15}" stroke-linecap="round"/>`;
      }
      return s + "</g>";
    }
    if (tipo === 1) {
      // Margarida / flor de pétalas
      const n = 8;
      let s = `<g transform="translate(${x} ${y}) rotate(${giro})">`;
      for (let i = 0; i < n; i++) {
        s += `<ellipse rx="${r * 0.32}" ry="${r * 0.62}" transform="rotate(${(360 / n) * i}) translate(0 ${-r * 0.5})" fill="${cor}" stroke="${borda}" stroke-width="0.5"/>`;
      }
      s += `<circle r="${r * 0.3}" fill="#f2b632"/><circle r="${r * 0.3}" fill="none" stroke="#c98d12" stroke-width="0.6" stroke-dasharray="1.2 1.2"/>`;
      return s + "</g>";
    }
    // Flor de 5 pétalas arredondadas
    let s = `<g transform="translate(${x} ${y}) rotate(${giro})">`;
    for (let i = 0; i < 5; i++) {
      s += `<circle r="${r * 0.48}" transform="rotate(${72 * i}) translate(0 ${-r * 0.48})" fill="${cor}" stroke="${borda}" stroke-width="0.6"/>`;
    }
    s += `<circle r="${r * 0.24}" fill="${borda}"/>`;
    return s + "</g>";
  }

  function buqueDeFlores(cx, cy, raio, cores, rnd, qtd = 9, tipoFixo) {
    let s = "";
    // Folhagens de fundo
    for (let i = 0; i < 9; i++) {
      const ang = -170 + i * 20 + rnd() * 10;
      const rad = (ang * Math.PI) / 180;
      s += folha(cx + Math.cos(rad) * raio * 0.3, cy + Math.sin(rad) * raio * 0.3, ang, raio * 0.95, VERDES[i % VERDES.length]);
    }
    // Flores distribuídas em espiral (phyllotaxis)
    const pts = [];
    for (let i = 0; i < qtd; i++) {
      const a = i * 2.39996 + rnd() * 0.3;
      const d = Math.sqrt(i / qtd) * raio * 0.72;
      pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.85]);
    }
    pts.sort((a, b) => a[1] - b[1]);
    pts.forEach(([x, y], i) => {
      const tipo = tipoFixo ?? Math.floor(rnd() * 3);
      s += flor(x, y, raio * (0.26 + rnd() * 0.08), cores[i % cores.length], tipo, rnd);
    });
    return s;
  }

  const ILUSTRACOES = {
    buques(p, rnd) {
      const papel = ["#e9d8c4", "#f3e3d3", "#f8d7e3"][Math.floor(rnd() * 3)];
      let s = "";
      s += `<g stroke="#5f8f68" stroke-width="2.5" stroke-linecap="round">`;
      for (let i = -3; i <= 3; i++) s += `<line x1="${100 + i * 4}" y1="110" x2="${100 + i * 1.2}" y2="182"/>`;
      s += `</g>`;
      s += buqueDeFlores(100, 82, 52, p.cores, rnd, 9);
      s += `<path d="M48 104 L152 104 L112 186 L88 186 Z" fill="${papel}" stroke="${escurecer(papel, 0.85)}" stroke-width="1"/>`;
      s += `<path d="M48 104 L100 186 L88 186 Z" fill="${escurecer(papel, 0.93)}"/>`;
      s += `<path d="M84 150 Q100 158 116 150 L114 160 Q100 166 86 160Z" fill="#d9487a"/>`;
      s += `<path d="M100 156 q-14 8 -18 20 M100 156 q14 8 18 20" stroke="#d9487a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      return s;
    },
    arranjos(p, rnd) {
      let s = buqueDeFlores(100, 78, 50, p.cores, rnd, 8);
      s += `<path d="M66 118 L134 118 Q138 150 124 184 L76 184 Q62 150 66 118Z" fill="#ffffff" fill-opacity=".75" stroke="#c9bfb3" stroke-width="1.2"/>`;
      s += `<path d="M70 132 L130 132" stroke="#c9bfb3" stroke-width="1"/>`;
      s += `<path d="M78 124 Q74 150 82 178" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>`;
      return s;
    },
    plantas(p, rnd) {
      let s = "";
      const n = 7;
      for (let i = 0; i < n; i++) {
        const ang = -160 + (140 / (n - 1)) * i + (rnd() - 0.5) * 12;
        s += folha(100, 132, ang, 55 + rnd() * 25, p.cores[i % p.cores.length]);
      }
      for (let i = 0; i < 3; i++) {
        const ang = -120 + i * 30;
        s += folha(100, 132, ang, 40, escurecer(p.cores[0], 0.85));
      }
      s += `<path d="M64 132 L136 132 L126 186 L74 186 Z" fill="#c8775a"/>`;
      s += `<rect x="60" y="126" width="80" height="12" rx="3" fill="#b5654a"/>`;
      return s;
    },
    cestas(p, rnd) {
      let s = buqueDeFlores(100, 92, 44, p.cores, rnd, 7);
      s += `<path d="M48 124 Q100 30 152 124" fill="none" stroke="#a0703f" stroke-width="6" stroke-linecap="round"/>`;
      s += `<path d="M42 122 L158 122 L146 182 L54 182 Z" fill="#c8955c"/>`;
      for (let y = 132; y < 180; y += 10) s += `<path d="M48 ${y} L152 ${y}" stroke="#a0703f" stroke-width="1.4"/>`;
      for (let x = 58; x < 150; x += 12) s += `<path d="M${x} 124 L${x + (x - 100) * 0.08} 180" stroke="#a0703f" stroke-width="1"/>`;
      s += `<rect x="40" y="116" width="120" height="10" rx="5" fill="#a0703f"/>`;
      return s;
    },
    casamento(p, rnd) {
      let s = `<g stroke="#5f8f68" stroke-width="3" stroke-linecap="round">`;
      for (let i = -2; i <= 2; i++) s += `<line x1="${100 + i * 3}" y1="120" x2="${100 + i * 2}" y2="185"/>`;
      s += `</g>`;
      s += buqueDeFlores(100, 86, 56, p.cores, rnd, 11, 0);
      s += `<rect x="88" y="132" width="24" height="22" rx="3" fill="#f3e8ff" stroke="#d9c6ee"/>`;
      s += `<path d="M100 154 q-10 14 -20 26 M100 154 q10 14 20 26" stroke="#e9d5ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      return s;
    },
  };

  function ilustracao(produto) {
    if (produto.imagem) {
      return `<img src="${escapar(produto.imagem)}" alt="${escapar(produto.nome)}" loading="lazy" />`;
    }
    const rnd = gerador(produto.id);
    const desenhar = ILUSTRACOES[produto.categoria] || ILUSTRACOES.buques;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${escapar(produto.nome)}">${desenhar(produto, rnd)}</svg>`;
  }

  /* =========================================================
   * Catálogo
   * ========================================================= */
  const estado = { categoria: "todos", busca: "", ordem: "padrao" };
  const grade = $("#gradeProdutos");

  function montarFiltros() {
    const caixa = $("#filtrosCategorias");
    const cats = [["todos", "Todos"], ...Object.entries(CATEGORIAS)];
    caixa.innerHTML = cats
      .map(
        ([chave, nome]) =>
          `<button class="chip" role="tab" data-cat="${chave}" aria-selected="${chave === estado.categoria}">${nome}</button>`
      )
      .join("");
    caixa.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      estado.categoria = btn.dataset.cat;
      caixa.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", c === btn));
      renderizar();
    });
  }

  function filtrar() {
    const termo = normalizar(estado.busca.trim());
    let lista = PRODUTOS.filter((p) => {
      if (estado.categoria !== "todos" && p.categoria !== estado.categoria) return false;
      if (!termo) return true;
      return normalizar(`${p.nome} ${p.descricao} ${CATEGORIAS[p.categoria] || ""}`).includes(termo);
    });
    if (estado.ordem === "menor") lista = [...lista].sort((a, b) => a.preco - b.preco);
    if (estado.ordem === "maior") lista = [...lista].sort((a, b) => b.preco - a.preco);
    if (estado.ordem === "nome") lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return lista;
  }

  function cardHTML(p, i) {
    return `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
        <button class="card__imagem" data-ver="${p.id}" aria-label="Ver detalhes de ${escapar(p.nome)}">
          ${p.destaque ? `<span class="card__etiqueta">${escapar(p.destaque)}</span>` : ""}
          ${ilustracao(p)}
        </button>
        <div class="card__corpo">
          <span class="card__categoria">${escapar(CATEGORIAS[p.categoria] || "")}</span>
          <h3 class="card__nome">${escapar(p.nome)}</h3>
          <p class="card__descricao">${escapar(p.descricao)}</p>
          <div class="card__rodape">
            <span class="preco">${formatar(p.preco)}</span>
            <button class="btn-add" data-add="${p.id}" aria-label="Adicionar ${escapar(p.nome)} à sacola">+</button>
          </div>
        </div>
      </article>`;
  }

  function renderizar() {
    const lista = filtrar();
    grade.innerHTML = lista.map(cardHTML).join("");
    $("#vazio").hidden = lista.length > 0;
    $("#contagem").textContent = `${lista.length} ${lista.length === 1 ? "produto" : "produtos"}`;
  }

  grade.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) return adicionar(add.dataset.add);
    const ver = e.target.closest("[data-ver]");
    if (ver) abrirModal(ver.dataset.ver);
  });

  let atrasoBusca;
  $("#busca").addEventListener("input", (e) => {
    clearTimeout(atrasoBusca);
    atrasoBusca = setTimeout(() => {
      estado.busca = e.target.value;
      renderizar();
    }, 150);
  });
  $("#ordenar").addEventListener("change", (e) => {
    estado.ordem = e.target.value;
    renderizar();
  });

  /* =========================================================
   * Modal de detalhes
   * ========================================================= */
  const modal = $("#modal");

  function abrirModal(id) {
    const p = PRODUTOS.find((x) => x.id === id);
    if (!p) return;
    $("#modalConteudo").innerHTML = `
      <div class="modal__img">${ilustracao(p)}</div>
      <div class="modal__info">
        <span class="card__categoria">${escapar(CATEGORIAS[p.categoria] || "")}</span>
        <h3>${escapar(p.nome)}</h3>
        <p>${escapar(p.descricao)}</p>
        <ul>
          <li>Flores frescas selecionadas no dia</li>
          <li>Cartão com mensagem personalizada grátis</li>
          <li>Entrega no mesmo dia para pedidos até 15h</li>
        </ul>
        <span class="preco">${formatar(p.preco)}</span>
        <button class="btn btn--primario btn--bloco" data-add-modal="${p.id}">Adicionar à sacola</button>
      </div>`;
    modal.showModal();
  }

  $("#fecharModal").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
    const btn = e.target.closest("[data-add-modal]");
    if (btn) {
      adicionar(btn.dataset.addModal);
      modal.close();
    }
  });

  /* =========================================================
   * Sacola (salva no navegador)
   * ========================================================= */
  const CHAVE = "bellaflor-sacola";
  let sacola = {};
  try {
    sacola = JSON.parse(localStorage.getItem(CHAVE)) || {};
  } catch {
    sacola = {};
  }
  // Remove itens que não existem mais no catálogo
  Object.keys(sacola).forEach((id) => {
    if (!PRODUTOS.some((p) => p.id === id)) delete sacola[id];
  });

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(sacola));
    } catch {
      /* armazenamento indisponível */
    }
  }

  function adicionar(id) {
    sacola[id] = (sacola[id] || 0) + 1;
    salvar();
    atualizarSacola();
    const p = PRODUTOS.find((x) => x.id === id);
    avisar(`${p.nome} adicionado à sacola`);
    const badge = $("#qtdSacola");
    badge.classList.remove("pulse");
    void badge.offsetWidth;
    badge.classList.add("pulse");
  }

  function alterar(id, delta) {
    sacola[id] = (sacola[id] || 0) + delta;
    if (sacola[id] <= 0) delete sacola[id];
    salvar();
    atualizarSacola();
  }

  function itensSacola() {
    return Object.entries(sacola).map(([id, qtd]) => ({ produto: PRODUTOS.find((p) => p.id === id), qtd }));
  }

  function atualizarSacola() {
    const itens = itensSacola();
    const totalQtd = itens.reduce((s, i) => s + i.qtd, 0);
    const total = itens.reduce((s, i) => s + i.qtd * i.produto.preco, 0);
    $("#qtdSacola").textContent = totalQtd;
    $("#sacolaTotal").textContent = formatar(total);
    $("#sacolaVazia").hidden = itens.length > 0;
    $("#finalizar").disabled = itens.length === 0;
    $("#sacolaItens").innerHTML = itens
      .map(
        ({ produto: p, qtd }) => `
        <li class="item">
          <div class="item__img">${ilustracao(p)}</div>
          <div>
            <div class="item__nome">${escapar(p.nome)}</div>
            <div class="item__preco">${formatar(p.preco)}</div>
            <div class="qtd">
              <button data-menos="${p.id}" aria-label="Diminuir">−</button>
              <span>${qtd}</span>
              <button data-mais="${p.id}" aria-label="Aumentar">+</button>
            </div>
          </div>
          <button class="item__remover" data-remover="${p.id}">Remover</button>
        </li>`
      )
      .join("");
  }

  $("#sacolaItens").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.mais) alterar(b.dataset.mais, 1);
    if (b.dataset.menos) alterar(b.dataset.menos, -1);
    if (b.dataset.remover) alterar(b.dataset.remover, -Infinity);
  });

  const painel = $("#sacola");
  const fundo = $("#sacolaFundo");
  function abrirSacola() {
    painel.classList.add("aberta");
    painel.setAttribute("aria-hidden", "false");
    fundo.hidden = false;
    $("#fecharSacola").focus();
  }
  function fecharSacola() {
    painel.classList.remove("aberta");
    painel.setAttribute("aria-hidden", "true");
    fundo.hidden = true;
  }
  $("#abrirSacola").addEventListener("click", abrirSacola);
  $("#fecharSacola").addEventListener("click", fecharSacola);
  fundo.addEventListener("click", fecharSacola);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && painel.classList.contains("aberta")) fecharSacola();
  });

  const linkWhats = (texto) => `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`;

  $("#finalizar").addEventListener("click", () => {
    const itens = itensSacola();
    if (!itens.length) return;
    const linhas = itens.map(({ produto: p, qtd }) => `• ${qtd}x ${p.nome} — ${formatar(p.preco * qtd)}`);
    const total = itens.reduce((s, i) => s + i.qtd * i.produto.preco, 0);
    const msg = `Olá, Bella Flor! Gostaria de fazer um pedido:\n\n${linhas.join("\n")}\n\nTotal: ${formatar(total)}`;
    window.open(linkWhats(msg), "_blank", "noopener");
  });

  $("#linkWhatsContato").href = linkWhats("Olá, Bella Flor! Gostaria de encomendar um arranjo personalizado.");

  /* =========================================================
   * Aviso flutuante
   * ========================================================= */
  let tempoAviso;
  function avisar(texto) {
    const el = $("#aviso");
    el.textContent = texto;
    el.classList.add("visivel");
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(() => el.classList.remove("visivel"), 2200);
  }

  /* =========================================================
   * Cabeçalho e menu mobile
   * ========================================================= */
  const topo = $("#topo");
  const aoRolar = () => topo.classList.toggle("rolado", window.scrollY > 10);
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  const btnMenu = $("#btnMenu");
  const menu = $("#menu");
  btnMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", aberto);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("aberto");
      btnMenu.setAttribute("aria-expanded", "false");
    }
  });

  /* =========================================================
   * Início
   * ========================================================= */
  $("#heroArte").innerHTML = (() => {
    const rnd = gerador("bella-flor-hero");
    const p = { cores: ["#d9487a", "#f4a6c0", "#ffffff", "#f6c453", "#c49bd8"] };
    return `<svg viewBox="0 0 200 200">${ILUSTRACOES.buques({ ...p, id: "hero" }, rnd)}</svg>`;
  })();
  $("#ano").textContent = new Date().getFullYear();

  montarFiltros();
  renderizar();
  atualizarSacola();
})();
