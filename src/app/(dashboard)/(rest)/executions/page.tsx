import { requireAuth } from '@/core/auth';
import React from 'react';

export default async function Executions() {
  await requireAuth();
  return <div>executions</div>;
}
