document.getElementById("cepForm").addEventListener("submit", async (event) => {
  const cepDigitado = document.getElementById("cep").value.replace(/\D/g, "");

  if (cepDigitado.length !== 8) {
    alert("CEP inválido. Deve conter 8 números.");
    return;
  }

  try {
    const resposta = await fetch(
      `https://viacep.com.br/ws/${cepDigitado}/json/`
    );
    const dados = await resposta.json();

    if (dados.erro) {
      alert("CEP não encontrado!");
      limparCampos();
      return;
    }

    document.getElementById("cepInfo").value = dados.cep || "";
    document.getElementById("rua").value = dados.logradouro || "Não disponível";
    document.getElementById("bairro").value = dados.bairro || "Não disponível";
    document.getElementById("cidade").value =
      dados.localidade || "Não disponível";
    document.getElementById("uf").value = dados.uf || "Não disponível";
  } catch (erro) {
    console.error("Erro ao buscar o CEP:", erro);
    alert("Erro ao consultar o CEP.");
  }
});

function limparCampos() {
  const campos = ["cepInfo", "rua", "bairro", "cidade", "uf", "estado"];
  campos.forEach((id) => (document.getElementById(id).value = ""));
}

document.getElementById("salvarCep").addEventListener("click", () => {
  nome;
  email;
  numb;
  const cep = document.getElementById("cepInfo").value;

  if (!cep) {
    alert("Consulte um CEP antes de salvar.");
    return;
  }

  let cepsSalvos = JSON.parse(localStorage.getItem("cepsSalvos")) || [];

  if (cepsSalvos.includes(cep)) {
    alert("Este CEP já está salvo.");
    return;
  } else if (cepsSalvos.includes(nome)) {
    alert("Este nome já está salvo.");
    return;
  } else if (cepsSalvos.includes(email)) {
    alert("Este email já está salvo");
    return;
  } else if (cepsSalvos.includes(numb)) {
    alert("Este número já está salvo.");
    return;
  }

  cepsSalvos.push(cep);
  localStorage.setItem("cepsSalvos", JSON.stringify(cepsSalvos));

  mostrarCeps();
});

function mostrarCeps() {
  const lista = document.getElementById("listaCeps");
  lista.innerHTML = "";

  const cepsSalvos = JSON.parse(localStorage.getItem("cepsSalvos")) || [];

  cepsSalvos.forEach((cep, index) => {
    const li = document.createElement("li");
    li.textContent =
      nome +
      "\n" +
      email +
      "\n" +
      num +
      "\n" +
      document.getElementById("cepInfo").value +
      "\n" +
      document.getElementById("rua").value +
      "\n" +
      document.getElementById("bairro").value +
      "\n" +
      document.getElementById("cidade").value +
      "\n";

    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.style.marginLeft = "10px";

    const btn1 = document.createElement("button");
    btn.textContent = "Editar";
    btn.style.marginLeft = "10px";

    btn.addEventListener("click", () => {
      cepsSalvos.splice(index, 1);
      localStorage.setItem("cepsSalvos", JSON.stringify(cepsSalvos));
      mostrarCeps();
    });

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

mostrarCeps();
