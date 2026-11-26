/*
 * Teste local de vendas e faturamento, com banco falso (não mexe nos dados reais).
 * Cadastra itens, registra vendas, confere a baixa no estoque, cancela uma venda
 * e tira capturas das telas de Vendas e Faturamento.
 *
 * Como rodar:  node estoque/testes/teste-vendas.js
 * Capturas em estoque/testes/saida/.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const PAGINA = path.join(__dirname, '..', 'index.html');
const SAIDA = path.join(__dirname, 'saida');
fs.mkdirSync(SAIDA, { recursive: true });

// Reaproveita o banco falso do teste do estoque
const fonte = fs.readFileSync(path.join(__dirname, 'teste-local.js'), 'utf8');
const mock = fonte.slice(fonte.indexOf('const mock = `') + 14, fonte.indexOf('`;\n(async'));
const TESTE = path.join(__dirname, '..', '_teste-vendas.html');

(async () => {
  fs.writeFileSync(TESTE, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>' + mock + '</script>' + fs.readFileSync(PAGINA, 'utf8') + '</body></html>');
  const b = await chromium.launch(); const erros = []; const falhas = [];
  const confere = (cond, msg) => { if (!cond) falhas.push(msg); };

  for (const [n, vp, extra] of [['d', { width: 1280, height: 800 }, {}], ['m', { width: 375, height: 812 }, { hasTouch: true, isMobile: true }]]) {
    const p = await b.newPage({ viewport: vp, ...extra });
    p.on('pageerror', e => erros.push(n + ': ' + e.message));
    p.on('console', m => m.type() === 'error' && erros.push(n + ': ' + m.text()));
    await p.goto('file://' + TESTE); await p.waitForTimeout(300);

    // Itens e vendas antigas direto no banco falso
    await p.evaluate(async () => {
      const db = await window.claude.use('db');
      const itens = [
        ['rosa', { nome: 'Rosa vermelha', secao: 'organicos', categoria: '', quantidade: 40, unidade: 'haste', minimo: 10, preco: 8, custo: 3 }],
        ['orq', { nome: 'Orquídea Phalaenopsis', secao: 'organicos', categoria: '', quantidade: 6, unidade: 'vaso', minimo: 2, preco: 129.9, custo: 60 }],
        ['vaso', { nome: 'Vaso cerâmica nº 14', secao: 'fisicos', categoria: 'Vasos', quantidade: 2, unidade: 'un', minimo: 4, preco: 35, custo: 22 }],
        ['adubo', { nome: 'Adubo NPK 10-10-10', secao: 'fisicos', categoria: 'Adubo', quantidade: 0, unidade: 'kg', minimo: 5, preco: 25, custo: 18.5 }],
      ];
      for (const [id, d] of itens) await db.collection('itens').doc(id).set(d);
      const pags = ['pix', 'dinheiro', 'debito', 'credito'];
      const agora = new Date();
      for (let i = 1; i <= 24; i++) {
        const em = new Date(agora); em.setDate(em.getDate() - (i % 12)); em.setHours(8 + (i * 5) % 11, 10, 0, 0);
        if (em > agora) em.setDate(em.getDate() - 1);
        const total = 40 + ((i * 37) % 160);
        await db.collection('vendas').doc('ex' + i).set({ em: em.toISOString(), itens: [{ itemId: 'rosa', nome: 'Rosa vermelha', unidade: 'haste', qtd: 3, preco: total / 3, custo: 3, subtotal: total }], subtotal: total, desconto: 0, total, custoTotal: 9, pagamento: pags[i % 4], cliente: '', por: 'u_teste', cancelada: false });
      }
    });
    await p.evaluate(() => { location.hash = 'vendas'; }); await p.waitForTimeout(300);

    // Monta uma venda: 2 rosas + 1 orquídea + item avulso, com desconto
    await p.click('[data-add="rosa"]'); await p.click('[data-add="rosa"]'); await p.click('[data-add="orq"]');
    confere(await p.isDisabled('[data-add="adubo"]'), 'produto zerado deveria estar desativado');
    await p.click('#btnAvulso'); await p.fill('#aNome', 'Taxa de entrega'); await p.fill('#aPreco', '10'); await p.press('#aNome', 'Enter');
    await p.fill('#vDesconto', '5.9');
    await p.click('.pagamentos label:has(input[value="credito"])');
    const total = await p.textContent('#vTotal');
    confere(total.replace(/\s/g, ' ').includes('150,00'), 'total esperado R$ 150,00, veio ' + total);
    if (n === 'd') await p.screenshot({ path: path.join(SAIDA, 'venda-montando.png') });
    await p.click('#btnFinalizar'); await p.waitForTimeout(400);

    const estoque = await p.evaluate(async () => {
      const db = await window.claude.use('db');
      return { rosa: (await db.doc('itens/rosa').get()).data().quantidade, orq: (await db.doc('itens/orq').get()).data().quantidade };
    });
    confere(estoque.rosa === 38 && estoque.orq === 5, 'baixa no estoque errada: ' + JSON.stringify(estoque));

    // Tentar vender mais vasos do que há
    await p.click('[data-add="vaso"]'); await p.click('[data-add="vaso"]'); await p.click('[data-add="vaso"]');
    const vasoQtd = await p.inputValue('#vCarrinho input[data-campo="qtd"]');
    confere(vasoQtd === '2', 'deveria travar em 2 vasos, ficou ' + vasoQtd);
    await p.click('[data-rm]');

    // Cancelar a venda de hoje devolve ao estoque
    const cancelar = await p.$('#vHoje [data-cancelar]:not([data-cancelar^="ex"])');
    if (cancelar) {
      await cancelar.click(); await p.click('#btnCancelarVenda'); await p.waitForTimeout(400);
      const r = await p.evaluate(async () => (await (await window.claude.use('db')).doc('itens/rosa').get()).data().quantidade);
      confere(r === 40, 'cancelamento deveria devolver as rosas, ficou ' + r);
    } else falhas.push('venda de hoje não apareceu na lista');
    await p.screenshot({ path: path.join(SAIDA, `vendas-${n}.png`), fullPage: n === 'd' });

    // Faturamento: mês, com o gráfico
    await p.evaluate(() => { location.hash = 'faturamento'; }); await p.waitForTimeout(300);
    await p.click('.periodos [data-periodo="mes"]'); await p.waitForTimeout(300);
    const barras = await p.$$eval('#fGraf .barra', (els) => els.length);
    confere(barras > 0, 'gráfico do mês sem barras');
    const alvo = await p.$('#fGraf .alvo');
    if (alvo && n === 'd') { const bb = await alvo.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height - 4); }
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(SAIDA, `faturamento-${n}.png`), fullPage: true });
    const largura = await p.evaluate(() => document.documentElement.scrollWidth);
    confere(largura <= vp.width, `${n}: página mais larga que a tela (${largura}px)`);
    console.log(n, 'largura', largura, 'barras', barras);
    await p.close();
  }
  await b.close(); fs.unlinkSync(TESTE);
  console.log('erros', erros);
  console.log(falhas.length ? 'FALHAS:\n- ' + falhas.join('\n- ') : 'tudo certo');
})();
