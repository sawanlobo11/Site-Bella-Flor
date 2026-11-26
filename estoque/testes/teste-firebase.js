/*
 * Teste da versão fora do Claude (Firebase), com um Firebase falso em memória:
 * login, primeiro acesso, dono configurando a loja, liberação da equipe,
 * funcionário liberado entrando, e-mail não liberado barrado e venda pelo celular.
 * Não usa internet nem o Firebase de verdade.
 *
 * Como rodar:  node estoque/testes/teste-firebase.js
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const PAGINA = path.join(__dirname, '..', 'index.html');
const SAIDA = path.join(__dirname, 'saida');
fs.mkdirSync(SAIDA, { recursive: true });
const fonte = fs.readFileSync(path.join(__dirname, 'teste-local.js'), 'utf8');
const mock = fonte.slice(fonte.indexOf('const mock = `') + 14, fonte.indexOf('`;\n(async'));

// Firebase falso: Firestore reaproveita o banco falso; Auth guarda contas em memória
const firebaseFalso = `
  window.claude.use('db').then((d) => { window.__db = d; });
  delete window.claude;
  window.BELA_FIREBASE = { apiKey: 'teste', projectId: 'bela-teste' };
  (() => {
    const contas = {}, ouvintes = []; let atual = null;
    const avisa = () => ouvintes.forEach((f) => f(atual));
    const sessao = (email) => ({ uid: contas[email].uid, email, get displayName() { return contas[email].nome || null; },
      updateProfile: async ({ displayName }) => { contas[email].nome = displayName; } });
    const auth = {
      onAuthStateChanged(f) { ouvintes.push(f); setTimeout(() => f(atual), 0); },
      async signInWithEmailAndPassword(e, s) { if (!contas[e] || contas[e].senha !== s) throw { code: 'auth/invalid-credential' }; atual = sessao(e); avisa(); return { user: atual }; },
      async createUserWithEmailAndPassword(e, s) {
        if (contas[e]) throw { code: 'auth/email-already-in-use' };
        if (!s || s.length < 6) throw { code: 'auth/weak-password' };
        contas[e] = { uid: 'u_' + e.replace(/\\W/g, ''), senha: s }; atual = sessao(e); setTimeout(avisa, 0); return { user: atual };
      },
      async signOut() { atual = null; },
      async sendPasswordResetEmail() {},
    };
    window.__auth = auth;
    const app = { auth: () => auth, firestore: () => Object.assign({}, window.__db, { enablePersistence: async () => {} }) };
    window.firebase = { apps: [], initializeApp() { this.apps.push(app); return app; }, app() { return app; } };
  })();`;

const TESTE = path.join(__dirname, '..', '_teste-firebase.html');

(async () => {
  fs.writeFileSync(TESTE, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>' + mock + firebaseFalso + '</script>' + fs.readFileSync(PAGINA, 'utf8') + '</body></html>');
  const b = await chromium.launch(); const erros = [], falhas = [];
  const confere = (c, m) => { if (!c) falhas.push(m); };
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => m.type() === 'error' && !/firebase-config|manifest|icone/.test(m.text()) && erros.push(m.text()));
  await p.goto('file://' + TESTE); await p.waitForTimeout(400);

  // 1. Abre na tela de login
  confere(await p.isVisible('#telaEntrada') && await p.isVisible('#lgEmail'), 'tela de login não apareceu');
  await p.screenshot({ path: path.join(SAIDA, 'firebase-login.png') });
  await p.fill('#lgEmail', 'ninguem@bela.com'); await p.fill('#lgSenha', 'errada'); await p.tap('#lgBtn'); await p.waitForTimeout(150);
  confere((await p.textContent('#lgErro')).includes('incorretos'), 'senha errada não avisou');
  await p.tap('[data-ver="lgSenha"]');
  confere((await p.getAttribute('#lgSenha', 'type')) === 'text', 'mostrar senha não funcionou');

  // 2. Dono: primeiro acesso e configuração da loja
  await p.tap('[data-modo="criar"]');
  await p.fill('#lgNome', 'Sawan Lobo'); await p.fill('#lgEmail', 'dono@bela.com'); await p.fill('#lgSenha', '123'); await p.tap('#lgBtn'); await p.waitForTimeout(150);
  confere((await p.textContent('#lgErro')).includes('6 caracteres'), 'senha curta não avisou');
  await p.fill('#lgSenha', 'segredo1'); await p.tap('#lgBtn'); await p.waitForTimeout(300);
  confere(await p.isVisible('#btnSouDono'), 'tela de configurar a loja não apareceu');
  await p.tap('#btnSouDono'); await p.waitForTimeout(500);
  confere(!(await p.isVisible('#telaEntrada')), 'depois de configurar, o sistema não abriu');
  confere(await p.isVisible('#btnConta'), 'botão da conta não apareceu');
  confere((await p.textContent('#chips')).includes('Cachepôs'), 'categorias físicas não foram criadas');

  // 3. Dono libera a funcionária
  await p.tap('#btnConta'); await p.waitForTimeout(150);
  confere(await p.isVisible('#btnEquipe'), 'dono deveria ver o botão Equipe');
  await p.tap('#btnEquipe'); await p.waitForTimeout(150);
  await p.fill('#eqNome', 'Maria'); await p.fill('#eqEmail', 'email-ruim'); await p.tap('#formEquipe button[type=submit]'); await p.waitForTimeout(100);
  confere(await p.isVisible('#eqEmail-erro'), 'e-mail inválido não avisou');
  await p.fill('#eqEmail', 'Maria@Bela.com'); await p.tap('#formEquipe button[type=submit]'); await p.waitForTimeout(300);
  confere((await p.textContent('#equipeLista')).includes('maria@bela.com'), 'funcionária não apareceu na equipe');
  await p.screenshot({ path: path.join(SAIDA, 'firebase-equipe.png') });
  await p.keyboard.press('Escape');

  // 4. Venda pelo celular, gravada no banco (Firebase falso)
  await p.evaluate(async () => { await window.__db.collection('itens').doc('rosa').set({ nome: 'Rosa vermelha', secao: 'organicos', quantidade: 10, unidade: 'haste', minimo: 2, preco: 8, custo: 3 }); });
  await p.evaluate(() => { location.hash = 'vendas'; }); await p.waitForTimeout(250);
  await p.tap('[data-add="rosa"]'); await p.tap('#irVenda'); await p.waitForTimeout(400); await p.tap('#btnFinalizar'); await p.waitForTimeout(500);
  const qtd = await p.evaluate(async () => (await window.__db.doc('itens/rosa').get()).data().quantidade);
  confere(qtd === 9, 'venda no modo Firebase não baixou o estoque: ' + qtd);
  const quem = await p.evaluate(async () => { const s = await new Promise((r) => window.__db.collection('vendas').onSnapshot(r)); return s.docs[0].data().por; });
  confere(quem === 'u_donobelacom', 'venda não guardou quem vendeu: ' + quem);

  // 5. Segunda pessoa no mesmo banco: liberada entra, não liberada é barrada
  await p.evaluate(async () => { await window.__auth.signOut(); });
  // Novas aberturas da página, com o dono e a equipe já cadastrados no banco
  const p2 = await ctx.newPage(); p2.on('pageerror', (e) => erros.push('p2: ' + e.message));
  await p2.goto('file://' + TESTE); await p2.waitForTimeout(300);
  await p2.evaluate(async () => { await window.__db.doc('config/dono').set({ uid: 'u_outro', email: 'dono@bela.com' }); await window.__db.doc('equipe/maria@bela.com').set({ nome: 'Maria', email: 'maria@bela.com' }); });
  await p2.tap('[data-modo="criar"]'); await p2.fill('#lgNome', 'João'); await p2.fill('#lgEmail', 'joao@bela.com'); await p2.fill('#lgSenha', 'senha123'); await p2.tap('#lgBtn'); await p2.waitForTimeout(400);
  confere((await p2.textContent('#entradaCard')).includes('não liberado'), 'e-mail não liberado deveria ser barrado');
  await p2.screenshot({ path: path.join(SAIDA, 'firebase-barrado.png') });
  const p3 = await ctx.newPage(); p3.on('pageerror', (e) => erros.push('p3: ' + e.message));
  await p3.goto('file://' + TESTE); await p3.waitForTimeout(300);
  await p3.evaluate(async () => { await window.__db.doc('config/dono').set({ uid: 'u_outro', email: 'dono@bela.com' }); await window.__db.doc('equipe/maria@bela.com').set({ nome: 'Maria', email: 'maria@bela.com' }); });
  await p3.tap('[data-modo="criar"]'); await p3.fill('#lgNome', 'Maria'); await p3.fill('#lgEmail', 'maria@bela.com'); await p3.fill('#lgSenha', 'senha123'); await p3.tap('#lgBtn'); await p3.waitForTimeout(500);
  confere(!(await p3.isVisible('#telaEntrada')), 'funcionária liberada não conseguiu entrar');
  await p3.tap('#btnConta'); await p3.waitForTimeout(150);
  confere(!(await p3.isVisible('#btnEquipe')), 'funcionária não deveria ver Equipe');
  confere((await p3.textContent('#contaNome')) === 'Maria', 'nome da funcionária errado');

  await b.close(); fs.unlinkSync(TESTE);
  console.log('erros', erros);
  console.log(falhas.length ? 'FALHAS:\n- ' + falhas.join('\n- ') : 'tudo certo');
})();
