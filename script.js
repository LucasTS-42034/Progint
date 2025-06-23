function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
  
    if (taskText === "") {
      alert("Digite uma tarefa.");
      return;
    }
  
    const taskList = document.getElementById("taskList");
  
    const li = document.createElement("li");
  
    li.textContent = taskText;
    li.addEventListener("click", function () {
      li.classList.toggle("completed");
    });
  
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = function () {
      taskList.removeChild(li);
    };
  
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  
    taskInput.value = "";
  }
  