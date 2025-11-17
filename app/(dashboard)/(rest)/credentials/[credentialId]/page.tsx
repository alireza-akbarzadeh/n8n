import { requireAuth } from '@/actions/auth';
import React from 'react';

interface PageProps {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialIdPage({ params }: PageProps) {
  await requireAuth();
  const { credentialId } = await params;
  return <div>CredentialId : {credentialId}</div>;
}
