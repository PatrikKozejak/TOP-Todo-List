import Project from "./Project";
import Storage from "./Storage";
import { formatDistanceToNow, isPast } from "date-fns";
import Task from "./Task";

export default class ScreenController {
  static loadHomepage() {
    this.createDemoProject();
  }

  static createDemoProject() {
    Storage.clearStorage();
    const demoProject = new Project();
    const demoTask1 = new Task(
      "First Task",
      "Task Description",
      "2025-01-31",
      "high"
    );
    const demoTask2 = new Task(
      "Second Task",
      "Task Description too",
      "2024-12-24",
      "medium"
    );

    demoProject.addTask(demoTask1);
    demoProject.addTask(demoTask2);

    Storage.storeProject(demoProject);

    this.displayProjects();
    const demoProjectDiv = document.querySelector('div[data-index="0"]');
    this.selectProject(demoProjectDiv);
    this.initAddProjectModal();
    this.initAddTaskModal();
    this.displayProjectDetail(demoProject);
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
    const selectedProjectIndex = selectedProject.dataset.index;

    const projects = Storage.getProjects();
    projects.forEach((project, index) => {
      project.isSelected = false;
      Storage.editProject(index, project);
    });
    const project = projects[selectedProjectIndex];
    project.isSelected = true;
    Storage.editProject(selectedProjectIndex, project);
  }

