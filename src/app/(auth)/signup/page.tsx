import { requireUnAuth } from '@/core/auth';
import { RegisterForm } from '@/features/auth';
import React from 'react';

export default async function RegisterPage() {
  await requireUnAuth();
  return (
    <section id="register" className="w-full max-w-md">
      <RegisterForm />
    </section>
  );
}
