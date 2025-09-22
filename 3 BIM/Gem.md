Olá\! Com certeza posso te ajudar a se preparar para a sua prova sobre APIs REST com Node.js. A melhor forma de aprender é colocando a mão na massa, então vamos criar um projeto passo a passo, cobrindo todos os tópicos que o seu professor vai cobrar.

Vamos estruturar nosso aprendizado da seguinte forma:

1.  **O que é uma API REST?** (Uma breve e essencial teoria)
2.  **Configurando o Ambiente** (O que você precisa ter instalado)
3.  **Criando nosso Servidor com Express** (O esqueleto da nossa API)
4.  **Rotas: As URLs da nossa API** (Os caminhos para nossas funcionalidades)
5.  **CRUD em Arquivo JSON** (As quatro operações básicas: Criar, Ler, Atualizar e Deletar)
6.  **Autenticação com JWT** (Protegendo nossas rotas)
7.  **Integração com Firebase** (Usando um banco de dados de verdade)

Vamos começar\!

-----

### 1\. O que é uma API REST?

Imagine que você está em um restaurante. Você (o *cliente*) não vai até a cozinha (o *servidor*) para pegar sua comida. Você chama o garçom (a *API*), faz um pedido (uma *requisição*) e ele te traz o prato (a *resposta*).

Uma **API** (Interface de Programação de Aplicações) é esse intermediário que permite que diferentes sistemas conversem entre si. **REST** (Representational State Transfer) é um conjunto de regras e padrões para construir essas APIs de forma organizada e previsível, usando os métodos do protocolo HTTP que você já conhece:

  * **GET**: Para buscar dados (Ex: Ler o cardápio).
  * **POST**: Para criar um novo dado (Ex: Fazer um novo pedido).
  * **PUT** ou **PATCH**: Para atualizar um dado existente (Ex: Mudar o ponto da carne).
  * **DELETE**: Para remover um dado (Ex: Cancelar um item do pedido).

-----

### 2\. Configurando o Ambiente

Antes de tudo, você precisa ter o **Node.js** instalado no seu computador. Para verificar se já tem, abra o terminal e digite:

```bash
node -v
```

