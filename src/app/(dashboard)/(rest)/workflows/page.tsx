import {
  prefetchWorflows,
  WorkflowError,
  WorkflowLoading,
  WorkflowsModule,
} from '@/features/workflows';
import { HydrateClient } from '@/core/api/trpc/server';
import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { SearchParams } from 'nuqs/server';
import { requireAuth } from '@/core/auth';
import { baseLoaderParams } from '@/features/workflows/presentation/server/load-params';
import { WorkflowContainer } from '@/features/workflows';

type PropsPage = {
  searchParams: Promise<SearchParams>;
};

export default async function WrokflowsPage({ searchParams }: PropsPage) {
  await requireAuth();
  const params = await baseLoaderParams(searchParams);

  prefetchWorflows(params);

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError />}>
          <Suspense fallback={<WorkflowLoading />}>
            <WorkflowsModule />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
