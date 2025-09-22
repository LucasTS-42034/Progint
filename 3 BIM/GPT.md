Beleza 🚀
Vou montar um **guia passo a passo** para você entender **API REST com Node.js**, usando **Express**, **CRUD**, **armazenamento em arquivo JSON**, **autenticação JWT**, **rotas** e ainda **Firebase**. Vou explicar e mostrar **exemplos de código** para cada parte.

---

## 1️⃣ Criando o projeto e instalando dependências

No terminal:

```bash
mkdir api-rest-node
cd api-rest-node
npm init -y
npm install express jsonwebtoken bcryptjs firebase-admin
npm install nodemon --save-dev
```

No `package.json` adicione o script para rodar com nodemon:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

---

## 2️⃣ Estrutura básica do projeto

```
api-rest-node/
 ├─ index.js
 ├─ routes/
 │   └─ users.js
 ├─ data/
 │   └─ users.json
 ├─ middleware/
 │   └─ auth.js
 └─ firebase/
     └─ firebase.js
```

---

## 3️⃣ Criando o servidor Express

`index.js`

```js
const express = require('express');
const app = express();

app.use(express.json()); // permitir JSON no body

// Importar rotas
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

---

## 4️⃣ CRUD salvando em arquivo JSON

`data/users.json` (começa vazio):

```json
[]
```

`routes/users.js`

```js
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// caminho do arquivo JSON
const dataPath = './data/users.json';

// função para ler arquivo
const readData = () => JSON.parse(fs.readFileSync(dataPath));

// função para escrever arquivo
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// SEGREDO do token (em produção usar .env)
const SECRET = 'meusegredo';

// CRUD

// CREATE - Cadastrar usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const users = readData();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);
  writeData(users);

  res.status(201).json({ message: 'Usuário cadastrado!' });
});

// LOGIN - gerar token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readData();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Senha inválida' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// READ - listar todos
router.get('/', verifyToken, (req, res) => {
  const users = readData();
  res.json(users);
});

// UPDATE - atualizar usuário
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const users = readData();
  const index = users.findIndex(u => u.id == id);

  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  users[index].name = name || users[index].name;
  writeData(users);
  res.json({ message: 'Usuário atualizado!' });
});

// DELETE - apagar usuário
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  let users = readData();
  users = users.filter(u => u.id != id);
  writeData(users);
  res.json({ message: 'Usuário removido!' });
});

module.exports = router;
```

---

## 5️⃣ Middleware separado (opcional)

Se quiser separar a verificação do token:
`middleware/auth.js`

```js
const jwt = require('jsonwebtoken');
const SECRET = 'meusegredo';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

---

## 6️⃣ Conectando ao Firebase (Firestore)

Instale o Firebase Admin (já instalamos acima).
Depois configure um **service account** no console do Firebase e baixe o arquivo JSON.

`firebase/firebase.js`

```js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // arquivo baixado do Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
```

Uso no código (exemplo em `routes/users.js`):

```js
const db = require('../firebase/firebase');

// Criar no Firestore
router.post('/firebase', async (req, res) => {
  const { name, email } = req.body;
  await db.collection('users').add({ name, email });
  res.json({ message: 'Usuário salvo no Firestore!' });
});

// Ler do Firestore
router.get('/firebase', async (req, res) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(users);
});
```

---

## 7️⃣ Resumo dos conceitos para prova

* **Express**: framework para criar rotas e middlewares.
* **CRUD**: Create (POST), Read (GET), Update (PUT), Delete (DELETE).
* **Salvar em arquivo JSON**: usar `fs.readFileSync` e `fs.writeFileSync`.
* **Autenticação JWT**: gerar token no login, verificar token nas rotas privadas.
* **Rotas**: cada conjunto de endpoints em um arquivo separado.
* **Firebase**: usar Firebase Admin SDK para ler/gravar no Firestore.

---

Quer que eu monte **um resumão tipo cola** (um PDF ou texto curto com os principais comandos pra levar para prova)? (fica ótimo para consulta rápida)
