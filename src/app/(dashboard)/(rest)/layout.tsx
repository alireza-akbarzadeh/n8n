import { AppHeader } from '@/src/shared/ui/components/app-header';
import React from 'react';

interface WorkflowLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: WorkflowLayoutProps) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
