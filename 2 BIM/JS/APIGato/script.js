document.getElementById("btnGato").addEventListener("click", async () => {
  const img = document.getElementById("gatoImg");

  try {
    const resposta = await fetch("https://api.thecatapi.com/v1/images/search");
    const dados = await resposta.json();

    if (dados[0] && dados[0].url) {
      img.src = dados[0].url;
      img.hidden = false;
    } else {
      alert("Não foi possível carregar uma imagem agora. Tente novamente.");
    }
  } catch (erro) {
    console.error("Erro ao buscar imagem de gato:", erro);
    alert("Erro ao carregar imagem.");
  }
});
