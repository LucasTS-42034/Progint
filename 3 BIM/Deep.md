Vou te ajudar a estudar para a prova criando um guia completo com exemplos práticos sobre os conteúdos mencionados. Vamos estruturar em tópicos:

## 1. API Express CRUD com JSON

### Estrutura Básica do Projeto
```bash
npm init -y
npm install express fs
```

### Código Exemplo (server.js)
```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json());

// Helper functions para ler/escrever arquivo
const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// CRUD Operations

// CREATE - POST
app.post('/items', async (req, res) => {
    try {
        const items = await readData();
        const newItem = {
            id: Date.now().toString(),
            ...req.body
        };
        items.push(newItem);
        await writeData(items);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - GET (all)
app.get('/items', async (req, res) => {
    try {
        const items = await readData();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - GET (by id)
app.get('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const item = items.find(i => i.id === req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - PUT
app.put('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const index = items.findIndex(i => i.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Item not found' });
        
        items[index] = { ...items[index], ...req.body };
        await writeData(items);
        res.json(items[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
app.delete('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const filteredItems = items.filter(i => i.id !== req.params.id);
        if (items.length === filteredItems.length) {
            return res.status(404).json({ error: 'Item not found' });
        }
        await writeData(filteredItems);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## 2. Autenticação JWT

### Instalação
```bash
npm install jsonwebtoken bcryptjs
```

### Código de Autenticação (auth.js)
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'seu_secret_super_seguro';

// Gerar token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Verificar token middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    generateToken,
    authenticateToken,
    hashPassword,
    comparePassword
};
```

### Rotas de Autenticação
```javascript
const { generateToken, hashPassword, comparePassword } = require('./auth');

// Registro
app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const users = await readData();
        
        // Verificar se usuário já existe
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name
        };

        users.push(newUser);
        await writeData(users);

        const token = generateToken(newUser.id);
        res.status(201).json({ token, user: { id: newUser.id, email, name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await readData();
        
        const user = users.find(u => u.email === email);
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota protegida
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const users = await readData();
        const user = users.find(u => u.id === req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 3. Integração com Firebase

### Instalação
```bash
npm install firebase-admin
```

### Configuração Firebase (firebase.js)
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Baixe do console do Firebase

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
```

### CRUD com Firebase Firestore
```javascript
const { db } = require('./firebase');

// CREATE
app.post('/items-firebase', authenticateToken, async (req, res) => {
    try {
        const docRef = await db.collection('items').add({
            ...req.body,
            userId: req.user.userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ (user's items)
app.get('/items-firebase', authenticateToken, async (req, res) => {
    try {
        const snapshot = await db.collection('items')
            .where('userId', '==', req.user.userId)
            .get();
        
        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 4. Estrutura de Rotas Organizada

### Estrutura de Pastas
```
/project
  /routes
    items.js
    auth.js
  /middleware
    auth.js
  /utils
    fileStorage.js
  server.js
```

### Exemplo de Rota Modular (routes/items.js)
```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { readData, writeData } = require('../utils/fileStorage');

router.get('/', authenticateToken, async (req, res) => {
    // Implementação
});

router.post('/', authenticateToken, async (req, res) => {
    // Implementação
});

module.exports = router;
```

## Pontos Chave para a Prova:

### 1. **Conceitos Importantes:**
- **REST API**: GET, POST, PUT, DELETE
- **Middleware**: Funções que processam requests
- **JWT**: Estrutura (header.payload.signature)
- **Autenticação vs Autorização**

### 2. **Segurança:**
- Nunca armazenar senhas em texto puro
- Validar entrada de dados
- Proteger rotas com middleware de autenticação

### 3. **Firebase:**
- Firestore vs Realtime Database
- Estrutura de coleções/documentos
- Regras de segurança

### 4. **Boas Práticas:**
- Código modularizado
- Tratamento de erros
- Status HTTP apropriados

## Exercícios Práticos:

1. Crie uma API para gerenciar tarefas (TODO list)
2. Implemente autenticação JWT
3. Adicione rotas protegidas
4. Integre com Firebase

Quer que eu detalhe mais algum tópico específico ou tenha alguma dúvida sobre algum conceito?









# Estrutura Completa de Pastas e Explicação dos Conceitos

Vou criar uma estrutura detalhada e explicar cada componente:

## 📁 ESTRUTURA DE PASTAS COMPLETA

```
/projeto-api/
├── 📄 package.json
├── 📄 server.js                 # Arquivo principal
├── 📄 .env                      # Variáveis de ambiente
├── 📄 serviceAccountKey.json    # Chave do Firebase (NÃO COMMITAR!)
│
├── /src/
│   ├── /controllers/            # Lógica das rotas
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   └── userController.js
│   │
│   ├── /models/                 # Definições de dados
│   │   ├── User.js
│   │   └── Item.js
│   │
│   ├── /routes/                 # Definição das rotas
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── /middleware/             # Interceptadores de requisições
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── /utils/                  # Ferramentas auxiliares
│   │   ├── fileStorage.js
│   │   ├── jwtUtils.js
│   │   ├── firebaseConfig.js
│   │   └── passwordUtils.js
│   │
│   ├── /config/                 # Configurações
│   │   └── database.js
│   │
│   └── /data/                   # Arquivos JSON locais
│       ├── users.json
│       └── items.json
│
└── /tests/                      # Testes
    ├── auth.test.js
    └── items.test.js