  static initAddProjectModal() {
    const addProjectDialog = document.createElement("dialog");

    addProjectDialog.innerHTML = `
      <form id="addProject"> 
          <label>
            Project name
          <input id="project-title" required></input>
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
      event.preventDefault();
      this.storeTask();
      document.getElementById("addTask").reset();
      addTaskDialog.close();
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

    projectTitleInput.addEventListener(
      "focusout",
      this.editProjectTitle.bind(this)
    );

    projectTitleDiv.appendChild(projectTitleInput);
    contentDiv.appendChild(projectTitleDiv);

    contentDiv.appendChild(this.createAddButton());

    for (let i in project.tasks) {
      const currentTask = this.createTask(project.tasks[i]);
      currentTask.dataset.index = i;
      projectDetailDiv.appendChild(currentTask);
    }
    contentDiv.appendChild(projectDetailDiv);
  }

  static createProject() {
    const projectTitleInput = document.querySelector("#project-title");
    const newProject = new Project(projectTitleInput.value);
    Storage.storeProject(newProject);
  }

  static createAddButton() {
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

  static storeTask() {
    const { project, projectIndex } = Storage.getSelectedProject();

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
    const projectWithNewTask = Storage.storeTask(projectIndex, newTask);
    this.displayProjectDetail(projectWithNewTask);
  }

  static createTask(task) {
    const taskDiv = document.createElement("div");
    const taskBody = document.createElement("div");
    const taskCheckboxLabel = document.createElement("label");
    const taskCheckbox = document.createElement("input");
    const taskCheckmark = document.createElement("span");
    const taskTitle = document.createElement("input");
    const taskDescriptionDiv = document.createElement("div");
    const taskDescription = document.createElement("input");
    const taskDueDateDiv = document.createElement("div");
    const taskDueDate = document.createElement("input");
    const taskDueDateDistance = document.createElement("div");
    const taskPriority = document.createElement("div");
    const taskPrioritySelect = document.createElement("select");
    const taskLowPriorityOption = document.createElement("option");
    const taskMidPriorityOption = document.createElement("option");
    const taskHighPriorityOption = document.createElement("option");
    const taskDeleteButton = document.createElement("button");
    const taskDeleteIcon = document.createElement("div");

    taskBody.classList.add("task-body");

    taskCheckboxLabel.textContent = "";
    taskCheckboxLabel.classList.add("container");
    taskCheckboxLabel.appendChild(taskCheckbox);
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.classList.add("task-done");

    taskCheckbox.addEventListener("change", this.editTaskStatus);

    taskCheckbox.checked = task.doneStatus;

    taskCheckmark.classList.add("checkmark");
    taskCheckboxLabel.appendChild(taskCheckmark);

    taskTitle.classList.add("task-title");
    taskTitle.addEventListener("focusout", this.editTaskTitle.bind(this));

    taskDescription.classList.add("task-description");
    taskDescription.addEventListener("focusout", this.editTaskDescription);

    taskDueDate.classList.add("task-due-date");
    taskDueDate.setAttribute("type", "date");
    taskDueDate.addEventListener("focusout", this.editTaskDueDate);
    taskDueDate.addEventListener("change", this.updateDistanceTime.bind(this));

    taskDueDateDistance.classList.add("task-due-date-distance");

    taskDeleteButton.classList.add("task-delete");
    taskDeleteIcon.classList.add("task-delete-icon");

    const priorityTooltip = document.createElement("span");
    priorityTooltip.textContent = `${task.priority} priority`;
    priorityTooltip.classList.add("tooltiptext");
    taskPriority.appendChild(priorityTooltip);

    taskPrioritySelect.classList.add("task-priority-select");
    taskPrioritySelect.addEventListener("change", this.editTaskPriority);
    taskPrioritySelect.textContent = "";
    taskLowPriorityOption.value = "low";
    taskLowPriorityOption.textContent = "low";
    taskMidPriorityOption.value = "medium";
    taskMidPriorityOption.textContent = "medium";
    taskHighPriorityOption.value = "high";
    taskHighPriorityOption.textContent = "high";

    taskPrioritySelect.appendChild(taskLowPriorityOption);
    taskPrioritySelect.appendChild(taskMidPriorityOption);
    taskPrioritySelect.appendChild(taskHighPriorityOption);
    taskPrioritySelect.setAttribute("priority", task.priority);

    for (const selectOption of taskPrioritySelect.children) {
      if (selectOption.value === task.priority) {
        selectOption.setAttribute("selected", "selected");
      }
    }

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("title-wrapper");
    taskPriority.appendChild(taskPrioritySelect);
    titleWrapper.appendChild(taskPriority);
    titleWrapper.appendChild(taskTitle);

    taskDescriptionDiv.classList.add("task-description-div");
    taskDescriptionDiv.appendChild(taskDescription);

    taskPriority.classList.add("priority-div");

    taskDueDateDiv.classList.add("task-due-date-div");
    taskDueDateDiv.appendChild(taskDueDate);
    taskDueDateDiv.appendChild(taskDueDateDistance);

    taskDiv.classList.add("task");

    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskDueDate.value = task.dueDate;
    taskDueDateDistance.textContent = this.determineTimeLeft(task.dueDate);

    taskDeleteButton.addEventListener("click", () => {
      const taskIndex = taskDeleteButton.parentElement.dataset.index;
      this.deleteTask(taskIndex);
    });

    taskDeleteButton.appendChild(taskDeleteIcon);

    taskBody.appendChild(titleWrapper);
    taskBody.appendChild(taskDescriptionDiv);
    taskBody.appendChild(taskDueDateDiv);

    taskDiv.appendChild(taskCheckboxLabel);
    taskDiv.appendChild(taskBody);
    taskDiv.appendChild(taskDeleteButton);

    const parentTask = taskCheckbox.parentElement.parentElement;
    if (task.doneStatus) {
      parentTask.classList.toggle("task-done");
    }

    return taskDiv;
  }

  static editProjectTitle(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const newTitle = event.target.value;

    project.title = newTitle;

    Storage.editProject(projectIndex, project);
    this.displayProjects();
  }

  static editTaskTitle(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const taskElement = event.target.parentElement.parentElement.parentElement;
    const taskIndex = taskElement.dataset.index;
    const newTitle = event.target.value;
    const task = project.tasks[taskIndex];

    task.title = newTitle;

    Storage.editTask(projectIndex, taskIndex, task);
  }

  static editTaskDescription(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const taskElement = event.target.parentElement.parentElement.parentElement;
    const taskIndex = taskElement.dataset.index;
    const newDescription = event.target.value;
    const task = project.tasks[taskIndex];

    task.description = newDescription;

    Storage.editTask(projectIndex, taskIndex, task);
  }

  static editTaskPriority(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const taskElement =
      event.target.parentElement.parentElement.parentElement.parentElement;
    const taskIndex = taskElement.dataset.index;
    const task = project.tasks[taskIndex];
    const newPriority = event.target.value;

    task.priority = newPriority;

    event.target.setAttribute("priority", newPriority);
    Storage.editTask(projectIndex, taskIndex, task);
  }

  static editTaskDueDate(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const taskElement = event.target.parentElement.parentElement.parentElement;
    const taskIndex = taskElement.dataset.index;
    const task = project.tasks[taskIndex];
    const newDueDate = event.target.value;

    task.dueDate = newDueDate;
    Storage.editTask(projectIndex, taskIndex, task);
  }

  static editTaskStatus(event) {
    const { project, projectIndex } = Storage.getSelectedProject();
    const taskElement = event.target.parentElement.parentElement;
    const taskIndex = taskElement.dataset.index;

    const task = project.tasks[taskIndex];
    task.doneStatus = !task.doneStatus;
    if (task.doneStatus) {
      event.target.checked = true;
    } else {
      event.target.checked = false;
    }
    taskElement.classList.toggle("task-done");
    Storage.editTask(projectIndex, taskIndex, task);
  }

  static deleteTask(taskIndex) {
    const { project, projectIndex } = Storage.getSelectedProject();
    this.displayProjectDetail(Storage.deleteTask(projectIndex, taskIndex));
  }

  static determineTimeLeft(dueDate) {
    if (isPast(dueDate)) {
      return `${formatDistanceToNow(dueDate)} ago`;
    } else {
      return `${formatDistanceToNow(dueDate)} left`;
    }
  }

  static updateDistanceTime(event) {
    const newDate = event.target.value;
    const distanceTimeDiv = event.target.nextElementSibling;
    distanceTimeDiv.textContent = this.determineTimeLeft(newDate);
  }
}
