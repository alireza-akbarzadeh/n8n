import { requireAuth } from "@/actions/auth";
import { prefetchWorflows } from "@/modules/workflows/server/prefetch";
import { baseLoaderParams, WorkflowError, WorkflowLoading, WorkflowsModule } from "@/modules/workflows";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { SearchParams } from "nuqs/server";
import { WorkflowContainer } from "@/modules/workflows/containers/workflow-containers";

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
