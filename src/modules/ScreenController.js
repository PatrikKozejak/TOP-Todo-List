import Project from "./Project";
import Storage from "./Storage";
import Task from "./Task";

export default class ScreenController {
  static loadHomepage() {
    this.displayProjects();
    this.initAddProjectModal();
    this.initAddTaskModal();
  }

  static displayProjects() {
    const projectsDiv = document.querySelector(".projects-div");
    const projects = JSON.parse(localStorage.getItem("projects"));

    projectsDiv.innerHTML = "";

    for (let i in projects) {
      const projectDiv = document.createElement("div");
      const todoListDiv = document.createElement("div");
      const todoList = document.createElement("ul");

      projectDiv.classList.add("project-div");
      projectDiv.dataset.index = i;

      projectDiv.textContent = `#  ${projects[i].title}`;

      todoListDiv.appendChild(todoList);
      projectDiv.appendChild(todoListDiv);
      projectsDiv.appendChild(projectDiv);
      projectDiv.addEventListener("click", this.displayContent.bind(this));
    }
  }

  static displayTaskPreview(project, todoList) {
    for (let j in project.tasks) {
      const listItem = document.createElement("li");
      listItem.textContent = project.tasks[j].title;
      todoList.appendChild(listItem);
    }
  }

  static displayContent(event) {
    this.selectProject(event.target);
    const selectedProject = Storage.getProject(event.target.dataset.index);
    this.displayProjectDetail(selectedProject);
  }

  static selectProject(selectedProject) {
    const projects = document.querySelectorAll(".project-div");
    projects.forEach((project) => {
      project.classList.remove("selected");
    });
    selectedProject.classList.add("selected");
  }

