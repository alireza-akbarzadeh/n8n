import { requireAuth } from '@/src/core/auth';

interface PageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionIdPage({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  return <div>ExecutionId : {executionId}</div>;
}
