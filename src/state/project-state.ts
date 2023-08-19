import { Project, ProjectStatus } from "../models/project-model.js";

// Project state management

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = []; // Listeners to subscribe to
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState; // This means there can only be 1 object instantiated

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    // Subscribe to the listeners
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // Return a copy of the array (not a reference, don't want it to be modified)
    }
  }
}

// Instantiate previous class; manage project global state
export const projectState = ProjectState.getInstance();
