import { AppHeader } from "@/components/app-header";

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
