const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 

const dbPath = './db.json';

const lerDados = () => {
  const dados = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(dados);
};

const escreverDados = (dados) => {
  fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2));
};

router.get('/', (req, res) => {
  const dados = lerDados();
  res.json(dados.usuarios);
});

router.post('/', (req, res) => {
  const dados = lerDados();
  const novoUsuario = {
    id: uuidv4(),
    ...req.body
  };
  dados.usuarios.push(novoUsuario);
  escreverDados(dados);
  res.status(201).json({ mensagem: "Úsuario criado com sucesso!", usuario: novoUsuario });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const dados = lerDados();
  const indexUsuario = dados.usuarios.findIndex(p => p.id === id);

  if (indexUsuario === -1) {
    return res.status(404).json({ mensagem: "Usuario não encontrado." });
  }

  dados.usuarios[indexUsuario] = { ...dados.usuarios[indexUsuario], ...req.body };
  escreverDados(dados);
  res.json({ mensagem: "Úsuario atualizado com sucesso!", usuario: dados.usuarios[indexUsuario] });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const dados = lerDados();
  const novosUsuarios = dados.usuarios.filter(p => p.id !== id);

  if (dados.usuarios.length === novosUsuarios.length) {
      return res.status(404).json({ mensagem: "Úsuario não encontrado." });
  }

  dados.usuarios = novosUsuarios;
  escreverDados(dados);
  res.json({ mensagem: "Úsuario deletado com sucesso." });
});

module.exports = router;