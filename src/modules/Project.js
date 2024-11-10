export default class Project {
  constructor(title = "New Project", isSelected = false) {
    this.title = title;
    this.tasks = [];
    this.isSelected = isSelected;
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
