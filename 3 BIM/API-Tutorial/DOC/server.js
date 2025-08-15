import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import dataRoutes from "./routers/routes.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware para interpretar o JSON
app.use(express.json());

//Rota da API 
app.use('/', dataRoutes)


app.use(express.static(path.join(_dirname, 'public')))


//Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'public', 'index.html'))
});

app.listen(PORT, () => {
    console.log("Servidor rodando em localhost:3000")
});