```

## 🎯 EXPLICAÇÃO DETALHADA DE CADA CONCEITO

### 1. **API (Application Programming Interface)**
**O que é:** Interface que permite comunicação entre diferentes sistemas de software
**Função:** Expor endpoints para clientes (frontend, mobile apps) interagirem com o backend

```javascript
// Exemplo: API RESTful
// GET    /api/items     - Buscar todos os itens
// POST   /api/items     - Criar novo item
// GET    /api/items/1   - Buscar item específico
// PUT    /api/items/1   - Atualizar item
// DELETE /api/items/1   - Deletar item
```

### 2. **EXPRESS.js**
**O que é:** Framework web para Node.js
**Função:** Facilitar criação de servidores e rotas

```javascript
// server.js - Arquivo principal
const express = require('express');
const app = express();

// Middlewares globais
app.use(express.json()); // Permite receber JSON no body
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/items', require('./src/routes/itemRoutes'));

app.listen(3000, () => {
    console.log('API rodando na porta 3000');
});
```

### 3. **CRUD (Create, Read, Update, Delete)**
**O que é:** Operações básicas de persistência de dados
**Função:** Gerenciar dados no sistema

```javascript
// src/controllers/itemController.js
class ItemController {
    // CREATE
    async createItem(req, res) {
        try {
            const newItem = req.body;
            // Salvar no JSON ou Firebase
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // READ (All)
    async getItems(req, res) {
        // Buscar todos os itens
    }

    // READ (One)
    async getItem(req, res) {
        // Buscar item por ID
    }

    // UPDATE
    async updateItem(req, res) {
        // Atualizar item
    }

    // DELETE
    async deleteItem(req, res) {
        // Deletar item
    }
}
```

### 4. **Salvar em Arquivo JSON**
**O que é:** Persistência de dados em arquivos .json
**Função:** Banco de dados simples para projetos pequenos

```javascript
// src/utils/fileStorage.js
const fs = require('fs').promises;
const path = require('path');

class FileStorage {
    constructor(filename) {
        this.filePath = path.join(__dirname, '../data', filename);
    }

    async readData() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Retorna array vazio se arquivo não existir
        }
    }

    async writeData(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async findById(id) {
        const items = await this.readData();
        return items.find(item => item.id === id);
    }

    async save(item) {
        const items = await this.readData();
        items.push(item);
        await this.writeData(items);
        return item;
    }
}

module.exports = FileStorage;
```

### 5. **Autenticação com JWT (JSON Web Token)**
**O que é:** Sistema de autenticação stateless usando tokens
**Função:** Verificar identidade do usuário sem manter sessão no servidor

```javascript
// src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');

class JWTUtils {
    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    static extractToken(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        
        return authHeader.split(' ')[1]; // Bearer TOKEN
    }
}

module.exports = JWTUtils;
```

### 6. **Middleware de Autenticação**
**O que é:** Função que intercepta requisições antes de chegar na rota
**Função:** Validar token JWT e proteger rotas

```javascript
// src/middleware/authMiddleware.js
const JWTUtils = require('../utils/jwtUtils');

const authenticateToken = (req, res, next) => {
    const token = JWTUtils.extractToken(req);
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    try {
        const decoded = JWTUtils.verifyToken(token);
        req.user = decoded; // Adiciona info do usuário na requisição
        next(); // Passa para a próxima função
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = { authenticateToken };
```

### 7. **Rotas (Routes)**
**O que é:** Definição dos endpoints da API
**Função:** Mapear URLs para funções específicas

```javascript
// src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);

// Rotas protegidas (precisam de token)
router.post('/', authenticateToken, itemController.createItem);
router.put('/:id', authenticateToken, itemController.updateItem);
router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;
```

### 8. **Integração com Firebase**
**O que é:** Plataforma de desenvolvimento do Google
**Função:** Substituir arquivo JSON por banco de dados em nuvem

```javascript
// src/utils/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class FirebaseService {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
    }

    async create(data) {
        const docRef = await this.collection.add({
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...data };
    }

    async findAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async findById(id) {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
}

module.exports = FirebaseService;
```

## 🔄 FLUXO DE UMA REQUISIÇÃO TÍPICA

```
Cliente → API → Middleware → Rota → Controller → Serviço (JSON/Firebase) → Resposta
```

**Exemplo: Criar item com autenticação**
1. Cliente envia POST `/api/items` com token JWT no header
2. Middleware valida token → se válido, passa para rota
3. Ruta chama controller `createItem`
4. Controller valida dados → salva no JSON/Firebase
5. Retorna item criado com status 201

## 📋 COMANDOS PARA CRIAR A ESTRUTURA

```bash
# Criar projeto
mkdir projeto-api
cd projeto-api

# Iniciar npm
npm init -y

# Instalar dependências
npm install express jsonwebtoken bcryptjs firebase-admin dotenv
npm install --save-dev nodemon

# Criar estrutura de pastas
mkdir -p src/{controllers,models,routes,middleware,utils,config,data}
mkdir tests

# Criar arquivos
touch server.js .env
touch src/{controllers/{authController,itemController}.js,models/{User,Item}.js}
touch src/{routes/{authRoutes,itemRoutes}.js,middleware/{authMiddleware,validationMiddleware}.js}
touch src/utils/{fileStorage,jwtUtils,firebaseConfig,passwordUtils}.js
touch src/data/{users,items}.json
```

## 🚀 COMO ESTUDAR PARA A PROVA

1. **Entenda cada camada** - O que cada pasta/arquivo faz
2. **Pratique o fluxo** - Como uma requisição percorre o sistema
3. **Crie exemplos** - Implemente cada conceito do zero
4. **Teste as rotas** - Use Postman/Insomnia para testar a API
5. **Compare soluções** - JSON file vs Firebase

Quer que eu detalhe mais algum tópico específico ou explique como testar cada parte?
