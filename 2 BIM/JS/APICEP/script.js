// Mapeamento de estados e regiões do Brasil
const mapaEstados = {
  "AC": { nome: "Acre", regiao: "Norte" },
  "AL": { nome: "Alagoas", regiao: "Nordeste" },
  "AP": { nome: "Amapá", regiao: "Norte" },
  "AM": { nome: "Amazonas", regiao: "Norte" },
  "BA": { nome: "Bahia", regiao: "Nordeste" },
  "CE": { nome: "Ceará", regiao: "Nordeste" },
  "DF": { nome: "Distrito Federal", regiao: "Centro-Oeste" },
  "ES": { nome: "Espírito Santo", regiao: "Sudeste" },
  "GO": { nome: "Goiás", regiao: "Centro-Oeste" },
  "MA": { nome: "Maranhão", regiao: "Nordeste" },
  "MT": { nome: "Mato Grosso", regiao: "Centro-Oeste" },
  "MS": { nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },
  "MG": { nome: "Minas Gerais", regiao: "Sudeste" },
  "PA": { nome: "Pará", regiao: "Norte" },
  "PB": { nome: "Paraíba", regiao: "Nordeste" },
  "PR": { nome: "Paraná", regiao: "Sul" },
  "PE": { nome: "Pernambuco", regiao: "Nordeste" },
  "PI": { nome: "Piauí", regiao: "Nordeste" },
  "RJ": { nome: "Rio de Janeiro", regiao: "Sudeste" },
  "RN": { nome: "Rio Grande do Norte", regiao: "Nordeste" },
  "RS": { nome: "Rio Grande do Sul", regiao: "Sul" },
  "RO": { nome: "Rondônia", regiao: "Norte" },
  "RR": { nome: "Roraima", regiao: "Norte" },
  "SC": { nome: "Santa Catarina", regiao: "Sul" },
  "SP": { nome: "São Paulo", regiao: "Sudeste" },
  "SE": { nome: "Sergipe", regiao: "Nordeste" },
  "TO": { nome: "Tocantins", regiao: "Norte" }
};

// Evento principal do formulário de busca de CEP
document.getElementById("cepForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita recarregar a página

  const cepDigitado = document.getElementById("cep").value.replace(/\D/g, "");

  if (cepDigitado.length !== 8) {
    alert("CEP inválido. Deve conter 8 números.");
    return;
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      alert("CEP não encontrado!");
      limparCampos();
      return;
    }

    document.getElementById("cepInfo").value = dados.cep || "";
    document.getElementById("rua").value = dados.logradouro || "Não disponível";
    document.getElementById("complemento").value = dados.complemento || "Não disponível";
    document.getElementById("bairro").value = dados.bairro || "Não disponível";
    document.getElementById("cidade").value = dados.localidade || "Não disponível";
    document.getElementById("uf").value = dados.uf || "Não disponível";
    document.getElementById("ibge").value = dados.ibge || "Não disponível";
    document.getElementById("gia").value = dados.gia || "Não disponível";
    document.getElementById("ddd").value = dados.ddd || "Não disponível";
    document.getElementById("siafi").value = dados.siafi || "Não disponível";

    const infoEstado = mapaEstados[dados.uf];
    if (infoEstado) {
      document.getElementById("estado").value = infoEstado.nome;
      document.getElementById("regiao").value = infoEstado.regiao;
    } else {
      document.getElementById("estado").value = "Desconhecido";
      document.getElementById("regiao").value = "Desconhecida";
    }

  } catch (erro) {
    console.error("Erro ao buscar o CEP:", erro);
    alert("Erro ao consultar o CEP.");
  }
});

// Função para limpar todos os campos preenchidos
function limparCampos() {
  const campos = [
    "cepInfo", "rua", "complemento", "bairro", "cidade",
    "uf", "estado", "regiao", "ibge", "gia", "ddd", "siafi"
  ];
  campos.forEach(id => document.getElementById(id).value = "");
}

// Botão "Salvar CEP" - salva o CEP atual no localStorage e na lista
document.getElementById("salvarCep").addEventListener("click", () => {
  const cep = document.getElementById("cepInfo").value;

  if (!cep) {
    alert("Consulte um CEP antes de salvar.");
    return;
  }

  // Pega a lista atual do localStorage ou cria uma nova
  let cepsSalvos = JSON.parse(localStorage.getItem("cepsSalvos")) || [];

  // Verifica se já existe o CEP salvo
  if (cepsSalvos.includes(cep)) {
    alert("Este CEP já está salvo.");
    return;
  }

  // Salva o novo CEP na lista e atualiza o localStorage
  cepsSalvos.push(cep);
  localStorage.setItem("cepsSalvos", JSON.stringify(cepsSalvos));

  // Atualiza a exibição
  mostrarCeps();
});

// Função que renderiza a lista de CEPs salvos na tela
function mostrarCeps() {
  const lista = document.getElementById("listaCeps");
  lista.innerHTML = ""; // Limpa a lista antes de recriar

  const cepsSalvos = JSON.parse(localStorage.getItem("cepsSalvos")) || [];

  cepsSalvos.forEach((cep, index) => {
    const li = document.createElement("li"); // Cria o item da lista
    li.textContent = cep + " "; // Mostra o CEP

    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.style.marginLeft = "10px";

    // Quando o botão é clicado, remove o CEP da lista e do localStorage
    btn.addEventListener("click", () => {
      cepsSalvos.splice(index, 1); // Remove da lista
      localStorage.setItem("cepsSalvos", JSON.stringify(cepsSalvos));
      mostrarCeps(); // Atualiza a lista na tela
    });

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

// Ao carregar a página, exibe os CEPs salvos
mostrarCeps();
