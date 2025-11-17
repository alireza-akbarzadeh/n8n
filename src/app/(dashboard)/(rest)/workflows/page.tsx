import {
  prefetchWorflows,
  WorkflowError,
  WorkflowLoading,
  WorkflowsModule,
} from '@/modules/workflows';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { SearchParams } from 'nuqs/server';
import { requireAuth } from '@/src/core/auth';
import { baseLoaderParams } from '@/src/features/workflows/presentation/server/load-params';
import { WorkflowContainer } from '@/src//features/workflows';

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
