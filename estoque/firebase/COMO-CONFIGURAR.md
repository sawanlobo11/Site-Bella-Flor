# Como ligar o sistema ao Firebase (uma vez só)

Isso faz o estoque e as vendas funcionarem no celular **sem conta do Claude**, com login por e-mail e senha. Leva uns 10 minutos. O Firebase é do Google e é gratuito para o tamanho da loja.

## 1. Criar o projeto

1. Abra **console.firebase.google.com** e entre com uma conta Google (pode ser a da loja).
2. Toque em **Criar um projeto** (ou "Adicionar projeto"). Nome: `floricultura-bela`. Pode desligar o Google Analytics. Toque em **Criar projeto**.

## 2. Ligar o login por e-mail e senha

1. No menu da esquerda: **Criação** (ou "Build"), depois **Authentication**, depois **Vamos começar**.
2. Na aba **Método de login**, escolha **E-mail/senha**, ligue a primeira chave e toque em **Salvar**.

## 3. Criar o banco de dados

1. No menu: **Criação**, depois **Firestore Database**, depois **Criar banco de dados**.
2. Local: **southamerica-east1 (São Paulo)**. Escolha **Iniciar no modo de produção** e toque em **Criar**.
3. Abra a aba **Regras**, apague tudo que estiver lá, cole o conteúdo inteiro do arquivo `estoque/firebase/firestore.rules` e toque em **Publicar**.

## 4. Pegar o código de configuração

1. Toque na engrenagem ao lado de "Visão geral do projeto", depois **Configurações do projeto**.
2. Em **Seus apps**, toque no ícone **</>** (Web). Apelido: `Bela`. Não marque o Hosting. Toque em **Registrar app**.
3. Vai aparecer um bloco parecido com este:

   ```
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "floricultura-bela.firebaseapp.com",
     projectId: "floricultura-bela",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

4. **Copie esse bloco e mande para o Claude.** Esses dados podem ficar públicos: quem protege as informações da loja são as regras do passo 3 e o login.

## 5. Liberar o domínio do site no login

1. Em **Authentication**, aba **Configurações**, depois **Domínios autorizados**.
2. Toque em **Adicionar domínio** e coloque `sawanlobo11.github.io`.

## 6. Ligar o GitHub Pages (hospedagem gratuita)

1. No GitHub, abra o repositório **Site-Bella-Flor**, depois **Settings**, depois **Pages**.
2. Em **Source**, escolha **GitHub Actions**.

Pronto. A cada atualização, o GitHub publica sozinho:
- Sistema: **https://sawanlobo11.github.io/Site-Bella-Flor/estoque/**
- Site da loja: **https://sawanlobo11.github.io/Site-Bella-Flor/**

## Primeiro uso

1. Abra o link do sistema, toque em **Primeiro acesso** e crie a sua senha com o seu e-mail.
2. Na tela "Configurar a loja", toque em **Sou o dono, configurar**. Faça isso logo, antes de mandar o link para alguém: quem confirmar primeiro vira o dono.
3. Para liberar um funcionário: **Minha conta** (ícone de pessoa no topo), **Equipe**, nome e e-mail, **Liberar acesso**. A pessoa abre o link, toca em **Primeiro acesso** e cria a própria senha com aquele e-mail.
4. Para tirar o acesso de alguém: **Equipe**, **Tirar acesso**, **Confirmar**.

## Como funciona a segurança

- Sem login, ninguém vê nem altera nada.
- Com login, só entram o dono e os e-mails liberados em **Equipe**. Qualquer outra pessoa que criar senha vê a tela "Acesso ainda não liberado".
- Só o dono libera e tira acesso.
- O histórico mostra quem fez cada movimentação e cada venda.
