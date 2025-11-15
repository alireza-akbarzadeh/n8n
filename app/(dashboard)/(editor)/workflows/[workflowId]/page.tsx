import { Editor, EditorError, EditorHeader, EditorLoading } from "@/modules/editor";
import { prefetchWorflow } from "@/modules/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowId({ params }: PageProps) {
  const { workflowId } = await params;
  prefetchWorflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main>
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
