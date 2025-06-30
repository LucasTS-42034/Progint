async function mostrarAmiibo() {
  try {
    const resposta = await fetch('https://www.amiiboapi.com/api/amiibo/');
    const dados = await resposta.json();

    const lista = dados.amiibo;

    // Pega um Amiibo aleatório
    const aleatorio = lista[Math.floor(Math.random() * lista.length)];

    // Atualiza a imagem e o nome
    document.getElementById('amiibo-img').src = aleatorio.image;
    document.getElementById('amiibo-nome').innerText = `${aleatorio.character} (${aleatorio.amiiboSeries})`;

  } catch (erro) {
    console.error('Erro ao buscar amiibos:', erro);
    document.getElementById('amiibo-nome').innerText = 'Erro ao carregar amiibo!';
  }
}
