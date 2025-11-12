import { AppHeader } from "@/components/app-header";
import { WorkflowLayoutProps } from "./layout";

export default function WorkflowLayout({ children }: WorkflowLayoutProps) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
