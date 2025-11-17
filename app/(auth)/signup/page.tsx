import React from 'react';
import { RegisterForm } from '@/modules/auth';
import { requireUnAuth } from '@/actions/auth';

export default async function RegisterPage() {
  await requireUnAuth();
  return (
    <section id="register" className="w-full max-w-md">
      <RegisterForm />
    </section>
  );
}
