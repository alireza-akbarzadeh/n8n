import React from 'react';

interface PageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowId({ params }: PageProps) {
  const { workflowId } = await params;
  return <div>WorkflowId : {workflowId}</div>;
}
