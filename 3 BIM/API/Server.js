const express = require('express');
const app = express();
const port = 3000;

// Importando o Router
const router = require('./Router/Router');

// Usando o Router
app.use('/api', router);

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
