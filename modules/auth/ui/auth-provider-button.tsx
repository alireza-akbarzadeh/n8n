"use client";

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useTransition} from "react";
import {loginWithProvider} from "@/actions/auth";
import {toast} from "sonner";

interface AuthProviderButtonProps {
    provider: string;
    label: string;
    icon: string;
    className?: string;
}

export function AuthProviderButton(props: AuthProviderButtonProps) {
    const {provider, label, icon, className} = props;
    const [loading, startTransition] = useTransition();

    const onClick = () => {
        startTransition(async () => {
            try {
                await loginWithProvider(provider);
            } catch (error: any) {
                toast.error(error.message ?? "Something went wrong");
            }
        });
    };

    return (
        <Button
            variant="outline"
            className={className + " gap-2"}
            onClick={onClick}
            isLoading={loading}
        >
            <Image src={icon} width={20} height={20} alt={label}/>
            {label}
        </Button>
    );
}