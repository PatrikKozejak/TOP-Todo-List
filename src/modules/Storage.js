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

  static storeTask(projectIndex, newTask) {
    const projects = this.getProjects();
    projects[projectIndex].tasks.push(newTask);
    localStorage.setItem("projects", JSON.stringify(projects));
  }
}
