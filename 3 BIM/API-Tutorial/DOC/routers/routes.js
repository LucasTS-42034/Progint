import { Router } from "express";
import { getAllDados } from "../controllers/controller.js";

const rota = Router();

//Rota para retornar os dados 
rota.get('/', getAllDados);

export default rota;