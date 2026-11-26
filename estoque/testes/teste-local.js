/*
 * Teste local do controle de estoque, sem tocar no banco de verdade.
 * Abre a página com um banco falso em memória, cadastra categorias e itens,
 * faz movimentações e tira capturas em computador, celular e com animações desligadas.
 *
 * Como rodar (precisa de Node.js e Playwright):  node estoque/testes/teste-local.js
 * Capturas e resultado ficam em estoque/testes/saida/ (fora do Git).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const PAGINA = path.join(__dirname, '..', 'index.html');
const SAIDA = path.join(__dirname, 'saida');
fs.mkdirSync(SAIDA, { recursive: true });
// Banco falso em memória só para o teste local
const mock = `
window.claude = { use: async (n) => {
  if (n === 'user') return { id: async () => 'u_teste', can: async () => true, profiles: async (ids) => Object.fromEntries([].concat(ids).map(i => [i, {name: 'Você'}])) };
  if (n !== 'db') return null;
  if (window.__dbFalso) return window.__dbFalso;
  const store = {}; const subs = [];
  const notify = () => subs.forEach(f => f());
  const snapDoc = (p) => ({ id: p.split('/').pop(), exists: p in store, data: () => store[p], metadata: {fromCache:false} });
  const docRef = (p) => ({ id: p.split('/').pop(), path: p,
    get: async () => snapDoc(p),
    set: async (d) => { store[p] = JSON.parse(JSON.stringify(d)); notify(); },
    update: async (d) => { if (!(p in store)) throw {code:'invalid_argument'}; store[p] = {...store[p], ...d}; notify(); },
    delete: async () => { delete store[p]; notify(); },
    onSnapshot: (fn) => { const f = () => fn(snapDoc(p)); subs.push(f); setTimeout(f, 50); return () => {}; } });
  const coll = (c, ord, lim) => ({ path: c,
    doc: (id) => docRef(c + '/' + (id || Math.random().toString(36).slice(2))),
    add: async (d) => { const r = docRef(c + '/' + Math.random().toString(36).slice(2)); await r.set(d); return r; },
    orderBy: (f, dir) => coll(c, [f, dir], lim), limit: (n) => coll(c, ord, n),
    onSnapshot: (fn) => { const f = () => { let docs = Object.keys(store).filter(k => k.startsWith(c + '/') && k.split('/').length === c.split('/').length + 1).map(snapDoc);
      if (ord) docs.sort((a, b) => (a.data()[ord[0]] > b.data()[ord[0]] ? 1 : -1) * (ord[1] === 'desc' ? -1 : 1));
      if (lim) docs = docs.slice(0, lim); fn({ docs, size: docs.length, empty: !docs.length, metadata: {fromCache:false} }); };
      subs.push(f); setTimeout(f, 50); return () => {}; } });
  return (window.__dbFalso = { doc: docRef, collection: (c) => coll(c) });
}};`;
(async () => {
  let html = fs.readFileSync(PAGINA, 'utf8');
  html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + '<script>' + mock + '</script>' + html + '</body></html>';
  const TESTE = path.join(__dirname, '..', '_teste.html');
  fs.writeFileSync(TESTE, html);
  const b = await chromium.launch(); const errs = [];
  for (const [n, vp, extra] of [['d', { width: 1280, height: 800 }, {}], ['m', { width: 375, height: 812 }, { hasTouch: true, isMobile: true }], ['r', { width: 1440, height: 900 }, { reducedMotion: 'reduce' }]]) {
    const p = await b.newPage({ viewport: vp, ...extra });
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto('file://' + TESTE); await p.waitForTimeout(400);
    if (true) {
      // categorias
      await p.click('#btnCats');
      for (const c of ['Adubo', 'Fertilizante', 'Vasos']) { await p.fill('#catNova', c); await p.click('#formCat button[type=submit]'); await p.waitForTimeout(80); }
      await p.click('#dlgCat [data-fechar]');
      // itens
      const itens = [['Adubo NPK 10-10-10', 'Adubo', '3', 'kg', '5', '18.5'], ['Vaso cerâmica nº 14', 'Vasos', '0', 'un', '4', '22'], ['Fertilizante líquido', 'Fertilizante', '12', 'L', '3', '15']];
      for (const [nome, cat, q, un, min, custo] of itens) {
        await p.click('#btnNovo'); await p.fill('#fNome', nome); await p.selectOption('#fCat', cat); await p.fill('#fQtd', q);
        await p.selectOption('#fUn', un); await p.fill('#fMin', min); await p.fill('#fCusto', custo); await p.press('#fNome', 'Enter'); await p.waitForTimeout(150);
      }
      await p.click('[data-rapido="saida"]'); await p.waitForTimeout(150);
      await p.click('[data-mov]'); await p.click('#formMov label:nth-child(3)'); await p.fill('#mQtd', '2'); await p.fill('#mMotivo', 'Embalagem rasgada');
      if (n === 'd') await p.screenshot({ path: path.join(SAIDA, 'movimentacao.png') });
      await p.press('#mMotivo', 'Enter'); await p.waitForTimeout(300);
      fs.writeFileSync(path.join(SAIDA, 'lista.json'), JSON.stringify(await p.evaluate(() => document.querySelector('#lista').innerText)));
    }
    await p.screenshot({ path: path.join(SAIDA, `tela-${n}.png`), fullPage: n === 'd' });
    console.log(n, await p.evaluate(() => [document.documentElement.scrollWidth, getComputedStyle(document.querySelector('.ic') || document.body).width, getComputedStyle(document.body, '::after').animationName]));
  }
  console.log('erros', errs); await b.close(); fs.unlinkSync(TESTE);
})();
