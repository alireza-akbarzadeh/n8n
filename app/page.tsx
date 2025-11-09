import {HydrateClient, prefetch, trpc} from '@/trpc/server';
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {ClientGreeting} from "@/modules/home";

export default async function Home() {

    prefetch(trpc.getUsers.queryOptions());

    return (
        <HydrateClient>
            <div>...</div>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <ClientGreeting/>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    );
}
