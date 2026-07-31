"use client";

import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/states";

export default function SummariesPage() {
  return (
    <PageContainer>
      <PageHeader title="Summaries" description="Auto-generated summaries from your indexed materials." />
      <EmptyState icon="Summary" title="Coming soon" description="Summaries will use the same RAG pipeline as chat." />
    </PageContainer>
  );
}
