'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/src/shared/ui/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/components/ui/button';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-0 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="text-muted-foreground h-4 w-4" />
          ) : (
            <Eye className="text-muted-foreground h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
