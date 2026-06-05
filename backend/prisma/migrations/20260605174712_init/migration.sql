-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "course" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT 'General',
    "visibility" TEXT NOT NULL DEFAULT 'Private',
    "files" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Processing',
    "color" TEXT NOT NULL DEFAULT 'from-brand-500 to-accent-purple',
    "questionsAsked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "Notebook_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT '—',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "pages" INTEGER,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Document_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "explanation" TEXT,
    "keyPoints" TEXT,
    "practiceQuestion" TEXT,
    "notFound" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "ChatMessage_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "document" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "chapter" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    CONSTRAINT "Citation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notebookName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bullets" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notebookId" TEXT,
    CONSTRAINT "Summary_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "notebookId" TEXT
);

-- CreateTable
CREATE TABLE "ReferenceLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Indexing',
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CanvasCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "files" INTEGER NOT NULL DEFAULT 0,
    "selected" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Document_notebookId_idx" ON "Document"("notebookId");

-- CreateIndex
CREATE INDEX "ChatMessage_notebookId_idx" ON "ChatMessage"("notebookId");

-- CreateIndex
CREATE INDEX "Citation_messageId_idx" ON "Citation"("messageId");
