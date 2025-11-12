"use client";

import { ReactNode, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignOutButtonProps extends ButtonProps {
  redirectTo?: string;
  icon: ReactNode;
}

export function SignOutButton({ redirectTo = "/", icon, ...rest }: SignOutButtonProps) {
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
    } catch {
      toast.error("Something went wrong during logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} isLoading={loading} {...rest}>
      {icon && icon}
      Sign Out
    </Button>
  );
}
