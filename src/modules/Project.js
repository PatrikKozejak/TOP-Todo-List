export default class Project {
  constructor(title = "New Project") {
    this.title = title;
    this.tasks = [];
  }

  static getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getTasks() {
    return this.tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
  }
}
