function mostrarOla() {
    let nome = document.getElementById("nome").value; 
    document.getElementById("resposta").innerHTML = "Olá " + nome;
  }
  
  const mostrar = document.getElementById("mostrar");

  mostrar.addEventListener("click", mostrarOla);  

  function calcul() {
    let some = document.getElementById(calcu).value;
  }