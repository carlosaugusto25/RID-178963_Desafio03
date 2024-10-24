// Chave para o Local Storage
const TASKS_STORAGE_KEY = "tasks";

// Lista de tarefas iniciais
const initialTasks = [
    { name: "Implementar tela de listagem de tarefas", tag: "frontend", date: new Date().toLocaleDateString("pt-BR"), completed: false },
    { name: "Implementar protótipo de listagem de tarefas", tag: "frontend", date: new Date().toLocaleDateString("pt-BR"), completed: true }
  ];

// Recupera o estado atual das tarefas do Local Storage ou inicializa com uma lista vazia
let tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || initialTasks;
let completedTasksCount = tasks.filter(task => task.completed).length;

// Selecionando os elementos do DOM
const taskContainer = document.querySelector("#content-cards");
const taskForm = document.querySelector("form");
const taskInput = document.querySelector("#name");
const tagInput = document.querySelector("#tag");
const completedCountElement = document.querySelector("footer p");

// Função para salvar as tarefas no Local Storage
function saveTasksToLocalStorage() {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

// Função para renderizar uma tarefa
function renderTask(task, index) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("card-tasks");

  const headerAndContent = document.createElement("div");
  headerAndContent.id = "header-and-content";

  // Cria o título da tarefa
  const title = document.createElement("h2");
  title.textContent = task.name;
  title.classList.add(task.completed ? "title-card-completed" : "title-card");

  // Cria o container da tag e da data
  const tagAndDate = document.createElement("div");
  tagAndDate.classList.add("tag-and-date");

  // Cria a tag
  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.textContent = task.tag;

  // Cria a data
  const date = document.createElement("p");
  date.classList.add("date");
  date.textContent = `Criado em: ${task.date}`;

  // Adiciona tag e data no container
  tagAndDate.appendChild(tag);
  tagAndDate.appendChild(date);

  // Adiciona título e tag/data no conteúdo do card
  headerAndContent.appendChild(title);
  headerAndContent.appendChild(tagAndDate);

  // Botão de concluir ou imagem de tarefa concluída
  if (task.completed) {
    const completedIcon = document.createElement("img");
    completedIcon.setAttribute("src", "./assets/completed.svg");
    completedIcon.setAttribute("alt", "Tarefa concluída");
    taskCard.appendChild(headerAndContent);
    taskCard.appendChild(completedIcon);
  } else {
    const completeButton = document.createElement("button");
    completeButton.textContent = "Concluir";

    // Evento para marcar a tarefa como concluída
    completeButton.addEventListener("click", () => {
      tasks[index].completed = true; // Marca a tarefa como concluída no array
      title.classList.replace("title-card", "title-card-completed"); // Muda a classe para riscar o texto
      completeButton.replaceWith(createCompletedIcon()); // Substitui o botão pela imagem de concluído
      updateCompletedCount(); // Atualiza o contador de tarefas concluídas
      saveTasksToLocalStorage(); // Salva as tarefas no Local Storage
    });

    taskCard.appendChild(headerAndContent);
    taskCard.appendChild(completeButton);
  }

  // Adiciona o card da tarefa no container
  taskContainer.appendChild(taskCard);
}

// Função para carregar as tarefas do Local Storage
function loadTasks() {
  taskContainer.innerHTML = ""; // Limpa as tarefas anteriores
  tasks.forEach((task, index) => renderTask(task, index)); // Renderiza cada tarefa
  updateCompletedCount(); // Atualiza o contador de tarefas concluídas
}

// Função para adicionar uma nova tarefa
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita o reload da página

  const taskName = taskInput.value.trim();
  const taskTag = tagInput.value.trim();

  if (taskName && taskTag) {
    const newTask = {
      name: taskName,
      tag: taskTag,
      date: new Date().toLocaleDateString("pt-BR"),
      completed: false
    };

    tasks.push(newTask); // Adiciona a nova tarefa ao array de tarefas
    renderTask(newTask, tasks.length - 1); // Renderiza a nova tarefa
    taskInput.value = ""; // Limpa os campos de entrada
    tagInput.value = "";

    saveTasksToLocalStorage(); // Salva as tarefas no Local Storage
  }
});

// Função para criar o ícone de tarefa concluída
function createCompletedIcon() {
  const completedIcon = document.createElement("img");
  completedIcon.setAttribute("src", "./assets/completed.svg");
  completedIcon.setAttribute("alt", "Tarefa concluída");
  return completedIcon;
}

// Função para atualizar o contador de tarefas concluídas
function updateCompletedCount() {
  completedTasksCount = tasks.filter(task => task.completed).length;
  completedCountElement.textContent = `${completedTasksCount} tarefa(s) concluída(s)`;
}

// Carregar as tarefas ao carregar a página
document.addEventListener("DOMContentLoaded", loadTasks);
