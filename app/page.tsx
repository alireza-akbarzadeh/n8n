"use client";
import {SignOutButton} from "@/modules/auth/ui/sign-out-button";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";

export default function Home() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const {data} = useQuery(trpc.getWorkflow.queryOptions());
    const create = useMutation(trpc.createWorkflow.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.getWorkflow.queryOptions())
        }
    }));

    return (
        <>
            <div>{data?.map((item) => (
                <div key={item.name}>{item.name}</div>
            ))}
                <Button disabled={create.isPending} onClick={() => create.mutate()}>Create</Button>
                <SignOutButton/>
            </div>
        </>
    );
}
