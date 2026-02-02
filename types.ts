export enum ProjectStatus {
  COMPLETED = "Completed",
  IN_PROGRESS = "In Progress",
  ARCHIVED = "Archived",
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string; // Longer text for the AI context
  status: ProjectStatus;
  technologies: string[];
  imageUrl: string;
  demoLink?: string;
  repoLink?: string;
  completionDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  isThinking?: boolean;
}
