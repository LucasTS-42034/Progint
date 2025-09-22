const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const dataPath = './data/users.json';

const readData = () => JSON.parse(fs.readFileSync(dataPath));

const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

const SECRET = 'meusegredo';


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

router.get('/', verifyToken, (req, res) => {
  const users = readData();
  res.json(users);
});

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

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  let users = readData();
  users = users.filter(u => u.id != id);
  writeData(users);
  res.json({ message: 'Usuário removido!' });
});

module.exports = router;


//GPT deletar