/**
 * Seeds the database with the same demo data the API ships with.
 * Idempotent: clears existing rows, then re-creates them.
 *
 * Run with: npm run prisma:seed
 */
import { PrismaClient } from '@prisma/client';
import {
  seedAssistantAnswer,
  seedCanvasCourses,
  seedDocuments,
  seedNotebooks,
  seedQuiz,
  seedReferences,
  seedSummary,
} from '../src/common/seed';

const prisma = new PrismaClient();

async function main() {
  // Clear in FK-safe order.
  await prisma.citation.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.summary.deleteMany();
  await prisma.document.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.referenceLink.deleteMany();
  await prisma.canvasCourse.deleteMany();
  await prisma.notebook.deleteMany();

  // Notebooks
  for (const n of seedNotebooks) {
    await prisma.notebook.create({
      data: {
        id: n.id,
        title: n.title,
        course: n.course,
        description: n.description,
        subject: n.subject,
        visibility: n.visibility,
        files: n.files,
        status: n.status,
        color: n.color,
        questionsAsked: n.questionsAsked,
      },
    });
  }

  // Documents
  for (const d of seedDocuments) {
    await prisma.document.create({
      data: {
        id: d.id,
        name: d.name,
        type: d.type,
        size: d.size,
        status: d.status,
        pages: d.pages,
        uploadedAt: new Date(d.uploadedAt),
        notebookId: d.notebookId,
      },
    });
  }

  // Quiz questions
  for (const q of seedQuiz) {
    await prisma.quizQuestion.create({
      data: {
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options ? JSON.stringify(q.options) : null,
        answer: q.answer,
        explanation: q.explanation,
        notebookId: seedNotebooks[0].id,
      },
    });
  }

  // Summary
  await prisma.summary.create({
    data: {
      id: seedSummary.id,
      notebookName: seedSummary.notebook,
      type: seedSummary.type,
      title: seedSummary.title,
      content: seedSummary.content,
      bullets: JSON.stringify(seedSummary.bullets),
      createdAt: new Date(seedSummary.createdAt),
      notebookId: seedNotebooks[0].id,
    },
  });

  // Reference links
  for (const r of seedReferences) {
    await prisma.referenceLink.create({
      data: {
        id: r.id,
        url: r.url,
        title: r.title,
        category: r.category,
        status: r.status,
        addedAt: new Date(r.addedAt),
      },
    });
  }

  // Canvas courses
  for (const c of seedCanvasCourses) {
    await prisma.canvasCourse.create({
      data: {
        id: c.id,
        name: c.name,
        code: c.code,
        files: c.files,
        selected: c.selected,
      },
    });
  }

  // Example assistant chat message with citations (attached to first notebook)
  await prisma.chatMessage.create({
    data: {
      id: seedAssistantAnswer.id,
      role: seedAssistantAnswer.role,
      content: seedAssistantAnswer.content,
      explanation: seedAssistantAnswer.explanation,
      keyPoints: seedAssistantAnswer.keyPoints ? JSON.stringify(seedAssistantAnswer.keyPoints) : null,
      practiceQuestion: seedAssistantAnswer.practiceQuestion,
      notFound: seedAssistantAnswer.notFound ?? false,
      notebookId: seedNotebooks[0].id,
      citations: {
        create: (seedAssistantAnswer.citations ?? []).map((c) => ({
          id: c.id,
          document: c.document,
          page: c.page,
          chapter: c.chapter,
          snippet: c.snippet,
        })),
      },
    },
  });

  const counts = {
    notebooks: await prisma.notebook.count(),
    documents: await prisma.document.count(),
    quizQuestions: await prisma.quizQuestion.count(),
    summaries: await prisma.summary.count(),
    references: await prisma.referenceLink.count(),
    canvasCourses: await prisma.canvasCourse.count(),
    chatMessages: await prisma.chatMessage.count(),
  };
  console.log('Seed complete:', counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
