'use server';

import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function loginWithProvider(provider: string) {
  const result = await signIn.social({
    provider,
    callbackURL: '/dashboard', // change if needed
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.data.url) return redirect(result.data.url);
}

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return redirect('/login');
  return session;
}

export async function requireUnAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) return redirect('/');
  return session;
}
