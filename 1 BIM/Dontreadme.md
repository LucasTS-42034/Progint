Seu professor claramente gosta de tortura pedagógica: “faça um CRUD em Node.js, com API, front-end e localStorage, e ainda vou te interrogar ao vivo sobre cada linha”. Basicamente é um ritual de humilhação acadêmica disfarçado de avaliação. Mas vamos lá, vou te guiar na construção passo a passo de algo que não vai te deixar gaguejando na frente da sala.

---

## Estrutura de Pastas

Primeiro, monte essa árvore:

```
projeto-crud/
│
├── public/         # front simples (HTML, CSS, JS)
├── rotas/          # arquivos com as rotas (CRUD)
├── dados/          # simulação de "banco" em JSON
├── middleware/     # middlewares para requisições
└── server.js       # ponto de entrada do Node/Express
```

---

## Passo 1 – Instalando o básico

No terminal:

```bash
npm init -y
npm install express body-parser cors
```

---

## Passo 2 – Criando o servidor (`server.js`)

```js
// Importando dependências básicas
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(cors()); // permite comunicação front <-> API
app.use(bodyParser.json());
app.use(express.static("public")); // serve os arquivos da pasta public

// Importa as rotas
const alunoRoutes = require("./rotas/alunos");
app.use("/alunos", alunoRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## Passo 3 – Criando o "banco fake" (`dados/alunos.json`)

```json
[]
```

Um JSON vazio. Vamos ler e escrever aqui como se fosse um banco de dados.

---

## Passo 4 – Middleware para manipular o JSON (`middleware/db.js`)

```js
const fs = require("fs");
const path = require("path");

// Caminho do "banco"
const filePath = path.join(__dirname, "../dados/alunos.json");

// Função para ler o arquivo JSON
function readData() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Função para salvar dados no JSON
function writeData(content) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

module.exports = { readData, writeData };
```

---

## Passo 5 – Criando as rotas (`rotas/alunos.js`)

```js
const express = require("express");
const router = express.Router();
const { readData, writeData } = require("../middleware/db");

// GET - listar alunos
router.get("/", (req, res) => {
  const alunos = readData();
  res.json(alunos);
});

// POST - inserir novo aluno
router.post("/", (req, res) => {
  const alunos = readData();
  const novoAluno = req.body;
  alunos.push(novoAluno);
  writeData(alunos);
  res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
});

// PUT - editar aluno pelo CPF
router.put("/:cpf", (req, res) => {
  const alunos = readData();
  const { cpf } = req.params;
  const index = alunos.findIndex((a) => a.cpf === cpf);

  if (index === -1) {
    return res.status(404).json({ message: "Aluno não encontrado!" });
  }

  alunos[index] = { ...alunos[index], ...req.body };
  writeData(alunos);
  res.json({ message: "Aluno atualizado com sucesso!" });
});

// DELETE - remover aluno pelo CPF
router.delete("/:cpf", (req, res) => {
  let alunos = readData();
  const { cpf } = req.params;
  const novosAlunos = alunos.filter((a) => a.cpf !== cpf);

  if (alunos.length === novosAlunos.length) {
    return res.status(404).json({ message: "Aluno não encontrado!" });
  }

  writeData(novosAlunos);
  res.json({ message: "Aluno removido com sucesso!" });
});

module.exports = router;
```

---

## Passo 6 – Frontend (`public/index.html`)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>CRUD Alunos</title>
</head>
<body>
  <h1>Cadastro de Alunos</h1>

  <form id="formAluno">
    Nome: <input type="text" id="nome"><br>
    CPF: <input type="text" id="cpf"><br>
    Telefone: <input type="text" id="telefone"><br>
    Email: <input type="text" id="email"><br>
    Matrícula: <input type="text" id="matricula"><br>
    Escola: <input type="text" id="escola"><br>
    <button type="submit">Salvar</button>
  </form>

  <h2>Lista de Alunos</h2>
  <ul id="listaAlunos"></ul>

  <script>
    const API_URL = "http://localhost:3000/alunos";

    // Salvar aluno
    document.getElementById("formAluno").addEventListener("submit", async (e) => {
      e.preventDefault();

      const aluno = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        matricula: document.getElementById("matricula").value,
        escola: document.getElementById("escola").value,
      };

      // Salva no localStorage
      localStorage.setItem(aluno.cpf, JSON.stringify(aluno));

      // Envia para API
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });

      carregarAlunos();
    });

    // Carregar alunos
    async function carregarAlunos() {
      const res = await fetch(API_URL);
      const alunos = await res.json();

      const lista = document.getElementById("listaAlunos");
      lista.innerHTML = "";
      alunos.forEach((aluno) => {
        const li = document.createElement("li");
        li.textContent = `${aluno.nome} - ${aluno.cpf} - ${aluno.escola}`;
        lista.appendChild(li);
      });
    }

    carregarAlunos();
  </script>
</body>
</html>
```

