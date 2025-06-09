function mostrarOla() {
    let nome = document.getElementById("nome").value; 
    document.getElementById("resposta").innerHTML = "Olá " + nome;
  }
  
  const mostrar = document.getElementById("mostrar");

  mostrar.addEventListener("click", mostrarOla);  

  function calcul() {
    let some = document.getElementById("calcu").value;
    document.getElementById("calcular").ariaValueNow(some + 3);
  }

  
  const cal = document.getElementById("Calcular");

  mostrar.addEventListener("click", calcul);