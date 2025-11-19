import { inngest } from '@/core/inngest/client';
import { NodeType } from '@/prisma/generated/prisma/enums';
import { topoLogicalSort } from '@/src/core/inngest/utils';
import { prisma } from '@/src/shared/infrastructure';
import { getExecutor } from '@/features/executions/infrastructure/executors';
import { NonRetriableError } from 'inngest';

export const excecuteWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflows/execute.workflow' },
  async ({ event, step }) => {
    const { workflowId } = event.data;
    if (!workflowId) throw new NonRetriableError('workflowId is missing');

    const sortedNodes = await step.run('prepare-workflow', async () => {
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

    const executionId = event.data.executionId || workflowId;
    let previousData = event.data.initialData || {};

    // Execute each node in order
    for (const node of sortedNodes) {
      const result = await step.run(`execute-node-${node.id}`, async () => {
        const executor = getExecutor(node.type as NodeType);

        return await executor.execute({
          workflowId,
          executionId,
          nodeId: node.id,
          previousData,
          environment: {}, // TODO: Add environment variables
        });
      });

      if (!result.success) {
        throw new NonRetriableError(`Node ${node.id} execution failed: ${result.error}`);
      }

      // Pass output to next node
      previousData = result.data || {};
    }

    return {
      success: true,
      executionId,
      nodesExecuted: sortedNodes.length,
    };
  }
);
