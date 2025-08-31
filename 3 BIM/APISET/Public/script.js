// Get references to the form and the list container
const form = document.getElementById("alunoForm");
const lista = document.getElementById("listaAlunos");

// Save the students array to localStorage as a JSON string
function salvarLocalStorage(alunos) {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

// Load the students array from localStorage, or return empty array if none
function carregarLocalStorage() {
  return JSON.parse(localStorage.getItem("alunos")) || [];
}

// Render the list of students in the UI
function renderAlunos() {
  lista.innerHTML = "";
  const alunos = carregarLocalStorage();
  alunos.forEach((aluno, index) => {
    const li = document.createElement("li");
    li.textContent = `${aluno.nome} - ${aluno.email}`;

    // Create Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.onclick = () => {
      // Populate form fields with selected student data for editing
      document.getElementById("nome").value = aluno.nome;
      document.getElementById("cpf").value = aluno.cpf;
      document.getElementById("telefone").value = aluno.telefone;
      document.getElementById("email").value = aluno.email;
      document.getElementById("matricula").value = aluno.matricula;
      document.getElementById("escola").value = aluno.escola;
      // Store the index of the student being edited in a hidden field or variable
      form.dataset.editIndex = index;
    };
    li.appendChild(editBtn);

    // Create Delete button
    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.onclick = () => {
      alunos.splice(index, 1);
      salvarLocalStorage(alunos);
      renderAlunos();
    };
    li.appendChild(btn);

    lista.appendChild(li);
  });
}

// Handle form submission for adding or editing a student
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const aluno = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    matricula: document.getElementById("matricula").value,
    escola: document.getElementById("escola").value,
  };

  const alunos = carregarLocalStorage();

  if (form.dataset.editIndex !== undefined) {
    // Edit existing student
    const index = parseInt(form.dataset.editIndex);
    alunos[index] = aluno;

    // API - update student (assuming API supports PUT with id)
    await fetch(`/api/alunos/${index + 1}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });

    delete form.dataset.editIndex;
  } else {
    // Add new student

    // API - add student
    await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });

    alunos.push(aluno);
  }

  salvarLocalStorage(alunos);
  form.reset();
  renderAlunos();
});

// Inicializar
renderAlunos();
