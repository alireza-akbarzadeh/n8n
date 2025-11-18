import React from 'react';
import { LoginForm } from '@/features/auth';
import { requireUnAuth } from '@/core/auth';

export default async function LoginPage() {
  await requireUnAuth();
  return (
    <section id="login" className="w-full max-w-md">
      <LoginForm />
    </section>
  );
}
