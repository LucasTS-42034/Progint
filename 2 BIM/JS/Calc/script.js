// Função chamada ao clicar em qualquer botão
function calcular(operador) {
  // Pegamos os valores digitados pelo usuário
  const valor1 = parseFloat(document.getElementById('valor1').value);
  const valor2 = parseFloat(document.getElementById('valor2').value);
  let resultado;

  // Verifica se os valores são números válidos
  if (isNaN(valor1) || isNaN(valor2)) {
    resultado = 'Digite dois números válidos!';
  } else {
    // Realiza a operação com base no operador
    switch (operador) {
      case '+':
        resultado = valor1 + valor2;
        break;
      case '-':
        resultado = valor1 - valor2;
        break;
      case '*':
        resultado = valor1 * valor2;
        break;
      case '/':
        resultado = valor2 !== 0 ? valor1 / valor2 : 'Erro: divisão por zero';
        break;
      default:
        resultado = 'Operação inválida';
    }
  }

  // Mostra o resultado na tela
  document.getElementById('resultado').innerText = `Resultado: ${resultado}`;
}
