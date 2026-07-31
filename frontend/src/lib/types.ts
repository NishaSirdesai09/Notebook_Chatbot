export type Role = "Student" | "Professor" | "Admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

export type NotebookStatus = "Processing" | "Ready" | "Failed";

export type Notebook = {
  id: string;
  title: string;
  course: string;
  description: string;
  subject: string;
  visibility: "Private" | "Shared with class";
  files: number;
  status: NotebookStatus;
  updatedAt: string;
  color: string;
  questionsAsked: number;
};

export type DocType = "pdf" | "docx" | "ppt" | "txt" | "image" | "link" | "youtube" | "canvas" | "reference";

export type Document = {
  id: string;
  name: string;
  type: DocType;
  size: string;
  notebookId: string;
  status: "queued" | "extracting" | "chunking" | "embedding" | "indexing" | "ready" | "failed";
  pages?: number;
  uploadedAt: string;
};

export type Citation = {
  id: string;
  document: string;
  page: number;
  chapter: string;
  snippet: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  explanation?: string;
  keyPoints?: string[];
  practiceQuestion?: string;
  citations?: Citation[];
  notFound?: boolean;
  feedback?: "up" | "down" | null;
};

export type Summary = {
  id: string;
  notebook: string;
  type: string;
  title: string;
  content: string;
  bullets: string[];
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: "MCQ" | "Short Answer" | "True/False";
  options?: string[];
  answer: string;
  explanation: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  deck: string;
  known: boolean;
};

export type ReferenceLink = {
  id: string;
  url: string;
  title: string;
  category: string;
  status: "Indexed" | "Indexing" | "Failed";
  addedAt: string;
};

export type CanvasCourse = {
  id: string;
  name: string;
  code: string;
  files: number;
  selected: boolean;
};

export type LlmCatalog = {
  id: string;
  name: string;
  requiresApiKey?: boolean;
  apiKeyHint?: string;
  models: { id: string; name: string; default?: boolean }[];
};

export type UserSettings = {
  llmProviderId: string;
  llmModelId: string;
  studyMode: string;
  responseLength: string;
  apiKeyStatus?: Record<string, boolean>;
  activeProviderRequiresKey?: boolean;
  embeddingProviderRequiresKey?: boolean;
};

export type Activity = {
  id: string;
  type: "upload" | "chat" | "quiz" | "summary" | "notebook";
  text: string;
  time: string;
};
