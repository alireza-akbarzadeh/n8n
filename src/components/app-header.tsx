import { SidebarTrigger } from './ui/sidebar';

export function AppHeader() {
  return (
    <>
      <header className="bg-background flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>
    </>
  );
}
