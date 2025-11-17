'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useTransition } from 'react';
import { loginWithProvider } from '@/actions/auth';
import { toast } from 'sonner';

interface AuthProviderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: string;
  label: string;
  icon: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function AuthProviderButton(props: AuthProviderButtonProps) {
  const { provider, label, icon, className, type = 'button', ...rest } = props;
  const [loading, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      try {
        await loginWithProvider(provider);
      } catch (error: any) {
        toast.error(error.message ?? 'Something went wrong');
      }
    });
  };

  return (
    <Button
      variant="outline"
      className={className + ' gap-2'}
      onClick={onClick}
      isLoading={loading}
      type={type}
      {...rest}
    >
      <Image src={icon} width={20} height={20} alt={label} />
      {label}
    </Button>
  );
}
