import { requireAuth } from "@/actions/auth";
import { prefetchWorflows } from "@/modules/workflows/server/prefetch";
import { Workflows } from "@/modules/workflows";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { WorkflowContainer } from "@/modules/workflows/ui/workflows";

export default async function WrokflowsPage() {
  await requireAuth();
  prefetchWorflows();

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
