"use client";
import { EntitySearch } from "@/components/entity-components";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows" />;
};
