import React from 'react';
import { LoginForm } from '@/modules/auth';
import { requireUnAuth } from '@/src/core/auth';

export default async function LoginPage() {
  await requireUnAuth();
  return (
    <section id="login" className="w-full max-w-md">
      <LoginForm />
    </section>
  );
}
