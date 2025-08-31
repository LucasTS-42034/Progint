// Importa o framework Express para criar rotas
const express = require("express");
// Cria um roteador para definir rotas específicas
const router = express.Router();
// Importa os dados iniciais dos alunos (simulando um banco de dados em memória)
let alunos = require("../dados/sampleDados.js");

// READ - listar todos os alunos
/**
 * GET /alunos
 * Retorna a lista completa de alunos em formato JSON.
 */
router.get("/alunos", (req, res) => {
  res.json(alunos);
});

// CREATE - adicionar um novo aluno
/**
 * POST /alunos
 * Recebe os dados do aluno no corpo da requisição e adiciona à lista.
 * Retorna o aluno criado com status 201.
 */
router.post("/alunos", (req, res) => {
  const { nome, cpf, telefone, email, matricula, escola } = req.body;
  const novoAluno = {
    id: alunos.length + 1,
    nome,
    cpf,
    telefone,
    email,
    matricula,
    escola
  };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

// UPDATE - editar um aluno existente
/**
 * PUT /alunos/:id
 * Atualiza os dados do aluno com o ID especificado.
 * Retorna o aluno atualizado ou erro 404 se não encontrado.
 */
router.put("/alunos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email, matricula, escola } = req.body;

  let aluno = alunos.find(a => a.id == id);
  if (!aluno) return res.status(404).json({ msg: "Aluno não encontrado" });

  aluno.nome = nome || aluno.nome;
  aluno.cpf = cpf || aluno.cpf;
  aluno.telefone = telefone || aluno.telefone;
  aluno.email = email || aluno.email;
  aluno.matricula = matricula || aluno.matricula;
  aluno.escola = escola || aluno.escola;

  res.json(aluno);
});

// DELETE - remover um aluno
/**
 * DELETE /alunos/:id
 * Remove o aluno com o ID especificado da lista.
 * Retorna mensagem de sucesso.
 */
router.delete("/alunos/:id", (req, res) => {
  const { id } = req.params;
  alunos = alunos.filter(a => a.id != id);
  res.json({ msg: "Aluno removido com sucesso" });
});

// Exporta o roteador para ser usado no servidor principal
module.exports = router;
