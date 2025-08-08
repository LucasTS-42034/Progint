import { obterInfoSistema } from "./testeos.js";

// const calc = require("./calculadora");

// console.log("Soma: ", calc.soma(2, 3));

// console.log("Multiplicação: ", calc.multiplicar(2, 3));

const info = obterInfoSistema();

console.log("Informações do Sistema Operacional:\n");
console.table(info);
