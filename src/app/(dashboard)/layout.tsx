import { AppSidebar } from '@/src/shared/ui/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/src/shared/ui/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">{children}</SidebarInset>
    </SidebarProvider>
  );
}
