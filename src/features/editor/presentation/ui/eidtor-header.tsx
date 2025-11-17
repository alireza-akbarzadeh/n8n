'use client';
import { SidebarTrigger } from '@/src/shared/ui/components/ui/sidebar';
import { EditorSaveButton } from './editor-save-button';
import { EditorBreadcrump } from './editor-breadcrump';

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <>
      <header className="bg-background flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex w-full flex-row items-center justify-between gap-x-4">
          <EditorBreadcrump workflowId={workflowId} />
          <EditorSaveButton workflowId={workflowId} />
        </div>
      </header>
    </>
  );
}
