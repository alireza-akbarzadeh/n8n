import { requireAuth } from '@/src/core/auth';

interface PageProps {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialIdPage({ params }: PageProps) {
  await requireAuth();
  const { credentialId } = await params;
  return <div>CredentialId : {credentialId}</div>;
}
