-- AlterTable
ALTER TABLE "Document" ADD COLUMN "errorMessage" TEXT;
ALTER TABLE "Document" ADD COLUMN "storagePath" TEXT;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "llmProviderId" TEXT,
    "llmModelId" TEXT,
    "studyMode" TEXT NOT NULL DEFAULT 'balanced',
    "responseLength" TEXT NOT NULL DEFAULT 'balanced',
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
