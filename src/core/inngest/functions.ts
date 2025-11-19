import { inngest } from '@/core/inngest/client';
import { topoLogicalSort } from '@/src/core/inngest/utils';
import { prisma } from '@/src/shared/infrastructure';
import { NonRetriableError } from 'inngest';

export const excecuteWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflows/execute.workflow' },
  async ({ event, step }) => {
    const { workflowId } = event.data;
    if (!workflowId) throw new NonRetriableError('workflowId is missing');
    const strtedNode = await step.run('prepare-workflow', async () => {
      const workflow = await prisma.workflow.findFirstOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connection: true,
        },
      });
      return topoLogicalSort(workflow.nodes, workflow.connection);
    });
    return strtedNode;
  }
);
