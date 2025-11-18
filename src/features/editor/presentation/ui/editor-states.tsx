import { ErrorView, LoadingView } from '@/src/shared/ui/components/entities/entity-states';

export function EditorLoading() {
  return <LoadingView message="loading editor" />;
}

export function EditorError() {
  return <ErrorView message="Error while loading editor." />;
}
