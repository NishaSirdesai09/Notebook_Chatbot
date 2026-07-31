"use client";

import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/states";

export default function ReferencesPage() {
  return (
    <PageContainer>
      <PageHeader title="References" description="Curated reference links for your notebooks." />
      <EmptyState icon="Link" title="Coming soon" description="Reference link indexing will be added in a future release." />
    </PageContainer>
  );
}
