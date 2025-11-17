'use client';

import { EntityContainer } from '@/components/entities/entity-containers';
import { useSuspenseWorkflows } from '../hooks/use-workflows';
import { WorkflowHeader } from '../ui/workflow-header';
import { WorkflowPagination } from '../ui/workflow-pagination';
import { WorkflowSearch } from '../ui/workflow-search';

export const WorkflowContainer = ({ children }: { children?: React.ReactNode }) => {
  const workflow = useSuspenseWorkflows();

  return (
    <>
      <EntityContainer
        hasPaginate={workflow.data.data?.hasPaginate}
        header={<WorkflowHeader />}
        search={<WorkflowSearch />}
        pagination={<WorkflowPagination />}
      >
        {children}
      </EntityContainer>
    </>
  );
};
