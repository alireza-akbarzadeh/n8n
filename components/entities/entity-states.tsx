import { Spinner } from "../ui/spinner";

import { AlertTriangle } from "lucide-react";

export interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = (props: LoadingViewProps) => {
  const { entity, message } = props;

  return (
    <div className="flex-1 flex justify-center items-center h-full flex-col gap-y-4">
      <Spinner />
      {!!message && <p className="text-sm text-muted-foreground">{message || `Loading ${entity}...`}</p>}
    </div>
  );
};

interface ErrorViewProps {
  message?: string;
}

export const ErrorView = (props: ErrorViewProps) => {
  const { message } = props;

  return (
    <div className="flex-1 flex justify-center items-center h-full flex-col gap-y-4">
      <AlertTriangle className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
