"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, error, ...props }, ref) => {
        const [show, setShow] = React.useState(false);

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={show ? "text" : "password"}
                    className={cn("pr-10", className)}
                    {...props}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                    onClick={() => setShow((prev) => !prev)}
                    tabIndex={-1}
                >
                    {show ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";