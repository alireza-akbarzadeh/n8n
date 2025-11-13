import { requireAuth } from "@/actions/auth";
import { prefetchWorflows } from "@/modules/workflows/server/prefetch";
import { baseLoaderParams, Workflows } from "@/modules/workflows";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { WorkflowContainer } from "@/modules/workflows/ui/workflows";
import { SearchParams } from "nuqs/server";

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
        <ErrorBoundary fallback={<p>Error!</p>}>
          <Suspense fallback={<p>loading...</p>}>
            <Workflows />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
