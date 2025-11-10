import {requireAuth} from "@/actions/auth";
import {caller} from "@/trpc/server";

export default async function Home() {
    const user = await caller.getUsers()
    await requireAuth();
    return (
        <div>{JSON.stringify(user, null, 1)}</div>
    );
}
