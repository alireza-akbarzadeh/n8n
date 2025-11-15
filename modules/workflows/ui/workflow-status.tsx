import { ErrorView, LoadingView } from "@/components/entities/entity-states";

export const WorkflowLoading = () => <LoadingView message="workflow loading" />;
export const WorkflowError = () => <ErrorView message="Error while loading workflows..." />;
