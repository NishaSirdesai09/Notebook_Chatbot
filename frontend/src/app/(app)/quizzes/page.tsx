"use client";

import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/states";

export default function QuizzesPage() {
  return (
    <PageContainer>
      <PageHeader title="Quizzes" description="Practice questions generated from your course materials." />
      <EmptyState icon="Quiz" title="Coming soon" description="Quizzes will use the same RAG pipeline as chat." />
    </PageContainer>
  );
}
