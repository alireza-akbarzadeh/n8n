import { requireAuth } from '@/actions/auth';
import React from 'react';

interface PageProps {
  params: Promise<{ executionId: string }>;
}

export default async function CredentialIdPage({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  return <div>CredentialId : {executionId}</div>;
}
