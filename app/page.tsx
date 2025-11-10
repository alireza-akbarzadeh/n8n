import {requireAuth} from "@/actions/auth";

export default async function Home() {
    await requireAuth();
    return (
        <div>hellow owrl</div>
    );
}
