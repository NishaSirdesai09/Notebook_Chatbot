export type Role = 'Student' | 'Professor' | 'Admin';
export type NotebookStatus = 'Processing' | 'Ready' | 'Failed';
export type Visibility = 'Private' | 'Shared with class';
export type DocType = 'pdf' | 'docx' | 'ppt' | 'txt' | 'image' | 'link' | 'youtube' | 'canvas' | 'reference';
export type DocStatus =
  | 'queued'
  | 'extracting'
  | 'chunking'
  | 'embedding'
  | 'indexing'
  | 'ready'
  | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Notebook {
  id: string;
  title: string;
  course: string;
  description: string;
  subject: string;
  visibility: Visibility;
  files: number;
  status: NotebookStatus;
  updatedAt: string;
  color: string;
  questionsAsked: number;
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: DocType;
  size: string;
  notebookId: string;
  status: DocStatus;
  pages?: number;
  processingProgress?: number;
  processingStage?: string;
  uploadedAt: string;
}

export interface Citation {
  id: string;
  document: string;
  page: number;
  chapter: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  explanation?: string;
  keyPoints?: string[];
  practiceQuestion?: string;
  citations?: Citation[];
  notFound?: boolean;
}

export interface Summary {
  id: string;
  notebook: string;
  type: string;
  title: string;
  content: string;
  bullets: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'MCQ' | 'Short Answer' | 'True/False';
  options?: string[];
  answer: string;
  explanation: string;
}

export interface CanvasCourse {
  id: string;
  name: string;
  code: string;
  files: number;
  selected: boolean;
}

export interface ReferenceLink {
  id: string;
  url: string;
  title: string;
  category: string;
  status: 'Indexed' | 'Indexing' | 'Failed';
  addedAt: string;
}
