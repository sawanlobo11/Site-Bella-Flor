(() => {
  "use strict";

  /* =========================================================
   * Utilidades
   * ========================================================= */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const formatar = (v) => moeda.format(v);
  const escapar = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const linkWhats = (texto) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(texto)}`;
  const temPreco = (p) => typeof p.preco === "number";
  const precoHTML = (p) =>
    temPreco(p) ? `<span class="preco">${formatar(p.preco)}</span>` : `<span class="preco preco--consulta">Sob consulta</span>`;
  const IMG_PADRAO = "assets/img/logo-bela.png";
  const imagem = (p) => p.imagem || IMG_PADRAO;
  const nomeCategoria = (chave) => (CATEGORIAS[chave] ? CATEGORIAS[chave].nome : "");

  // Links de WhatsApp e Instagram espalhados pela página
  $$("[data-whats]").forEach((a) => (a.href = linkWhats(a.dataset.whats)));
  $$("[data-insta]").forEach((a) => (a.href = LOJA.instagram));

  /* =========================================================
   * Catálogo
   * ========================================================= */
  const estado = { categoria: "todos", busca: "", ordem: "padrao" };
  const grade = $("#gradeProdutos");

  function montarDestaques() {
    const caixa = $("#destaques");
    const cats = [["todos", { nome: "Todos", capa: IMG_PADRAO }], ...Object.entries(CATEGORIAS)];
    caixa.innerHTML = cats
      .map(
        ([chave, c]) => `
        <button class="destaque" role="tab" data-cat="${chave}" aria-selected="${chave === estado.categoria}">
          <span class="destaque__anel"><img src="${escapar(c.capa)}" alt="" loading="lazy" /></span>
          <span class="destaque__nome">${escapar(c.nome)}</span>
        </button>`
      )
      .join("");
    caixa.addEventListener("click", (e) => {
      const btn = e.target.closest(".destaque");
      if (!btn) return;
      estado.categoria = btn.dataset.cat;
      $$(".destaque", caixa).forEach((c) => c.setAttribute("aria-selected", c === btn));
      renderizar();
    });
  }

  function filtrar() {
    const termo = normalizar(estado.busca.trim());
    let lista = PRODUTOS.filter((p) => {
      if (estado.categoria !== "todos" && p.categoria !== estado.categoria) return false;
      if (!termo) return true;
      return normalizar(`${p.nome} ${p.descricao} ${nomeCategoria(p.categoria)}`).includes(termo);
    });
    // Itens "sob consulta" ficam no fim quando se ordena por preço
    const valor = (p, vazio) => (temPreco(p) ? p.preco : vazio);
    if (estado.ordem === "menor") lista = [...lista].sort((a, b) => valor(a, Infinity) - valor(b, Infinity));
    if (estado.ordem === "maior") lista = [...lista].sort((a, b) => valor(b, -Infinity) - valor(a, -Infinity));
    if (estado.ordem === "nome") lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return lista;
  }

  function cardHTML(p, i) {
    return `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
        <button class="card__imagem" data-ver="${p.id}" aria-label="Ver detalhes de ${escapar(p.nome)}">
          ${p.destaque ? `<span class="card__etiqueta">${escapar(p.destaque)}</span>` : ""}
          <img src="${escapar(imagem(p))}" alt="${escapar(p.nome)}" loading="lazy" />
        </button>
        <div class="card__corpo">
          <span class="card__categoria">${escapar(nomeCategoria(p.categoria))}</span>
          <h3 class="card__nome">${escapar(p.nome)}</h3>
          <p class="card__descricao">${escapar(p.descricao)}</p>
          <div class="card__rodape">
            ${precoHTML(p)}
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
      <img class="modal__img" src="${escapar(imagem(p))}" alt="${escapar(p.nome)}" />
      <div class="modal__info">
        <span class="card__categoria">${escapar(nomeCategoria(p.categoria))}</span>
        <h3>${escapar(p.nome)}</h3>
        <p>${escapar(p.descricao)}</p>
        <ul>
          <li>Flores e plantas selecionadas com cuidado</li>
          <li>Cartão com mensagem personalizada</li>
          <li>Entrega em Teixeira de Freitas: combine pelo WhatsApp</li>
        </ul>
        ${precoHTML(p)}
        <button class="btn btn--rosa btn--bloco" data-add-modal="${p.id}">Adicionar à sacola</button>
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
  const CHAVE = "floricultura-bela-sacola";
  let sacola = {};
  try {
    sacola = JSON.parse(localStorage.getItem(CHAVE)) || {};
  } catch {
    sacola = {};
  }
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
    const p = PRODUTOS.find((x) => x.id === id);
    if (!p) return;
    sacola[id] = (sacola[id] || 0) + 1;
    salvar();
    atualizarSacola();
    avisar(`${p.nome} adicionado à sacola`);
    const badge = $("#qtdSacola");
    badge.classList.remove("pulse");
    void badge.offsetWidth;
    badge.classList.add("pulse");
  }

  function alterar(id, delta) {
    sacola[id] = (sacola[id] || 0) + delta;
    if (!(sacola[id] > 0)) delete sacola[id];
    salvar();
    atualizarSacola();
  }

  function atualizarSacola() {
    const itens = Object.entries(sacola).map(([id, qtd]) => ({ produto: PRODUTOS.find((p) => p.id === id), qtd }));
    const totalQtd = itens.reduce((s, i) => s + i.qtd, 0);
    const total = itens.reduce((s, i) => s + (temPreco(i.produto) ? i.qtd * i.produto.preco : 0), 0);
    const temConsulta = itens.some((i) => !temPreco(i.produto));

    $("#qtdSacola").textContent = totalQtd;
    $("#sacolaTotal").textContent = formatar(total) + (temConsulta ? " +" : "");
    $("#sacolaNota").hidden = !temConsulta;
    $("#sacolaVazia").hidden = itens.length > 0;
    $("#sacolaItens").innerHTML = itens
      .map(
        ({ produto: p, qtd }) => `
        <li class="item">
          <img class="item__img" src="${escapar(imagem(p))}" alt="" />
          <div>
            <div class="item__nome">${escapar(p.nome)}</div>
            <div class="item__preco">${temPreco(p) ? formatar(p.preco) : "Sob consulta"}</div>
            <div class="qtd">
              <button data-menos="${p.id}" aria-label="Diminuir quantidade">−</button>
              <span>${qtd}</span>
              <button data-mais="${p.id}" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <button class="item__remover" data-remover="${p.id}">Remover</button>
        </li>`
      )
      .join("");

    const fin = $("#finalizar");
    if (itens.length) {
      const linhas = itens.map(({ produto: p, qtd }) =>
        `• ${qtd}x ${p.nome} — ${temPreco(p) ? formatar(p.preco * qtd) : "sob consulta"}`
      );
      const msg =
        `Olá, Floricultura Bela! Gostaria de fazer um pedido:\n\n${linhas.join("\n")}\n\n` +
        `Total: ${formatar(total)}${temConsulta ? " + itens sob consulta" : ""}`;
      fin.href = linkWhats(msg);
      fin.removeAttribute("aria-disabled");
    } else {
      fin.removeAttribute("href");
      fin.setAttribute("aria-disabled", "true");
    }
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
   * Menu mobile
   * ========================================================= */
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
  $("#ano").textContent = new Date().getFullYear();
  montarDestaques();
  renderizar();
  atualizarSacola();
})();
