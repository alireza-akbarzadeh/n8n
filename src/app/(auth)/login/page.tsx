import React from 'react';
import { LoginForm } from '@/modules/auth';
import { requireUnAuth } from '@/actions/auth';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage() {
  await requireUnAuth();
  return (
    <section id="login" className="w-full max-w-md">
      <LoginForm />
    </section>
  );
}
