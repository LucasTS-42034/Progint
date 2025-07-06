let display = document.getElementById("display");

function adicionar(valor) {
  display.value += valor;
}

function limpar() {
  display.value = "";
}

function calcular() {
  let expressao = display.value;

  // Fatorial
  if (expressao.includes('!')) {
    let num = parseFloat(expressao.replace('!', ''));
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      display.value = "Erro";
      return;
    }
    display.value = fatorial(num);
    return;
  }

  // Quadrado
  if (expressao.includes('^2')) {
    let num = parseFloat(expressao.replace('^2', ''));
    if (isNaN(num)) {
      display.value = "Erro";
      return;
    }
    display.value = Math.pow(num, 2);
    return;
  }

  // Avaliação normal da expressão
  try {
    let resultado = eval(expressao);
    display.value = resultado;
  } catch (e) {
    display.value = "Erro";
  }
}

function fatorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * fatorial(n - 1);
}



/*
Esse código representa uma **calculadora simples**, feita com HTML, CSS e JavaScript. Vou te guiar passo a passo por **cada parte do projeto**, explicando **como tudo se conecta** e o que está **acontecendo nos bastidores**.

---

## 📄 **1. HTML (estrutura da calculadora)**

```html
<!DOCTYPE html>
<html lang="pt-br">
```

* Indica que o documento é HTML5.
* `lang="pt-br"`: define o idioma da página como português brasileiro.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora</title>
  <link rel="stylesheet" href="style.css">
</head>
```

* Define configurações iniciais da página.
* `link` importa o CSS externo chamado `style.css`.

```html
<body>
  <div class="calculadora">
    <input type="text" id="display" readonly>
```

* `input`: é onde os números e resultados aparecem.
* `readonly`: o usuário não pode digitar diretamente — apenas clicar nos botões.

---

### 🧮 Botões da calculadora:

```html
<div class="botoes">
  <button onclick="limpar()">C</button>
  <button onclick="adicionar('^2')">x²</button>
  <button onclick="adicionar('!')">!</button>
  ...
```

* Cada botão chama uma **função JavaScript** quando clicado:

  * `onclick="adicionar('7')"` → adiciona `'7'` ao display.
  * `onclick="calcular()"` → executa o cálculo.
  * `onclick="limpar()"` → limpa tudo.

---

## 🎨 **2. CSS (aparência e layout)**

```css
body {
  background-color: #1f1f1f;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

* Centraliza a calculadora no meio da tela, tanto vertical quanto horizontalmente.

```css
.calculadora {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px #000;
}
```

* Define o estilo da “caixa” da calculadora.

```css
#display {
  height: 60px;
  text-align: right;
  font-size: 24px;
}
```

* O display mostra os números à direita, com tamanho de fonte grande.

```css
.botoes {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  gap: 10px;
}
```

* Organiza os botões em **4 colunas**, com espaçamento entre eles.
* `.zero { grid-column: span 2; }` → o botão "0" ocupa o espaço de **dois botões** na horizontal.

---

## 🧠 **3. JavaScript (funcionalidade)**

```js
let display = document.getElementById("display");
```

* Captura o elemento `<input>` para manipulá-lo com JavaScript.

---

### ✍️ Função `adicionar(valor)`

```js
function adicionar(valor) {
  display.value += valor;
}
```

* Concatena o valor clicado ao conteúdo atual do display.
* Exemplo: se o usuário clicar 5 e depois + → o display mostra "5+"

---

### 🧼 Função `limpar()`

```js
function limpar() {
  display.value = "";
}
```

* Limpa o display. Simples e direto.

---

### 🧮 Função `calcular()`

Essa é o **cérebro da calculadora**. Ela faz:

```js
let expressao = display.value;
```

* Captura a expressão digitada, por exemplo: `"3+5"` ou `"6^2"` ou `"4!"`

---

#### 🔁 Caso 1: Fatorial (!)

```js
if (expressao.includes('!')) {
  let num = parseFloat(expressao.replace('!', ''));
  ...
  display.value = fatorial(num);
}
```

* Pega o número antes do `!` e calcula o fatorial com uma **função recursiva**.
* Exemplo: `"5!"` → `fatorial(5)` → 5 × 4 × 3 × 2 × 1 = **120**

---

#### 🟪 Caso 2: Potência ao quadrado (^2)

```js
if (expressao.includes('^2')) {
  let num = parseFloat(expressao.replace('^2', ''));
  display.value = Math.pow(num, 2);
}
```

* Usa `Math.pow(num, 2)` para elevar o número ao quadrado.
* Exemplo: `"6^2"` → `36`

---

#### ➕ Caso 3: Expressão normal

```js
try {
  let resultado = eval(expressao);
  display.value = resultado;
} catch (e) {
  display.value = "Erro";
}
```

* `eval()` interpreta e calcula a expressão como se fosse uma equação JavaScript.
* Exemplo: `"3+5*2"` → `eval("3+5*2")` → `13`

---

### 🔁 Função auxiliar: `fatorial(n)`

```js
function fatorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * fatorial(n - 1);
}
```

* Função **recursiva** que calcula o fatorial:

  * fatorial(3) = 3 × fatorial(2)
  * fatorial(2) = 2 × fatorial(1)
  * fatorial(1) = 1 → fim da recursão

---

## ✅ Resumo visual da execução

1. **Usuário clica em um botão** → chama `adicionar()`.
2. Os valores aparecem no **display**.
3. Se clicar em `=`, a função `calcular()` identifica:

   * Se é `^2` → calcula quadrado.
   * Se é `!` → calcula fatorial.
   * Se é uma expressão normal → usa `eval()` para resolver.
4. O resultado aparece no display.

---

Se quiser, posso te mostrar como **melhorar o código**, adicionar **tratamento de erro mais robusto**, suporte a **fatorial de múltiplos termos**, **raízes quadradas**, **histórico de operações** e por aí vai. É um ótimo projeto pra aprender JS!

*/