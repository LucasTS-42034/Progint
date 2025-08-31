// Simula um "banco de dados" inicial armazenado em memória (array de objetos)
// Cada objeto representa um aluno com os campos: id, nome, cpf, telefone, email, matricula, escola
let alunos = [
  { id: 1, nome: "João Silva", cpf: "12345678900", telefone: "11999999999", email: "joao@email.com", matricula: "2023001", escola: "Escola A" },
  { id: 2, nome: "Maria Souza", cpf: "98765432100", telefone: "21988888888", email: "maria@email.com", matricula: "2023002", escola: "Escola B" }
];

// Exporta o array de alunos para ser usado em outras partes da aplicação
module.exports = alunos;