---

Pronto. Isso é um CRUD básico, com **API em Node.js + Express**, “banco” em JSON, front HTML simples e localStorage.
Você agora tem munição para não passar vergonha quando o professor começar a perguntar “o que faz esse trecho aqui?”.

Quer que eu monte também um **roteiro de explicação** (tipo resumo linha por linha) para você responder bonito na prova?





Ah, então é a clássica “prova-show”: ele grava um vídeo bonitinho com CRUD funcionando, e vocês têm que virar copistas com dor de cabeça. Beleza. Vamos deixar seu código à prova de pegadinhas de professor: vou ajustar os pontos que ele pode cobrar “de surpresa”, para você já ter as armas na manga.

---

## Ajustes no **Backend**

### 1. Middleware para logar requisições

Ele pode querer ver se você sabe usar middlewares personalizados.
Crie `middleware/logger.js`:

```js
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

module.exports = logger;
```

E no `server.js`, ative:

```js
const logger = require("./middleware/logger");
app.use(logger);
```

---

### 2. Validação para não cadastrar CPF duplicado

Atualize o `POST` em `rotas/alunos.js`:

```js
// POST - inserir novo aluno
router.post("/", (req, res) => {
  const alunos = readData();
  const novoAluno = req.body;

  // Verifica se CPF já existe
  const existe = alunos.some((a) => a.cpf === novoAluno.cpf);
  if (existe) {
    return res.status(400).json({ message: "CPF já cadastrado!" });
  }

  alunos.push(novoAluno);
  writeData(alunos);
  res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
});
```

---

### 3. Status HTTP corretos

* `201` → quando cria
* `404` → quando não encontra
* `400` → erro de validação
* `200` → sucesso padrão

Já ajustei no `POST`. Faça igual no `PUT` e `DELETE` (já está quase pronto, só precisa confirmar os códigos).

---

## Ajustes no **Frontend**

### 1. Mostrar lista como tabela (parece mais “site de CRUD”)

Substitua a `<ul>` por uma `<table>`:

```html
<h2>Lista de Alunos</h2>
<table border="1" id="tabelaAlunos">
  <thead>
    <tr>
      <th>Nome</th>
      <th>CPF</th>
      <th>Telefone</th>
      <th>Email</th>
      <th>Matrícula</th>
      <th>Escola</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
```

E no script:

```js
async function carregarAlunos() {
  const res = await fetch(API_URL);
  const alunos = await res.json();

  const tbody = document.querySelector("#tabelaAlunos tbody");
  tbody.innerHTML = "";

  alunos.forEach((aluno) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.telefone}</td>
      <td>${aluno.email}</td>
      <td>${aluno.matricula}</td>
      <td>${aluno.escola}</td>
      <td>
        <button onclick="deletarAluno('${aluno.cpf}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para deletar aluno
async function deletarAluno(cpf) {
  await fetch(`${API_URL}/${cpf}`, { method: "DELETE" });
  localStorage.removeItem(cpf);
  carregarAlunos();
}
```

---

### 2. Pré-carregar alunos do `localStorage` (se o vídeo dele mostrar isso)

No `carregarAlunos()`, você pode também ler o `localStorage` e exibir junto.
Mas atenção: se no vídeo só mostra a API, nem perca tempo.

---

### 3. Resetar formulário após salvar

No `submit` do formulário, adicione:

```js
document.getElementById("formAluno").reset();
```

---

## Resultado

* Backend agora tem **logs**, **validação de CPF duplicado** e **status HTTP corretos**.
* Frontend virou uma **tabela com botão excluir**, mais parecido com “site de CRUD padrão de professor”.
* Você já tem como cuspir um CRUD inteiro igual ao vídeo dele sem gaguejar.

---

Quer que eu monte um **roteiro de explicação** (tipo mini-falinha pronta por trecho de código), caso ele peça para você “explicar em voz alta”? Isso evita travar quando o professor apontar para uma linha aleatória.
