// Importa o framework Express para criar o servidor web
const express = require("express");
// Importa o módulo path para manipulação de caminhos de arquivos
const path = require("path");
// Cria uma instância do aplicativo Express
const app = express();
// Importa as rotas definidas no arquivo routes.js
const routes = require("./routers/routes");
// Importa o middleware de logger para registrar as requisições
const logger = require("./Middleware/logger");

// Middleware para interpretar requisições com corpo JSON
app.use(express.json());
// Middleware para logar cada requisição recebida
app.use(logger);

// Define o prefixo "/api" para as rotas da API
app.use("/api", routes);

// Serve arquivos estáticos da pasta "Public"
app.use(express.static(path.join(__dirname, "Public")));

// Define a porta onde o servidor irá escutar
const PORT = 3000;
// Inicia o servidor e exibe mensagem no console
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
