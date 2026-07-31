"use client";

import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/states";

export default function FlashcardsPage() {
  return (
    <PageContainer>
      <PageHeader title="Flashcards" description="Revision decks from your uploaded materials." />
      <EmptyState icon="Flashcard" title="Coming soon" description="Flashcards will use the same RAG pipeline as chat." />
    </PageContainer>
  );
}
