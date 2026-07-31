"use client";

import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/states";

export default function CanvasPage() {
  return (
    <PageContainer>
      <PageHeader title="Canvas" description="Sync course files from Canvas LMS." />
      <EmptyState icon="Canvas" title="Coming soon" description="Canvas integration is not implemented yet." />
    </PageContainer>
  );
}
