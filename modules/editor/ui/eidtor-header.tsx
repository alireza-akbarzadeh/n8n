'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EditorSaveButton } from './editor-save-button';
import { EditorBreadcrump } from './editor-breadcrump';

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger />
        <div className="flex flex-row items-center justify-between gap-x-4 w-full">
          <EditorBreadcrump workflowId={workflowId} />
          <EditorSaveButton workflowId={workflowId} />
        </div>
      </header>
    </>
  );
}
