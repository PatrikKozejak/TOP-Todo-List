export default class Storage {
  constructor() {}

  static getProject(index) {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    return projects[index];
  }

  static getProjects() {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  }

  static storeProject(newProject) {
    const projects = this.getProjects();
    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static editProject(projectIndex, newProject) {
    const projects = this.getProjects();
    projects[projectIndex] = newProject;
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static getTask(projectIndex, taskIndex) {
    const projects = this.getProjects();
    return projects[projectIndex].tasks[taskIndex];
  }

  static storeTask(projectIndex, newTask) {
    const projects = this.getProjects();
    projects[projectIndex].tasks.push(newTask);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static editTask(projectIndex, taskIndex, editedTask) {
    const projects = this.getProjects();
    projects[projectIndex].tasks[taskIndex] = editedTask;
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static deleteTask(projectIndex, taskIndex) {
    const projects = this.getProjects();
    projects[projectIndex].tasks.splice(taskIndex, 1);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static clearStorage() {
    localStorage.clear();
  }
}
