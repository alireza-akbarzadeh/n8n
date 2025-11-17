import { requireAuth } from '@/src/core/auth';

export default async function Credentials() {
  await requireAuth();
  return <div>WorkflowPage</div>;
}
