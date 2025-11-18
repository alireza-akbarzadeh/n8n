import { Editor, EditorError, EditorHeader, EditorLoading } from '@/features/editor';
import { prefetchWorflow } from '@/features/workflows';
import { HydrateClient } from '@/core/api/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
          <main className="h-full">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