  static initAddProjectModal() {
    const addProjectDialog = document.createElement("dialog");

    addProjectDialog.innerHTML = `
      <form id="addProject"> 
          <label>
            Project name
          <input id="project-name" required></input>
          </label>
        <div>
          <button class="add-project-cancel-btn" type="reset" value="cancel" formmethod="dialog">Cancel</button>
          <button id="confirmBtn" type="submit" class="confirm-btn" value="default">Confirm</button>
        </div>
      </form>`;

    const body = document.querySelector("body");

    body.appendChild(addProjectDialog);

    const closeButton = document.querySelector(".add-project-cancel-btn");
    closeButton.addEventListener("click", () => {
      addProjectDialog.close();
    });

    const submitButton = document.querySelector(".confirm-btn");
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.createProject();
      document.getElementById("addProject").reset();
      addProjectDialog.close();
      this.displayProjects();
    });

    const addProjectButton = document.querySelector(".project-add-button");

    addProjectButton.addEventListener("click", () => {
      addProjectDialog.showModal();
    });

    closeButton.addEventListener("click", () => {
      addProjectDialog.close();
    });
  }

  static initAddTaskModal() {
    const addTaskDialog = document.createElement("dialog");
    addTaskDialog.classList.add("task-dialog");

    addTaskDialog.innerHTML = `
      <form id="addTask">
        <label>
          Task title
          <input id="task-title" required></input>
        </label>
        <label>
          Description
          <textarea id="task-desc"></textarea>
        </label>
        <div class="flex">
          <label>
            Priority
            <select id="task-prio">
              <option value="high">High</option>
              <option value="medium" selected="selected">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Due To
          <input id="task-due" type="date"></input>
          </label>
          </div>
        <div>
          <button class="add-task-cancel-btn" type="reset" value="cancel" formmethod="dialog">Cancel</button>
          <button id="taskConfirmBtn" type="submit" class="confirm-btn" value="default">Confirm</button>
        </div>
      </form>`;

    const body = document.querySelector("body");

    body.appendChild(addTaskDialog);

    const closeButton = document.querySelector(".add-task-cancel-btn");
    closeButton.addEventListener("click", () => {
      addTaskDialog.close();
    });

    const submitButton = document.querySelector("#taskConfirmBtn");
    submitButton.addEventListener("click", (event) => {
      const currentProject = document.querySelector(".selected");

      event.preventDefault();
      this.createTask();
      document.getElementById("addTask").reset();
      addTaskDialog.close();
      const selectedProject = Storage.getProject(currentProject.dataset.index);
      this.displayProjectDetail(selectedProject);
    });
  }

  static displayProjectDetail(project) {
    const contentDiv = document.querySelector(".content");
    const projectDetailDiv = document.createElement("div");
    projectDetailDiv.classList.add("project-detail");
    contentDiv.innerHTML = "";
    const projectTitleDiv = document.createElement("div");
    const projectTitleInput = document.createElement("input");

    projectTitleInput.value = project.title;
    projectTitleInput.classList.add("project-title-input");
    projectTitleDiv.appendChild(projectTitleInput);
    contentDiv.appendChild(projectTitleDiv);

    contentDiv.appendChild(this.renderAddButton("task"));

    for (let i in project.tasks) {
      const currentTask = this.renderTask(project.tasks[i]);
      currentTask.dataset.index = i;
      projectDetailDiv.appendChild(currentTask);
    }

    contentDiv.appendChild(projectDetailDiv);
  }

  static createProject() {
    const projectTitleInput = document.querySelector("#project-name");
    const newProject = new Project(projectTitleInput.value);
    Storage.storeProject(newProject);
  }

  static renderAddButton(type) {
    const addTaskIcon = document.createElement("div");
    const addTaskButton = document.createElement("button");
    const addTaskButtonText = document.createElement("div");
    const addTaskDialog = document.querySelector(".task-dialog");

    addTaskIcon.classList.add("plus-icon");
    addTaskButton.classList.add("add-task-button");

    addTaskButtonText.textContent = "Add Task";

    addTaskButton.appendChild(addTaskIcon);
    addTaskButton.appendChild(addTaskButtonText);

    addTaskButton.addEventListener("click", () => {
      addTaskDialog.showModal();
    });

    return addTaskButton;
  }

  static createTask() {
    const selectedProject = document.querySelector(".selected");

    const taskTitleInput = document.querySelector("#task-title");
    const taskDescritpionInput = document.querySelector("#task-desc");
    const taskPriorityInput = document.querySelector("#task-prio");
    const taskDueInput = document.querySelector("#task-due");
    const newTask = new Task(
      taskTitleInput.value,
      taskDescritpionInput.value,
      taskDueInput.value,
      taskPriorityInput.value
    );
    Storage.storeTask(selectedProject.dataset.index, newTask);
    this.displayProjectDetail(selectedProject);
  }

  static renderTask(task) {
    const taskDiv = document.createElement("div");
    const taskBody = document.createElement("div");
    const taskCheckboxLabel = document.createElement("label");
    const taskCheckbox = document.createElement("input");
    const taskCheckmark = document.createElement("span");
    const taskTitle = document.createElement("h2");
    const descriptionDiv = document.createElement("p");
    const dueDateDiv = document.createElement("div");
    const priorityDiv = document.createElement("div");
    const taskDeleteButton = document.createElement("button");
    const taskDeleteIcon = document.createElement("div");

    taskBody.classList.add("task-body");

    taskCheckboxLabel.textContent = "";
    taskCheckboxLabel.classList.add("container");
    taskCheckboxLabel.appendChild(taskCheckbox);
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.classList.add("task-done");

    taskCheckbox.addEventListener("change", () => {
      const parentTask = taskCheckbox.parentElement.parentElement;
      if (taskCheckbox.checked) {
        parentTask.classList.add("task-done");
      } else {
        parentTask.classList.remove("task-done");
      }
    });

    taskCheckmark.classList.add("checkmark");
    taskCheckboxLabel.appendChild(taskCheckmark);

    taskDeleteButton.classList.add("task-delete");
    taskDeleteIcon.classList.add("task-delete-icon");

    descriptionDiv.classList.add("task-description");
    dueDateDiv.classList.add("task-due");

    const priorityTooltip = document.createElement("span");
    priorityTooltip.textContent = `${task.priority} priority`;
    priorityTooltip.classList.add("tooltiptext");
    priorityDiv.appendChild(priorityTooltip);

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("task-wrapper");
    titleWrapper.appendChild(priorityDiv);
    titleWrapper.appendChild(taskTitle);

    priorityDiv.classList.add("priority-div");
    priorityDiv.classList.add(task.priority);

    taskDiv.classList.add("task");

    taskTitle.textContent = task.title;
    descriptionDiv.textContent = task.description;
    dueDateDiv.textContent = task.dueDate;

    taskDeleteButton.addEventListener("click", () => {
      const taskIndex = taskDeleteButton.parentElement.dataset.index;
      this.deleteTask(taskIndex);
    });

    taskDeleteButton.appendChild(taskDeleteIcon);

    taskBody.appendChild(titleWrapper);
    taskBody.appendChild(descriptionDiv);
    taskBody.appendChild(dueDateDiv);

    taskDiv.appendChild(taskCheckboxLabel);
    taskDiv.appendChild(taskBody);
    taskDiv.appendChild(taskDeleteButton);

    return taskDiv;
  }

  static deleteTask(taskIndex) {
    const currentProject = document.querySelector(".selected");
    const projectIndex = currentProject.dataset.index;

    Storage.deleteTask(projectIndex, taskIndex);
    this.displayProjectDetail(Storage.getProject(projectIndex));
  }
}
