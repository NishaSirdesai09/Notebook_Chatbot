import { AppShell } from "@/components/app/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DocumentsProvider } from "@/context/DocumentsContext";
import { NotebooksProvider } from "@/context/NotebooksContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NotebooksProvider>
        <DocumentsProvider>
          <AppShell>{children}</AppShell>
        </DocumentsProvider>
      </NotebooksProvider>
    </AuthGuard>
  );
}
