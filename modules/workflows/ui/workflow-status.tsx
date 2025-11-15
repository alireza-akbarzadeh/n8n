import { ErrorView, LoadingView } from "@/components/entity-components";

export const WorkflowLoading = () => <LoadingView message="workflow loading" />;
export const WorkflowError = () => <ErrorView message="Error while loading workflows..." />;
