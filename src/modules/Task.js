export default class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  geTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  geDueDate() {
    return this.dueDate;
  }

  getPriority() {
    return this.priority;
  }
}
