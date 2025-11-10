"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {signOut} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface SignOutButtonProps {
    redirectTo?: string;
}

export function SignOutButton({redirectTo = "/"}: SignOutButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        try {
            setLoading(true);

            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed out successfully");
                        router.push(redirectTo);
                    },
                    onError: (context) => {
                        toast.error(context.error?.message || "Failed to sign out.");
                    },
                },
            });
        } catch (e) {
            toast.error("Something went wrong during logout.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogout}
            isLoading={loading}
            className="w-full"
        >
            Sign Out
        </Button>
    );
}