import Project from "./Project";
import Storage from "./Storage";

export default class ScreenController {
  static loadHomepage() {
    this.displayProjects();
    // const addProjectButton = document.querySelector(".project-add-button");
    this.initAddProjectModal();
  }

  static displayProjects() {
    const projectsDiv = document.querySelector(".projects-div");
    const contentDiv = document.querySelector(".content");
    const projects = JSON.parse(localStorage.getItem("projects"));

    projectsDiv.innerHTML = "";

    for (let i in projects) {
      const projectDiv = document.createElement("div");
      // const projectTitle = document.createElement("p");
      const todoListDiv = document.createElement("div");
      const todoList = document.createElement("ul");

      projectDiv.classList.add("project-div");
      projectDiv.dataset.index = i;

      projectDiv.textContent = `#  ${projects[i].title}`;
      // this.displayTaskPreview(projects[i], todoList);

      // projectDiv.appendChild(projectTitle);
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
    const selectedProject = Storage.getProject(event.target.dataset.index);
    this.displayProjectDetail(selectedProject);
  }

  static initAddProjectModal() {
    const dialog = document.createElement("dialog");

    dialog.innerHTML = `
      <form> 
          <label>
            Project name
          <input id="project-name" required></input>
          </label>
        <div>
          <button class="cancel-btn" type="reset" value="cancel" formmethod="dialog">Cancel</button>
          <button id="confirmBtn" type="submit" class="confirm-btn" value="default">Confirm</button>
        </div>
      </form>`;

    const contentDiv = document.querySelector(".content");

    contentDiv.appendChild(dialog);

    const closeButton = document.querySelector(".cancel-btn");
    closeButton.addEventListener("click", () => {
      dialog.close();
    });

    const submitButton = document.querySelector(".confirm-btn");
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.createProject();
      dialog.close();
      this.displayProjects();
    });

    const addProjectButton = document.querySelector(".project-add-button");

    // "Show the dialog" button opens the dialog modally
    addProjectButton.addEventListener("click", () => {
      dialog.showModal();
    });

    // "Close" button closes the dialog
    closeButton.addEventListener("click", () => {
      dialog.close();
    });
  }

  static displayProjectDetail(project) {
    console.log(project);
    const contentDiv = document.querySelector(".content");
    const projectDetailDiv = document.createElement("div");
    projectDetailDiv.classList.add("project-detail");
    contentDiv.innerHTML = "";
    const projectTitleDiv = document.createElement("div");
    const projectTitleInput = document.createElement("input");
    const addTaskDiv = document.createElement("div");
    const tasksDiv = document.createElement("div");

    projectTitleInput.value = project.title;
    projectTitleDiv.appendChild(projectTitleInput);
    contentDiv.appendChild(projectTitleDiv);

    for (let i in project.tasks) {
      // const contentDiv = document.querySelector(".content");
      const currentTask = this.renderTask(project.tasks[i]);
      projectDetailDiv.appendChild(currentTask);
    }

    contentDiv.appendChild(projectDetailDiv);
  }

  // static addTaskModal() {
  //   const dialog = document.createElement("dialog");

  //   dialog.innerHTML = `
  //     <form>
  //         <label>
  //           Project name
  //         <input id="project-name" required></input>
  //         </label>
  //         <label>
  //           Description
  //         <textarea id="project-desc"></textarea>
  //         </label>
  //         <div class="flex">
  //         <label>
  //           Priority
  //           <select id="project-prio">
  //             <option>High</option>
  //             <option selected="selected">Medium</option>
  //             <option>Low</option>
  //           </select>
  //         </label>
  //         <label>
  //           Due To
  //         <input id="project-due" type="date"></input>
  //         </label>
  //         </div>
  //       <div>
  //         <button class="cancel-btn" type="reset" value="cancel" formmethod="dialog">Cancel</button>
  //         <button id="confirmBtn" type="submit" class="confirm-btn" value="default">Confirm</button>
  //       </div>
  //     </form>`;

  //   const contentDiv = document.querySelector(".content");

  //   contentDiv.appendChild(dialog);

  //   const closeButton = document.querySelector(".cancel-btn");
  //   closeButton.addEventListener("click", () => {
  //     dialog.close();
  //   });

  //   const submitButton = document.querySelector(".confirm-btn");
  //   submitButton.addEventListener("click", (event) => {
  //     console.log("submit pressed");
  //     event.preventDefault();
  //     console.log("prevented");
  //     this.createProject();
  //     console.log("create project");
  //     dialog.close();
  //   });

  //   const addProjectButton = document.querySelector(".project-add-button");

  //   // "Show the dialog" button opens the dialog modally
  //   addProjectButton.addEventListener("click", () => {
  //     dialog.showModal();
  //   });

  //   // "Close" button closes the dialog
  //   closeButton.addEventListener("click", () => {
  //     dialog.close();
  //   });
  // }

  static createProject() {
    const projectTitleInput = document.querySelector("#project-name");
    const newProject = new Project(projectTitleInput.value);
    Storage.storeProject(newProject);
  }

  static renderTask(task) {
    const taskDiv = document.createElement("div");
    const taskTitle = document.createElement("h2");
    const descriptionDiv = document.createElement("h3");
    const dueDateDiv = document.createElement("div");
    const priorityDiv = document.createElement("div");

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
    // priorityDiv.textContent = task.priority;

    taskDiv.appendChild(titleWrapper);
    taskDiv.appendChild(descriptionDiv);
    taskDiv.appendChild(dueDateDiv);

    return taskDiv;
  }
}
