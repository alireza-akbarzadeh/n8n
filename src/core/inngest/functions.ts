import { inngest } from '@/core/inngest/client';

export const excecuteWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflow.execute' },
  async ({ event, step }: { event: any; step: any }) => {
    await step.sleep('test', '5s');
  }
);