Se aparecer a versão, ótimo\! Se não, baixe e instale a partir do [site oficial do Node.js](https://nodejs.org/).

Agora, crie uma pasta para o nosso projeto e inicie um projeto Node.js nela:

```bash
mkdir minha-api-rest
cd minha-api-rest
npm init -y
```

O comando `npm init -y` cria um arquivo `package.json`, que gerencia as dependências do nosso projeto.

-----

### 3\. Criando nosso Servidor com Express

O **Express** é um framework para Node.js que simplifica muito a criação de servidores web e APIs. Vamos instalá-lo:

```bash
npm install express
```

Agora, crie um arquivo chamado `index.js` e adicione o seguinte código para criar um servidor básico:

```javascript
// index.js

const express = require('express'); // Importa o Express
const app = express(); // Inicia o Express
const port = 3000; // Define a porta que vamos usar

// Middleware para o Express entender JSON
app.use(express.json());

// Uma rota de teste inicial
app.get('/', (req, res) => {
  res.send('Olá! Minha API está funcionando!');
});

// Inicia o servidor para "ouvir" na porta definida
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

Para rodar sua API, vá ao terminal e execute:

```bash
node index.js
```

Se você acessar `http://localhost:3000` no seu navegador, verá a mensagem "Olá\! Minha API está funcionando\!".

-----

### 4\. Rotas: As URLs da nossa API

As rotas definem os endpoints (as URLs) da nossa API. Por exemplo, para gerenciar "produtos", poderíamos ter as seguintes rotas:

  * `GET /produtos`: Listar todos os produtos.
  * `GET /produtos/123`: Buscar o produto com o ID 123.
  * `POST /produtos`: Criar um novo produto.
  * `PUT /produtos/123`: Atualizar o produto com o ID 123.
  * `DELETE /produtos/123`: Deletar o produto com o ID 123.

Para organizar nosso código, vamos criar um arquivo de rotas separado. Crie um arquivo chamado `produtos.js` na mesma pasta.

-----

### 5\. CRUD em Arquivo JSON

Primeiro, vamos instalar um pacote para gerar IDs únicos:

```bash
npm install uuid
```

Agora, crie um arquivo chamado `db.json` para simular nosso banco de dados:

```json
// db.json
{
  "produtos": [
    {
      "id": "1",
      "nome": "Notebook",
      "preco": 3500.50
    },
    {
      "id": "2",
      "nome": "Mouse sem fio",
      "preco": 89.90
    }
  ]
}
```

Agora, vamos implementar o CRUD no nosso arquivo `produtos.js`:

```javascript
// produtos.js

const express = require('express');
const router = express.Router();
const fs = require('fs'); // Módulo para manipular arquivos
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos

const dbPath = './db.json';

// Função auxiliar para ler os dados do arquivo
const lerDados = () => {
  const dados = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(dados);
};

// Função auxiliar para escrever dados no arquivo
const escreverDados = (dados) => {
  fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2));
};

// Rota para LER todos os produtos (Read - GET)
router.get('/', (req, res) => {
  const dados = lerDados();
  res.json(dados.produtos);
});

// Rota para CRIAR um novo produto (Create - POST)
router.post('/', (req, res) => {
  const dados = lerDados();
  const novoProduto = {
    id: uuidv4(),
    ...req.body
  };
  dados.produtos.push(novoProduto);
  escreverDados(dados);
  res.status(201).json({ mensagem: "Produto criado com sucesso!", produto: novoProduto });
});

// Rota para ATUALIZAR um produto (Update - PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const dados = lerDados();
  const indexProduto = dados.produtos.findIndex(p => p.id === id);

  if (indexProduto === -1) {
    return res.status(404).json({ mensagem: "Produto não encontrado." });
  }

  dados.produtos[indexProduto] = { ...dados.produtos[indexProduto], ...req.body };
  escreverDados(dados);
  res.json({ mensagem: "Produto atualizado com sucesso!", produto: dados.produtos[indexProduto] });
});

// Rota para DELETAR um produto (Delete - DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const dados = lerDados();
  const novosProdutos = dados.produtos.filter(p => p.id !== id);

  if (dados.produtos.length === novosProdutos.length) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
  }

  dados.produtos = novosProdutos;
  escreverDados(dados);
  res.json({ mensagem: "Produto deletado com sucesso." });
});

module.exports = router;
```

Agora, vamos usar essas rotas no nosso `index.js`:

```javascript
// index.js (atualizado)

const express = require('express');
const app = express();
const port = 3000;

// Importa as rotas de produtos
const produtosRouter = require('./produtos');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Olá! Minha API está funcionando!');
});

// Usa o roteador para todas as rotas que começam com /produtos
app.use('/produtos', produtosRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

Agora você pode usar ferramentas como o **Insomnia** ou **Postman** para testar sua API fazendo requisições GET, POST, PUT e DELETE para `http://localhost:3000/produtos`.

-----

### 6\. Autenticação com JWT (JSON Web Token)

Para proteger nossas rotas (por exemplo, só permitir que usuários logados possam criar ou deletar produtos), usamos autenticação. O JWT é um padrão popular para isso.

Primeiro, instale as bibliotecas necessárias:

```bash
npm install jsonwebtoken
```

**Como funciona o JWT?**

1.  O usuário envia login e senha.
2.  O servidor verifica se estão corretos.
3.  Se sim, o servidor gera um **Token JWT** (uma string longa e codificada) que contém informações do usuário (como o ID) e o assina com uma "chave secreta".
4.  O servidor envia esse token de volta para o usuário.
5.  Para cada requisição a uma rota protegida, o usuário deve enviar esse token no cabeçalho (Header) da requisição.
6.  O servidor verifica se o token é válido usando a chave secreta. Se for, ele permite o acesso.

Vamos criar uma rota de login e um *middleware* de verificação.

**Crie um arquivo `auth.js`:**

```javascript
// auth.js

const jwt = require('jsonwebtoken');
const CHAVE_SECRETA = "sua_chave_super_secreta"; // Em um projeto real, isso estaria em variáveis de ambiente

// Rota de Login (simulada)
const login = (req, res) => {
  // Em um caso real, você validaria o usuário e senha com um banco de dados
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '123') {
    const idUsuario = 1; // ID vindo do banco de dados
    const token = jwt.sign({ id: idUsuario }, CHAVE_SECRETA, {
      expiresIn: 300 // Token expira em 5 minutos
    });
    return res.json({ auth: true, token: token });
  }
  res.status(401).json({ mensagem: 'Login inválido!' });
};

// Middleware para verificar o Token
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, mensagem: 'Nenhum token fornecido.' });

  // O token geralmente vem como "Bearer TOKEN_STRING"
  const tokenValue = token.split(' ')[1];

  jwt.verify(tokenValue, CHAVE_SECRETA, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, mensagem: 'Falha ao autenticar o token.' });
    
    // Se tudo estiver ok, salva o id do usuário na requisição para uso futuro
    req.userId = decoded.id;
    next(); // Continua para a próxima função (a rota em si)
  });
}

module.exports = {
    login,
    verificarToken
};
```

**Atualize o `index.js` e o `produtos.js`:**

```javascript
// index.js (atualizado)
// ... (código anterior)
const { login, verificarToken } = require('./auth');

// ... (código anterior)

// Rota de login pública
app.post('/login', login);

// Usa o roteador de produtos, protegido pelo middleware de verificação de token
app.use('/produtos', verificarToken, produtosRouter);

// ... (código do listen)
```

Agora, para acessar qualquer rota em `/produtos`, você precisa primeiro fazer um POST para `/login` com o corpo `{"usuario": "admin", "senha": "123"}` para obter um token. Depois, em cada requisição para `/produtos`, você deve incluir um Header chamado `Authorization` com o valor `Bearer [seu_token_aqui]`.

-----

### 7\. Integração com Firebase

Usar um arquivo JSON é bom para aprender, mas não para produção. O Firebase (especificamente o Firestore) é um banco de dados NoSQL da Google que é fácil de integrar.

1.  **Crie um projeto no [Firebase](https://firebase.google.com/)**.

2.  No painel do seu projeto, vá em "Configurações do Projeto" \> "Contas de serviço".

3.  Clique em "Gerar nova chave privada". Isso fará o download de um arquivo JSON com suas credenciais. **Guarde-o com segurança\!**

4.  No seu projeto, instale a biblioteca do Firebase Admin:

    ```bash
    npm install firebase-admin
    ```

**Crie um arquivo de configuração `firebaseConfig.js`:**

```javascript
// firebaseConfig.js
const admin = require('firebase-admin');

// Coloque aqui o conteúdo do arquivo JSON que você baixou
const serviceAccount = require('./caminho-para-seu-arquivo-de-credenciais.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
```

**Agora, vamos criar um novo arquivo de rotas, `produtosFirebase.js`, usando o Firestore:**

```javascript
// produtosFirebase.js

const express = require('express');
const router = express.Router();
const db = require('./firebaseConfig'); // Importa a configuração do banco

// Rota para CRIAR um novo produto (Create - POST)
router.post('/', async (req, res) => {
  try {
    const produto = {
      nome: req.body.nome,
      preco: req.body.preco
    };
    const docRef = await db.collection('produtos').add(produto);
    res.status(201).json({ id: docRef.id, ...produto });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para LER todos os produtos (Read - GET)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('produtos').get();
    const produtos = [];
    snapshot.forEach(doc => {
      produtos.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para ATUALIZAR um produto (Update - PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produtoData = req.body;
        const produtoRef = db.collection('produtos').doc(id);
        await produtoRef.update(produtoData);
        res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Rota para DELETAR um produto (Delete - DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('produtos').doc(id).delete();
        res.status(200).json({ mensagem: "Produto deletado com sucesso!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;
```

Finalmente, você pode adicionar essa nova rota ao seu `index.js`, talvez com um prefixo diferente para não conflitar com a rota de arquivo JSON, por exemplo `/produtos-db`.

-----

### Resumo para a Prova

  * **API REST**: Um padrão de arquitetura para comunicação entre sistemas usando HTTP.
  * **Node.js**: Ambiente para executar JavaScript no servidor.
  * **Express**: Framework para criar o servidor e gerenciar rotas de forma simples.
      * `app.get()`, `app.post()`, `app.put()`, `app.delete()`: Definem as rotas e o que elas fazem.
      * `req` (request): Objeto com os dados da requisição (parâmetros, corpo, cabeçalhos).
      * `res` (response): Objeto para enviar a resposta ao cliente (`res.send()`, `res.json()`, `res.status()`).
  * **CRUD**: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).
  * **Salvar em JSON**: Use o módulo `fs` (File System) do Node.js com `fs.readFileSync` e `fs.writeFileSync`.
  * **Autenticação JWT**:
      * Crie uma rota `/login` que gera um token com `jwt.sign()`.
      * Crie um *middleware* para proteger as rotas.
      * O middleware usa `jwt.verify()` para validar o token enviado no cabeçalho `Authorization`.
  * **Firebase (Firestore)**:
      * Use o pacote `firebase-admin`.
      * Configure com suas credenciais.
      * Use `db.collection('nomeDaColecao')` para acessar os dados.
      * Métodos como `.add()`, `.get()`, `.doc(id).update()`, `.doc(id).delete()` para manipular os dados.

Estude cada um desses blocos de código, tente modificá-los e, principalmente, entenda o fluxo de uma requisição desde o momento que ela chega na sua API até o momento em que a resposta é enviada.

Boa sorte na prova\! Você está no caminho certo.















Excelente observação! Essa informação muda bastante a forma como você deve se preparar. Se o professor vai fornecer um código-base, sua tarefa principal não será criar tudo do zero, mas sim **ler, entender, depurar e, possivelmente, estender um código já existente**.

Isso é, na verdade, muito mais parecido com o trabalho de um desenvolvedor no dia a dia.

Com base nisso, aqui estão os pontos **cruciais** que você precisa dominar para se sair bem na prova. Eles complementam o que já vimos.

---

### 1. Leitura e Interpretação de Código

O seu maior desafio será entender a lógica de outra pessoa. Ao abrir o projeto, faça um "mapa mental" respondendo às seguintes perguntas:

* **Qual é o arquivo de entrada?** Procure no `package.json`, na seção `"scripts"`, por comandos como `"start"` ou `"dev"`. Eles geralmente apontam para o arquivo principal (ex: `node index.js` ou `nodemon server.js`).
* **Como as pastas estão organizadas?** Um bom projeto geralmente separa as responsabilidades. Procure por pastas como:
    * `routes/` ou `api/`: Onde ficam os arquivos que definem as rotas (os endpoints).
    * `controllers/`: Onde fica a lógica de cada rota (o que fazer quando um endpoint é chamado).
    * `middlewares/`: Onde ficam os middlewares, como o `verificarToken` que criamos.
    * `models/` ou `db/`: Onde pode estar a definição dos dados ou a configuração da conexão com o banco.
    * `config/`: Arquivos de configuração, como a conexão com o Firebase.
* **Siga o Fluxo de uma Requisição:** Escolha uma rota (ex: `GET /produtos`) e siga seu caminho pelo código. Comece no arquivo de rotas, veja qual função do *controller* ela chama, e o que essa função faz para obter e retornar os dados.

### 2. O `package.json` é o seu Guia

Este arquivo é o coração do projeto. Olhe para ele com atenção:

* **`"dependencies"`:** Lista todas as bibliotecas que o projeto usa. Se você vir `jsonwebtoken`, já sabe que tem autenticação JWT. Se vir `firebase-admin`, sabe que ele se conecta ao Firebase. Se vir `dotenv`, ele usa variáveis de ambiente.
* **`"scripts"`:** Mostra como rodar o projeto. O comando `npm start` ou `npm run dev` será seu ponto de partida.

### 3. Variáveis de Ambiente (`.env`)

**ISSO É MUITO IMPORTANTE!** Nenhum bom desenvolvedor coloca senhas, chaves de API ou strings secretas do JWT diretamente no código. Eles usam variáveis de ambiente.

* Procure por um arquivo chamado `.env.example` ou `.env.sample`.
* Este arquivo é um modelo. Você precisará **criar uma cópia dele e renomeá-la para `.env`**.
* Dentro do arquivo `.env`, você preencherá os valores que faltam (ex: `JWT_SECRET=minha_chave_secreta`, `PORT=3000`, etc.).
* O código provavelmente usará uma biblioteca chamada `dotenv` (verifique no `package.json`) para carregar essas variáveis.

Se você não criar e configurar o arquivo `.env`, o projeto **não vai funcionar**.

### 4. Debugging (Depuração)

O código pode não rodar de primeira. Você vai precisar encontrar os erros. A ferramenta mais simples e poderosa é o `console.log()`.

* **Não sabe o que está dentro de uma variável?** `console.log(minhaVariavel);`
* **Quer saber se uma parte do código está sendo executada?** `console.log('Cheguei aqui na função X');`
* **Quer ver o que está vindo na requisição?** Dentro de uma rota, use `console.log('Corpo da requisição:', req.body);` ou `console.log('Parâmetros da rota:', req.params);`.

Coloque `console.log` em pontos estratégicos para rastrear o fluxo dos dados e descobrir onde as coisas estão quebrando.

### 5. Dominar sua Ferramenta de Teste (Insomnia/Postman)

Você precisa ser ágil para testar a API. Certifique-se de que sabe:

* Criar requisições dos tipos GET, POST, PUT e DELETE.
* Enviar dados no corpo (`Body`) de uma requisição em formato JSON.
* Enviar parâmetros na URL (ex: `/produtos/12345`).
* **Configurar Headers (Cabeçalhos):** Isso é fundamental para enviar o token JWT. Você precisará adicionar um header `Authorization` com o valor `Bearer [token]`.

### 6. Entender JavaScript Assíncrono (`async/await`)

Qualquer operação de banco de dados (como as do Firebase) ou de leitura de arquivos é **assíncrona**. O código do seu professor certamente usará `async/await`.

* **`async`**: Declara que uma função vai realizar operações assíncronas.
* **`await`**: Pausa a execução da função `async` até que a operação (a `Promise`) seja resolvida. Ela só pode ser usada dentro de uma função `async`.

Se você vir `await db.collection('...').get()`, entenda que o código está dizendo: "Espere o Firebase me devolver os dados antes de continuar para a próxima linha".

---

### Plano de Estudo Prático para o seu Cenário

1.  **Encontre um Projeto Simples:** Vá ao GitHub e procure por "node express jwt crud api example". Encontre um que pareça bem estruturado.
2.  **Clone o Repositório:** Use o comando `git clone [URL_do_repositorio]`.
3.  **Aja como se fosse a Prova:**
    * Abra o `package.json`. Veja os scripts e as dependências.
    * Rode `npm install` para instalar tudo.
    * Procure por um `.env.example`. Crie seu arquivo `.env` e preencha os valores.
    * Tente rodar o projeto com `npm start` ou `npm run dev`.
    * Abra o Insomnia/Postman e tente usar a API. Leia o código para descobrir quais são as rotas disponíveis.
4.  **Adicione uma Pequena Funcionalidade:** Tente adicionar um novo campo a um dos itens (ex: adicionar um campo "estoque" a um produto). Você terá que encontrar a rota de criação (POST) e atualização (PUT) e modificar o controller para lidar com esse novo campo.

Se você conseguir fazer esse exercício com um projeto desconhecido, estará muito mais preparado para fazer o mesmo com o projeto do seu professor. Boa sorte!
