export interface Doc {
  type: string;
  title: string;
  description: string;
  icon: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: File;
  date: string;
  folder: string;
}

export interface ExternalLinks {
  git: string;
  jira: string;
  figma: string;
  confluence: string;
}

export interface DocForm {
  title: string;
  description: string;
  icon: string;
}
