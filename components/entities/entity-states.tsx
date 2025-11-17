import { Spinner } from '../ui/spinner';

import { AlertTriangle } from 'lucide-react';

export interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = (props: LoadingViewProps) => {
  const { entity, message } = props;

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <Spinner />
      {!!message && (
        <p className="text-muted-foreground text-sm">{message || `Loading ${entity}...`}</p>
      )}
    </div>
  );
};

interface ErrorViewProps {
  message?: string;
}

export const ErrorView = (props: ErrorViewProps) => {
  const { message } = props;

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="text-primary size-6" />
      {!!message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
};
