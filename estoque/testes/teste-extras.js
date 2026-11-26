/*
 * Teste das melhorias da revisão de UI/UX (banco falso, não mexe nos dados reais):
 * vírgula nos números, erro embaixo do campo, aviso antes de descartar, "Desfazer",
 * ordenação da tabela, contador de itens em falta, atalho "/" e planilhas CSV.
 *
 * Como rodar:  node estoque/testes/teste-extras.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const PAGINA = path.join(__dirname, '..', 'index.html');
const fonte = fs.readFileSync(path.join(__dirname, 'teste-local.js'), 'utf8');
const mock = fonte.slice(fonte.indexOf('const mock = `') + 14, fonte.indexOf('`;\n(async'));
// Planilhas: guarda o arquivo "baixado" para conferir o conteúdo
const mockDownloads = `
  const usoOriginal = window.claude.use;
  window.__arquivos = [];
  window.claude.use = async (n) => n === 'downloads' ? { save: async (r) => { window.__arquivos.push(r); return { status: 'saved' }; } } : usoOriginal(n);`;
const TESTE = path.join(__dirname, '..', '_teste-extras.html');

(async () => {
  fs.writeFileSync(TESTE, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>' + mock + mockDownloads + '</script>' + fs.readFileSync(PAGINA, 'utf8') + '</body></html>');
  const b = await chromium.launch(); const erros = [], falhas = [];
  const confere = (c, m) => { if (!c) falhas.push(m); };
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('file://' + TESTE); await p.waitForTimeout(400);
  const dados = (id) => p.evaluate(async (i) => (await (await window.claude.use('db')).doc('itens/' + i).get()).data(), id);

  // 1. Vírgula nos números e erro embaixo do campo
  await p.click('#btnNovo');
  await p.fill('#fNome', 'Rosa colombiana'); await p.fill('#fQtd', '12,5'); await p.fill('#fMin', '3'); await p.fill('#fCusto', 'abc');
  await p.press('#fNome', 'Enter'); await p.waitForTimeout(150);
  confere(await p.isVisible('#fCusto-erro'), 'erro do custo inválido não apareceu embaixo do campo');
  confere((await p.getAttribute('#fCusto', 'aria-invalid')) === 'true', 'campo inválido sem aria-invalid');
  confere((await p.evaluate(() => document.activeElement.id)) === 'fCusto', 'foco não foi para o campo com erro');
  await p.fill('#fCusto', '4,90');
  confere(!(await p.isVisible('#fCusto-erro')), 'erro não sumiu depois de corrigir');
  await p.fill('#fPreco', '1.234,50');
  await p.press('#fNome', 'Enter'); await p.waitForTimeout(250);
  const id = await p.evaluate(async () => { const s = await new Promise((r) => (window.__dbFalso.collection('itens').onSnapshot(r))); return s.docs[0].id; });
  const d1 = await dados(id);
  confere(d1.quantidade === 12.5 && d1.custo === 4.9 && d1.preco === 1234.5, 'vírgula não foi entendida: ' + JSON.stringify(d1));

  // 2. Aviso antes de descartar o que foi digitado
  await p.click('#btnNovo'); await p.fill('#fNome', 'Rascunho');
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  confere(await p.isVisible('#itemDescarte') && await p.evaluate(() => document.querySelector('#dlgItem').open), 'Esc fechou sem perguntar');
  await p.click('#btnDescartar'); await p.waitForTimeout(100);
  confere(!(await p.evaluate(() => document.querySelector('#dlgItem').open)), 'Descartar não fechou a janela');
  await p.click('#btnNovo'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  confere(!(await p.evaluate(() => document.querySelector('#dlgItem').open)), 'janela sem alterações deveria fechar direto');

  // 3. "Desfazer" depois do botão −
  await p.click(`[data-rapido="saida"][data-id="${id}"]`); await p.waitForTimeout(250);
  confere((await dados(id)).quantidade === 11.5, 'saída rápida não baixou 1');
  confere(await p.isVisible('#toast button'), 'aviso sem botão Desfazer');
  await p.click('#toast button'); await p.waitForTimeout(300);
  confere((await dados(id)).quantidade === 12.5, 'Desfazer não devolveu a quantidade');

  // 3b. Histórico: ícone, texto e quantidade lado a lado, sem nada embolado
  const hist = await p.evaluate(() => {
    const li = document.querySelector('#historico li'); if (!li) return null;
    const [ic, txt, q] = [...li.children];
    return { fixo: getComputedStyle(ic).position, larguraTexto: txt.getBoundingClientRect().width, qtdDireita: q.getBoundingClientRect().left > txt.getBoundingClientRect().left };
  });
  confere(hist && hist.fixo === 'static' && hist.larguraTexto > 150 && hist.qtdDireita, 'histórico embolado: ' + JSON.stringify(hist));

  // 4. Contador de itens em falta e ordenação
  await p.evaluate(async () => { const db = await window.claude.use('db'); await db.collection('itens').doc('z').set({ nome: 'Antúrio', secao: 'fisicos', quantidade: 0, minimo: 2, unidade: 'un' }); });
  await p.waitForTimeout(200);
  confere((await p.textContent('#seloAlerta')).trim() === '1' && await p.isVisible('#seloAlerta'), 'contador de itens em falta errado');
  confere((await p.$$eval('#lista tr', (t) => t.map((r) => r.querySelector('.item-link').textContent)))[0] === 'Antúrio', 'zerado deveria vir primeiro');
  await p.click('[data-ordenar="nome"]'); await p.waitForTimeout(100);
  confere((await p.getAttribute('th[data-ord="nome"]', 'aria-sort')) === 'ascending', 'ordenação sem aria-sort');
  await p.click('[data-ordenar="nome"]'); await p.waitForTimeout(100);
  confere((await p.$$eval('#lista tr', (t) => t.map((r) => r.querySelector('.item-link').textContent)))[0] === 'Rosa colombiana', 'ordem por nome invertida não funcionou');

  // 5. Atalho "/" foca a busca
  await p.click('h1'); await p.keyboard.press('/');
  confere((await p.evaluate(() => document.activeElement.id)) === 'busca', 'atalho / não focou a busca');

  // 6. Planilha do estoque
  await p.click('#btnCsvEstoque'); await p.waitForTimeout(150);
  const arq = await p.evaluate(() => window.__arquivos[0]);
  confere(arq && /estoque-bela-.*\.csv$/.test(arq.filename), 'nome da planilha errado');
  confere(arq && arq.data.includes('Rosa colombiana') && arq.data.includes('12,5') && arq.data.split('\r\n')[0].includes('Quantidade'), 'conteúdo da planilha errado');

  // 7. Venda com desconto digitado com vírgula
  await p.evaluate(() => { location.hash = 'vendas'; }); await p.waitForTimeout(200);
  await p.click(`[data-add="${id}"]`); await p.fill('#vDesconto', '2,50'); await p.waitForTimeout(100);
  confere((await p.textContent('#vTotal')).replace(/\s/g, ' ').includes('1.232,00'), 'desconto com vírgula errado: ' + await p.textContent('#vTotal'));
  await p.fill('#vDesconto', ''); await p.click('[data-rm]');
  await p.click('#btnFinalizar'); await p.waitForTimeout(100);
  confere(await p.isVisible('#vErro'), 'finalizar sem itens deveria explicar o que falta');

  await b.close(); fs.unlinkSync(TESTE);
  console.log('erros', erros);
  console.log(falhas.length ? 'FALHAS:\n- ' + falhas.join('\n- ') : 'tudo certo');
})();
