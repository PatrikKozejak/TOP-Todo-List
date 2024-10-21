import Project from "./modules/Project";
import Task from "./modules/Task";
import ScreenController from "./modules/ScreenController";
import "./styles.css";

const project = new Project("Project title");
const todoItem = new Task("Title", "desc", "dueDate", "medium");
const todoItem2 = new Task("Title2", "desc2", "dueDate2", "high");
project.addTask(todoItem);
project.addTask(todoItem2);
const projects = [];
projects.push(project);

localStorage.setItem("projects", JSON.stringify(projects));

ScreenController.loadHomepage();
