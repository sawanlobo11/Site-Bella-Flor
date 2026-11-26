/*
 * Tira capturas de todas as telas e janelas do sistema em vários aparelhos,
 * com um banco falso cheio de dados de exemplo (não mexe nos dados reais).
 *
 * Como rodar:  node estoque/testes/capturas.js
 * Capturas em estoque/testes/saida/capturas/.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const PAGINA = path.join(__dirname, '..', 'index.html');
const SAIDA = path.join(__dirname, 'saida', 'capturas');
fs.mkdirSync(SAIDA, { recursive: true });
const fonte = fs.readFileSync(path.join(__dirname, 'teste-local.js'), 'utf8');
const mock = fonte.slice(fonte.indexOf('const mock = `') + 14, fonte.indexOf('`;\n(async'));
const TESTE = path.join(__dirname, '..', '_capturas.html');

const APARELHOS = {
  iphone: devices['iPhone 13'],
  android: { ...devices['Galaxy S9+'], viewport: { width: 360, height: 740 } },
  desktop: { viewport: { width: 1366, height: 768 } },
};

async function semear(p) {
  await p.evaluate(async () => {
    const db = await window.claude.use('db');
    await db.doc('config/categorias').set({ fisicos: ['Adubo', 'Fertilizante', 'Vasos', 'Ferramentas de jardinagem', 'Cachepôs'], organicos: ['Flores de corte', 'Orquídeas'] });
    const itens = [
      ['rosa', { nome: 'Rosa vermelha', secao: 'organicos', categoria: 'Flores de corte', quantidade: 40, unidade: 'haste', minimo: 10, preco: 8, custo: 3, validade: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10) }],
      ['orq', { nome: 'Orquídea Phalaenopsis branca', secao: 'organicos', categoria: 'Orquídeas', quantidade: 6, unidade: 'vaso', minimo: 2, preco: 129.9, custo: 60 }],
      ['vaso', { nome: 'Vaso cerâmica nº 14', secao: 'fisicos', categoria: 'Vasos', quantidade: 2, unidade: 'un', minimo: 4, preco: 35, custo: 22 }],
      ['adubo', { nome: 'Adubo NPK 10-10-10', secao: 'fisicos', categoria: 'Adubo', quantidade: 0, unidade: 'kg', minimo: 5, preco: 25, custo: 18.5 }],
      ['tesoura', { nome: 'Tesoura de poda profissional', secao: 'fisicos', categoria: 'Ferramentas de jardinagem', quantidade: 7, unidade: 'un', minimo: 2, preco: 59.9, custo: 32 }],
      ['cachepo', { nome: 'Cachepô de palha natural', secao: 'fisicos', categoria: 'Cachepôs', quantidade: 12, unidade: 'un', minimo: 3, preco: 45, custo: 20 }],
    ];
    for (const [id, d] of itens) await db.collection('itens').doc(id).set(d);
    const pags = ['pix', 'dinheiro', 'debito', 'credito'];
    const agora = new Date();
    for (let i = 1; i <= 30; i++) {
      const em = new Date(agora); em.setDate(em.getDate() - (i % 15)); em.setHours(8 + (i * 5) % 11, 10, 0, 0);
      if (em > agora) em.setDate(em.getDate() - 1);
      const total = 40 + ((i * 37) % 160);
      await db.collection('vendas').doc('ex' + i).set({ em: em.toISOString(), itens: [{ itemId: 'rosa', nome: 'Rosa vermelha', unidade: 'haste', qtd: 3, preco: total / 3, custo: 3, subtotal: total }], subtotal: total, desconto: 0, total, custoTotal: 9, pagamento: pags[i % 4], cliente: '', por: 'u_teste', cancelada: false });
      await db.collection('movimentos').add({ itemId: 'rosa', itemNome: 'Rosa vermelha', unidade: 'haste', tipo: 'saida', qtd: 3, saldoApos: 40, motivo: 'Venda #EX' + i, em: em.toISOString(), por: 'u_teste' });
    }
  });
}

(async () => {
  fs.writeFileSync(TESTE, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>' + mock + '</script>' + fs.readFileSync(PAGINA, 'utf8') + '</body></html>');
  const b = await chromium.launch();
  const larguras = [];
  for (const [nome, ap] of Object.entries(process.argv[2] ? { [process.argv[2]]: APARELHOS[process.argv[2]] } : APARELHOS)) {
    const ctx = await b.newContext({ ...ap, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log(nome, 'ERRO', e.message));
    await p.goto('file://' + TESTE); await p.waitForTimeout(300);
    await semear(p); await p.waitForTimeout(300);
    const foto = async (n) => {
      await p.waitForTimeout(450);
      await p.screenshot({ path: path.join(SAIDA, `${nome}-${n}.png`) });
      larguras.push([nome, n, await p.evaluate(() => document.documentElement.scrollWidth), await p.evaluate(() => innerWidth)]);
    };
    await foto('estoque');
    await p.evaluate(() => scrollTo(0, 700)); await foto('estoque-lista');
    await p.click('#btnNovo'); await foto('dlg-item'); await p.keyboard.press('Escape');
    await p.click('[data-mov="vaso"]').catch(() => {}); await foto('dlg-mov'); await p.keyboard.press('Escape');
    await p.evaluate(() => { location.hash = 'vendas'; }); await foto('vendas');
    await p.click('[data-add="rosa"]'); await p.click('[data-add="orq"]'); await foto('vendas-com-itens');
    const ir = await p.$('#irVenda'); if (ir && await ir.isVisible()) { await ir.click(); }
    await foto('vendas-carrinho');
    await p.evaluate(() => { location.hash = 'faturamento'; }); await foto('faturamento');
    await p.click('.periodos [data-periodo="mes"]'); await foto('faturamento-mes');
    await ctx.close();
  }
  await b.close(); fs.unlinkSync(TESTE);
  for (const l of larguras) if (l[2] > l[3]) console.log('LARGURA DEMAIS', l.join(' '));
  console.log('ok', larguras.length, 'capturas');
})();
